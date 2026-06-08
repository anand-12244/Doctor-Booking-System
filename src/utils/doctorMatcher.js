// Match recommended specialities with available doctors
export const matchDoctorsWithSpecialities = (doctors, specialities) => {
  if (!specialities || specialities.length === 0) {
    return [];
  }

  // Normalize specialities for matching
  const normalizeSpeciality = (spec) => {
    return spec.toLowerCase().replace(/\s+/g, '');
  };

  const normalizedSpecialities = specialities.map(normalizeSpeciality);

  // Filter doctors whose speciality matches recommended specialities
  const matchedDoctors = doctors.filter((doctor) => {
    const doctorSpec = normalizeSpeciality(doctor.speciality);
    return normalizedSpecialities.some((spec) => {
      return doctorSpec.includes(spec) || spec.includes(doctorSpec);
    });
  });

  // Sort by availability and rating
  return matchedDoctors.sort((a, b) => {
    if (a.available !== b.available) {
      return b.available ? 1 : -1;
    }
    return (b.rating || 0) - (a.rating || 0);
  });
};

// Get speciality suggestions from doctors database
export const getAvailableSpecialities = (doctors) => {
  const specialities = [...new Set(doctors.map((doc) => doc.speciality))];
  return specialities.sort();
};

// Match symptom keywords with specialities
export const getSpecialitiesForSymptoms = (symptomText, doctors) => {
  const symptomKeywords = {
    'skin|rash|eczema|acne|mole|dermatitis|psoriasis|vitiligo|wart': 'Dermatologist',
    'heart|cardiac|chest pain|arrhythmia|blood pressure|hypertension': 'Cardiologist',
    'stomach|digestive|acid reflux|ibs|gastritis|ulcer|constipation|diarrhea': 'Gastroenterologist',
    'headache|migraine|neurological|nerve|seizure|vertigo|tremor': 'Neurologist',
    'period|menstrual|pregnancy|gynecological|ovarian|uterine|breast|pcos': 'Gynecologist',
    'child|pediatric|infant|baby|growth|development|vaccination|fever|cough': 'Pediatricians',
    'bone|fracture|joint|arthritis|spine|orthopedic|ligament|muscle|tendon': 'Orthopedist',
    'eye|vision|sight|contact lens|glasses|cataract|glaucoma|retina': 'Ophthalmologist',
    'tooth|dental|cavity|root canal|gum|orthodontic|wisdom tooth': 'Dentist',
  };

  const lowerSymptom = symptomText.toLowerCase();
  const matchedSpecialities = [];

  for (const [keywords, speciality] of Object.entries(symptomKeywords)) {
    const keywordArray = keywords.split('|');
    if (keywordArray.some((keyword) => lowerSymptom.includes(keyword))) {
      if (!matchedSpecialities.includes(speciality)) {
        matchedSpecialities.push(speciality);
      }
    }
  }

  // If no matches, return general physician
  if (matchedSpecialities.length === 0) {
    matchedSpecialities.push('General physician');
  }

  return matchedSpecialities;
};

export default {
  matchDoctorsWithSpecialities,
  getAvailableSpecialities,
  getSpecialitiesForSymptoms,
};
