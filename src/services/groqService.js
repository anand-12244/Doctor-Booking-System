import axios from 'axios';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const groqService = {
  async analyzeSymptoms(symptoms) {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured. Please configure it in your .env file.');
    }

    const prompt = `You are a medical assistant AI. Based on the symptoms provided, suggest which medical specialities the patient should consult.

Available Specialities in our clinic:
- General physician (for general fever, cold, general health issues, cough)
- Gynecologist (for pregnancy, female reproductive health, PCOS, periods)
- Dermatologist (for skin, hair, nails issues, rashes, acne, eczema)
- Pediatricians (for children and infants issues)
- Neurologist (for brain, nerves, headaches, migraines, spine, seizures)
- Gastroenterologist (for stomach, digestion, acidity, bowel issues, reflux)

Symptoms: ${symptoms}

Please respond in JSON format with:
{
  "specialities": ["General physician", "Neurologist", ...], // Select ONLY from the list of Available Specialities above
  "confidence": "high/medium/low",
  "initial_assessment": "Provide a professional, clear medical explanation of what could be causing the symptoms in a clinical tone.",
  "recommended_steps": ["Step 1", "Step 2", ...], // Bulleted recommendations for the patient
  "urgency": "routine/urgent/emergency"
}

Only respond with valid JSON, no additional text.`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format received from AI.');
    }

    return JSON.parse(jsonMatch[0]);
  },

  async getSymptomsDescription(symptom) {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured. Please configure it in your .env file.');
    }

    const prompt = `You are a medical AI. Provide a brief description of this symptom and what could cause it.

Symptom: ${symptom}

Respond in JSON format:
{
  "description": "what is this symptom",
  "possible_causes": ["cause1", "cause2", ...],
  "when_to_see_doctor": "guidance"
}

Only respond with valid JSON.`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format received from AI.');
    }

    return JSON.parse(jsonMatch[0]);
  },
};

export default groqService;
