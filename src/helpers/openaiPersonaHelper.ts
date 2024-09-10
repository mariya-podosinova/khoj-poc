import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const retryWithBackoff = async (fn: () => Promise<any>, retries = 5, delay = 1000): Promise<any> => {
    try {
        return await fn();
    } catch (error: any) {
        if (retries === 0 || error.response?.status !== 429) throw error;
        await new Promise(res => setTimeout(res, delay));
        return retryWithBackoff(fn, retries - 1, delay * 2);
    }
};

export const createPersona = async (insights: any[]): Promise<any> => {
    const messages = [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user", content: `Based on the insights and data, create detailed primary and secondary user personas that represent the target audience. Exclude names and roles. Include demographic information, goals, pain points, user needs, and behaviors for each persona. Here is the data: ${JSON.stringify(insights)}.

Please return the response in the following JSON format:
{
  "personas": [
    {
      "background": "<background>",
      "demographics": {
        "age": <age>,
        "location": "<location>",
        "maritalStatus": "<maritalStatus>",
        "accessibility": "<accessibility>"
      },
      "needs": "<needs>",
      "goals": "<goals>",
      "painPoints": "<painPoints>",
      "socialMedia": "<socialMedia>"
    },
    {
      "background": "<background>",
      "demographics": {
        "age": <age>,
        "location": "<location>",
        "maritalStatus": "<maritalStatus>",
        "accessibility": "<accessibility>"
      },
      "needs": "<needs>",
      "goals": "<goals>",
      "painPoints": "<painPoints>",
      "socialMedia": "<socialMedia>"
    }
  ]
}`
        },
    ];

    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000, // Adjust token limit as needed
    };

    const response = await retryWithBackoff(() => openai.chat.completions.create(requestBody));

    try {
        const content = response.choices[0].message.content;
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
        const personaData = JSON.parse(jsonString);

        if (personaData.personas.length !== 2) {
            throw new Error("Expected exactly two personas in the response.");
        }

        // Manually set names and roles
        personaData.personas[0].name = "Participant 1";
        personaData.personas[0].role = "Primary persona";
        personaData.personas[1].name = "Participant 2";
        personaData.personas[1].role = "Secondary persona";

        return personaData;
    } catch (error) {
        console.error("Error parsing JSON response:", error.message);
        throw new Error("Invalid JSON response from OpenAI");
    }
};

const replaceNameInDescription = (persona: any, placeholder: string) => {
    const nameRegex = /[A-Z][a-z]+ [A-Z][a-z]+/; // Simple regex to match "First Last" names
    for (const key in persona) {
        if (typeof persona[key] === 'string') {
            persona[key] = persona[key].replace(nameRegex, placeholder);
        } else if (typeof persona[key] === 'object') {
            for (const subKey in persona[key]) {
                if (typeof persona[key][subKey] === 'string') {
                    persona[key][subKey] = persona[key][subKey].replace(nameRegex, placeholder);
                }
            }
        }
    }
    return persona;
};
