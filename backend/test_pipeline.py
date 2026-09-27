import sys
import io
from PIL import Image
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def run_tests():
    print("=== 1. Testing /api/health ===")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    health = r.json()
    print("Health response:", health)
    assert "earth_engine" in health
    assert "satellite_pipeline" in health

    print("\n=== 2. Testing /api/satellite GET ===")
    r = client.get("/api/satellite?lat=25.92&lon=81.99&farm_id=plotA")
    assert r.status_code == 200, f"Satellite GET failed: {r.text}"
    sat = r.json()
    print(f"Satellite GET response: source_state={sat['source_state']}, is_live={sat['is_live']}, NDVI={sat['ndvi']}, NDWI={sat['ndwi']}, trend={sat['vegetation_trend']}")
    assert sat["source_state"] in ["LIVE", "DEMO", "CALCULATED", "SIMULATION"]
    assert "farm_statistics" in sat
    assert "vegetation_trend" in sat
    assert "observation_date" in sat
    assert "cloud_cover_percent" in sat

    print("\n=== 3. Testing /api/satellite POST with Polygon ===")
    poly = [
        [25.9221, 81.9880],
        [25.9235, 81.9945],
        [25.9185, 81.9962],
        [25.9172, 81.9898]
    ]
    r = client.post("/api/satellite", json={"latitude": 25.92, "longitude": 81.99, "polygon": poly, "farm_id": "plotA"})
    assert r.status_code == 200, f"Satellite POST failed: {r.text}"
    sat_poly = r.json()
    print(f"Satellite POST response: source_state={sat_poly['source_state']}, stats={sat_poly['farm_statistics']}")
    assert sat_poly["polygon"] is not None

    print("\n=== 4. Testing /api/satellite/status ===")
    r = client.get("/api/satellite/status")
    assert r.status_code == 200
    print("Satellite status:", r.json())

    print("\n=== 5. Testing /api/context GET ===")
    r = client.get("/api/context")
    assert r.status_code == 200, f"Context GET failed: {r.text}"
    ctx = r.json()
    print(f"Farm Context: farm_id={ctx['farm_id']}, crop={ctx['crop']}, stage={ctx['growth_stage']}, soil_ph={ctx['soil']['ph']}, weather_temp={ctx['weather']['temperature_c']}, sat_ndvi={ctx['satellite']['ndvi']}")
    assert "satellite" in ctx
    assert "weather" in ctx
    assert "soil" in ctx
    assert "location" in ctx

    print("\n=== 6. Testing /api/risk/current (Context-derived Risk Engine) ===")
    r = client.get("/api/risk/current")
    assert r.status_code == 200, f"Risk current failed: {r.text}"
    risk = r.json()
    print(f"Risk Composite Score: {risk['composite_risk_score']}/100 ({risk['risk_level']})")
    print(f"Factor breakdown: {risk['factor_breakdown']}")
    print(f"Factor explanations: {risk['factor_explanations']}")
    assert "factor_explanations" in risk
    assert "weather" in risk["factor_explanations"]
    assert "vegetation" in risk["factor_explanations"]
    assert "water_soil" in risk["factor_explanations"]
    assert "disease" in risk["factor_explanations"]

    print("\n=== 7. Testing Crop Doctor Image Upload (Valid JPEG) ===")
    # Generate a small 100x100 green test image
    img = Image.new("RGB", (100, 100), color=(34, 139, 34))
    img_buf = io.BytesIO()
    img.save(img_buf, format="JPEG")
    img_bytes = img_buf.getvalue()

    r = client.post(
        "/api/crop_doctor/diagnose",
        files={"image": ("test_leaf.jpg", img_bytes, "image/jpeg")},
        data={"crop_hint": "Wheat"}
    )
    assert r.status_code == 200, f"Crop doctor diagnose failed: {r.text}"
    diag = r.json()
    print(f"Crop Doctor result: crop_name='{diag['crop_name']}', disease='{diag['disease_name']}', severity='{diag['severity']}', confidence={diag['confidence']}")
    print(f"Source state: {diag['source_state']}, mode: {diag['mode']}")
    print(f"Symptoms: {diag['symptoms']}")
    print(f"Recommended actions: {diag['recommended_actions']}")

    # Verify all 12 required structured fields
    required_fields = [
        "crop_name", "leaf_name", "health_status", "disease_name",
        "confidence", "severity", "symptoms", "possible_causes",
        "recommended_actions", "prevention", "image_quality",
        "needs_expert_confirmation"
    ]
    for field in required_fields:
        assert field in diag, f"Field '{field}' missing from CropDoctorResponse!"
        print(f"  [OK] {field}: {diag[field]}")

    print("\n=== 8. Testing Crop Doctor Invalid File Handling ===")
    # 8a: Non-image content type
    r_bad_type = client.post(
        "/api/crop_doctor/diagnose",
        files={"image": ("test.txt", b"plain text is not an image", "text/plain")},
        data={"crop_hint": "Wheat"}
    )
    assert r_bad_type.status_code == 400
    print("  [OK] Non-image rejected with 400:", r_bad_type.json()["detail"])

    # 8b: Empty image file
    r_empty = client.post(
        "/api/crop_doctor/diagnose",
        files={"image": ("empty.jpg", b"", "image/jpeg")},
        data={"crop_hint": "Wheat"}
    )
    assert r_empty.status_code == 400
    print("  [OK] Empty image rejected with 400:", r_empty.json()["detail"])

    # 8c: Corrupt image file
    r_corrupt = client.post(
        "/api/crop_doctor/diagnose",
        files={"image": ("corrupt.jpg", b"corrupted random bytes 12345", "image/jpeg")},
        data={"crop_hint": "Wheat"}
    )
    assert r_corrupt.status_code == 400
    print("  [OK] Corrupt image rejected with 400:", r_corrupt.json()["detail"])

    print("\n=== 9. Testing Context Synchronization with Latest Diagnosis ===")
    r_ctx_updated = client.get("/api/context")
    assert r_ctx_updated.status_code == 200
    ctx_updated = r_ctx_updated.json()
    assert ctx_updated["crop_doctor"] is not None
    print(f"  [OK] Unified Context automatically holds Crop Doctor diagnosis: {ctx_updated['crop_doctor']['disease_name']}")

    print("\n=== 10. Testing Risk Engine factoring in Crop Doctor ===")
    r_risk_after = client.get("/api/risk/current")
    assert r_risk_after.status_code == 200
    risk_after = r_risk_after.json()
    print(f"  [OK] Risk Engine updated with disease explanation: {risk_after['factor_explanations']['disease']}")

    print("\n=== 11. Testing Gemini Agricultural Advisor with Context ===")
    r_adv = client.post(
        "/api/advisor",
        json={"question": "Should I irrigate Plot A today given the clouds and wheat rust?"}
    )
    assert r_adv.status_code == 200
    adv = r_adv.json()
    print(f"  [OK] Advisor response: {adv['advice']}")
    print(f"  [OK] Advisor reasoning: {adv['reasoning']}")

    print("\n ALL BACKEND PIPELINE TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
