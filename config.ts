// Demo mode configuration
export const isDemo = !process.env.API_KEY;

export const DEMO_ESSAYS = {
  "Impact of Dehydration on Kidneys": `# Impact of Dehydration on Kidneys

## Introduction & Physiology

Dehydration occurs when the body loses more fluids than it takes in, significantly compromising kidney function. The kidneys are vital organs responsible for filtering waste products and excess water from the blood to produce urine. When dehydration occurs, the kidneys struggle to maintain this critical function, potentially leading to serious health complications.

## Relevance to Sri Lanka

Sri Lanka's tropical climate creates an environment where dehydration is a constant threat. The North Central Province (Rajarata) experiences intense heat and humidity, particularly during the dry season. Agricultural workers in these regions face chronic dehydration due to prolonged sun exposure during rice cultivation and other farming activities. This persistent dehydration is considered a significant risk factor in the development of CKDu (Chronic Kidney Disease of unknown etiology).

## Causes & Risk Factors

**Direct causes of dehydration include:**
- Insufficient water intake in hot climates
- Excessive perspiration during physical labor
- Diarrheal diseases
- Vomiting and fever
- Diabetes-related polyuria

In the Sri Lankan context, agricultural workers often ignore thirst signals while working, leading to cumulative dehydration over weeks and months. This chronic dehydration combined with heat stress can trigger kidney damage.

## Symptoms & Early Warning Signs

- Dark or scanty urine
- Extreme fatigue and letharness
- Dizziness and headaches
- Dry mouth and lips
- Rapid heartbeat
- Muscle cramps

## Diagnosis & Treatment

Blood tests measuring creatinine levels and urine specific gravity are used to diagnose dehydration-related kidney stress. Treatment involves gradual rehydration with plain water and electrolyte solutions.

## Prevention

**For kidney health in hot climates:**
- Drink water BEFORE feeling thirsty (at least 2-3 liters daily)
- Limit sugary drinks and excessive salt
- Take regular breaks during physical labor
- Monitor urine color (pale yellow indicates good hydration)
- Use electrolyte solutions during prolonged heat exposure

## Conclusion

Preventing dehydration is crucial for maintaining kidney health in Sri Lanka's climate. By adopting simple hydration practices, agricultural workers and the general population can significantly reduce their risk of developing CKDu and other kidney complications.`,

  "Understanding Creatinine Levels": `# Understanding Creatinine Levels

## Introduction & Physiology

Creatinine is a waste product of muscle metabolism that is filtered by the kidneys and excreted in urine. Understanding creatinine levels is essential for detecting kidney disease early. Normal creatinine levels vary by age, sex, and muscle mass.

## Relevance to Sri Lanka

In Sri Lanka, routine creatinine testing is available at government hospitals and private facilities. Regular monitoring is particularly important for populations at risk of CKDu, such as agricultural workers in Rajarata.

## Causes & Risk Factors

Elevated creatinine levels indicate reduced kidney function caused by:
- Chronic dehydration
- Hypertension
- Diabetes mellitus
- NSAIDs abuse
- Heavy metal exposure (cadmium, arsenic)

## Symptoms & Early Warning Signs

Elevated creatinine often presents with no symptoms, making regular testing critical for early detection.

## Diagnosis & Testing

- Normal range: 0.6 - 1.2 mg/dL for men, 0.5 - 1.1 mg/dL for women
- eGFR (estimated Glomerular Filtration Rate) is calculated from creatinine
- Serial testing shows trends in kidney function

## Prevention & Management

- Maintain proper hydration
- Control blood pressure and diabetes
- Avoid NSAIDs
- Regular health checkups
- Dietary modifications

## Conclusion

Regular creatinine monitoring enables early detection and intervention in kidney disease, improving long-term outcomes.`,

  "CKDu in the North Central Province": `# CKDu in the North Central Province

## Introduction & Physiology

Chronic Kidney Disease of unknown etiology (CKDu) is a specific form of kidney disease that affects large populations in Sri Lanka, particularly in the North Central Province (Rajarata region).

## Relevance to Sri Lanka

The Rajarata region includes districts such as Polonnaruwa and Anuradhapura, where CKDu prevalence rates reach 18-20% among certain populations. This is significantly higher than typical CKD rates in other regions.

## Causes & Risk Factors

**Suspected etiological factors:**
- Chronic dehydration from heat exposure
- Agrochemical exposure (pesticides, fertilizers)
- Heavy metal contamination (cadmium, arsenic)
- Hard water with high mineral content
- Combined effect of multiple stressors

Unlike Type 1 or Type 2 CKD, CKDu develops without primary diabetes or hypertension, making it unique.

## Symptoms & Early Warning Signs

- Asymptomatic in early stages
- Fatigue and weakness
- Swelling of ankles and feet (edema)
- Reduced urine output
- Back pain

## Diagnosis & Treatment

Early detection through eGFR and urine albumin testing is crucial. Treatment focuses on slowing progression through hydration management and dietary modifications.

## Prevention

- Adequate hydration (2.5-3 liters daily)
- Protective equipment for pesticide exposure
- Regular health monitoring
- Dietary modifications reducing strain on kidneys

## Conclusion

Understanding CKDu and its risk factors is essential for the affected communities in Sri Lanka to prevent disease progression and maintain quality of life.`
};

export const DEMO_CHAT_RESPONSES = {
  greeting: "Ayubowan! I'm Dr. Kidney AI, your virtual health guide. How can I help you learn about kidney health today?",
  hydration: "In Sri Lanka's hot climate, drink 2.5-3 liters of water daily. Drink before you feel thirsty! Coconut water (Thambili) is good, but limit it if you have advanced CKD due to high potassium content.",
  symptoms: "Common kidney disease signs include fatigue, swelling in feet/ankles, foamy urine, and frequent urination at night. If you notice these symptoms, consult a doctor immediately.",
  diet: "A kidney-friendly Sri Lankan diet includes red rice (Kurakkan), plenty of vegetables, and limited salt. Avoid excessive dry fish (Karawala), as it's high in sodium. Include fresh fruits in moderation.",
  ckdu: "CKDu (Chronic Kidney Disease of unknown etiology) affects many in Rajarata. It's linked to dehydration, agrochemicals, and hard water. Prevention: stay hydrated, wear protective gear when handling chemicals, and get regular health checkups.",
  exercise: "Moderate exercise like walking 30 minutes daily helps. It improves circulation and maintains healthy weight. In the heat, exercise early morning or evening and stay well-hydrated.",
  medication: "Never use NSAIDs (Ibuprofen, Diclofenac) without medical advice - they can damage kidneys. Always consult your doctor before taking any medication.",
  default: "That's an important question about kidney health. Please consult a nephrologist for personalized medical advice. In the meantime, focus on staying hydrated and maintaining a healthy diet."
};
