from datetime import datetime
from typing import Dict, Any, List

def analyze_soil_health(
    ph: float = 7.4,
    nitrogen: float = 185.0, # kg/ha
    phosphorus: float = 24.5, # kg/ha
    potassium: float = 340.0, # kg/ha
    organic_carbon: float = 0.58, # %
    moisture: float = 28.0, # %
    crop: str = "Wheat"
) -> Dict[str, Any]:
    """
    Evaluates in-situ soil test parameters against ICAR standard agronomic thresholds
    and generates precise regenerative & fertigation recommendations.
    """
    now_str = datetime.now().strftime("%d %b %Y, %H:%M IST")

    # pH classification
    if ph < 6.0:
        ph_status = "Acidic (Liming advised)"
    elif 6.0 <= ph <= 7.5:
        ph_status = "Optimal Neutral"
    elif 7.5 < ph <= 8.2:
        ph_status = "Moderately Alkaline (Calcareous tendency)"
    else:
        ph_status = "Strongly Alkaline (Gypsum application advised)"

    # Nitrogen classification (ICAR benchmark: < 280 Low, 280-560 Medium, > 560 High)
    if nitrogen < 240:
        n_status = "Sub-optimal / Low (Deficient)"
    elif 240 <= nitrogen <= 450:
        n_status = "Medium / Adequate"
    else:
        n_status = "High / Excess"

    # Phosphorus classification (ICAR: < 11 Low, 11-25 Medium, > 25 High)
    if phosphorus < 12:
        p_status = "Low (Deficient)"
    elif 12 <= phosphorus <= 25:
        p_status = "Medium / Adequate"
    else:
        p_status = "High"

    # Potassium classification (ICAR: < 140 Low, 140-280 Medium, > 280 High)
    if potassium < 140:
        k_status = "Low (Deficient)"
    elif 140 <= potassium <= 280:
        k_status = "Medium / Adequate"
    else:
        k_status = "High / Luxury Consumption"

    # Organic Carbon classification (ICAR: < 0.50 Low, 0.50-0.75 Medium, > 0.75 High)
    if organic_carbon < 0.50:
        oc_status = "Critically Depleted"
    elif 0.50 <= organic_carbon <= 0.75:
        oc_status = "Moderate / Sub-optimal"
    else:
        oc_status = "Rich / High"

    # Recommendations
    recommendations: List[str] = []
    regenerative_actions: List[str] = []
    fertilizer_adjustments: List[str] = []

    # Potassium adjustment
    if potassium > 280:
        recommendations.append("Reduce or withhold chemical MOP (Muriate of Potash) application. Current soil reserves are in luxury consumption zone.")
        fertilizer_adjustments.append("MOP (0-0-60): Reduce by 40-50% to prevent luxury uptake and save ₹850/hectare.")
    elif potassium < 140:
        recommendations.append("Apply potassium sulfate to support grain filling and osmotic stress tolerance.")
        fertilizer_adjustments.append("MOP: Apply 35 kg/ha in two split applications.")

    # Nitrogen adjustment
    if nitrogen < 240:
        recommendations.append("Nitrogen is deficient. Apply split top-dressing of Neem Coated Urea synchronized with vegetative tillering.")
        fertilizer_adjustments.append("Urea (46% N): Split 55 kg/ha at crown root initiation, 45 kg/ha at first node.")
        regenerative_actions.append("Incorporate Azotobacter bio-fertilizer seed inoculation to fix 20-25 kg atmospheric N/ha organically.")

    # Organic carbon
    if organic_carbon < 0.75:
        recommendations.append(f"Soil Organic Carbon ({organic_carbon}%) is sub-optimal. Enhance microbial biomass through biochar and farmyard compost.")
        regenerative_actions.append("Apply 2.5 tonnes/ha decomposed Farmyard Manure (FYM) or 1.2 tonnes/ha Pyrolyzed Biochar.")
        regenerative_actions.append("Practice in-situ paddy stubble mulching via Happy Seeder rather than open burning.")

    # pH guidance
    if ph > 7.5:
        recommendations.append("Slight alkalinity may tie up micronutrients (Zinc and Iron). Foliar spray of Chelated Zinc (Zn-EDTA 0.5%) recommended.")

    return {
        "ph_status": ph_status,
        "nitrogen_status": n_status,
        "phosphorus_status": p_status,
        "potassium_status": k_status,
        "carbon_status": oc_status,
        "recommendations": recommendations,
        "regenerative_actions": regenerative_actions,
        "fertilizer_adjustments": fertilizer_adjustments,
        "soil_health_index": round(min(98, max(40, (ph/7.0)*25 + (nitrogen/300)*25 + (phosphorus/25)*20 + (organic_carbon/1.0)*30)), 1),
        "data_source": "Farmer In-situ Soil Sample / ICAR Soil Health Card Testing Standards",
        "timestamp": now_str
    }
