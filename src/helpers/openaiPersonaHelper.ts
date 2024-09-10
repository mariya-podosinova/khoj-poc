import OpenAI from 'openai';
import { Persona } from '../types';

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

export const createPersona = async (insights: any[]): Promise<{ personas: Persona[] }> => {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user", content: `Based on the insights and data, create detailed primary and secondary user personas that represent the target audience. Exclude names and roles. Include demographic information, goals, pain points, user needs, and behaviors for each persona. Here is the data: ${JSON.stringify(insights)}.

Please return the response in the following JSON format:
{
  "personas": [
    {
      "background": "<background>",
      "demographics": {
        "age": "<age>", // Ensure the age range is preserved, e.g., "25-35 years"
        "location": "<location>",
        "maritalStatus": "<maritalStatus>",
        "accessibility": "<accessibility>"
      },
      "needs": [
        "<key>: <description>",
        "<key>: <description>",
        "<key>: <description>"
      ],
      "goals": "<goals>",
      "painPoints": "<painPoints>",
      "socialMedia": "<socialMedia>"
    },
    {
      "background": "<background>",
      "demographics": {
        "age": "<age>", // Ensure the age range is preserved, e.g., "30-40 years"
        "location": "<location>",
        "maritalStatus": "<maritalStatus>",
        "accessibility": "<accessibility>"
      },
      "needs": [
        "<key>: <description>",
        "<key>: <description>",
        "<key>: <description>"
      ],
      "goals": "<goals>",
      "painPoints": "<painPoints>",
      "socialMedia": "<socialMedia>"
    }
  ]
}`
        },
    ];

    const requestBody: OpenAI.ChatCompletionCreateParamsNonStreaming = {
        model: "gpt-4",
        messages: messages,
        max_tokens: 1000, // Adjust token limit as needed
    };

    const response = await retryWithBackoff(() => openai.chat.completions.create(requestBody));

    try {
        const content = response.choices[0]?.message?.content || '';
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
        const personaData = JSON.parse(jsonString) as { personas: any[] };

        // Validate and adjust the JSON format
        const personas = personaData.personas.map(p => ({
            ...p,
            demographics: {
                ...p.demographics,
                // Preserve age range as string
                age: p.demographics.age || '',
            },
            name: '', // Temporarily set to empty, to be adjusted in the next step
            role: '', // Temporarily set to empty, to be adjusted in the next step
        })) as Persona[];

        if (personas.length !== 2) {
            throw new Error("Expected exactly two personas in the response.");
        }

        // Manually set names and roles
        personas[0].name = "Participant 1";
        personas[0].role = "Primary persona";
        personas[1].name = "Participant 2";
        personas[1].role = "Secondary persona";

        return { personas };
    } catch (error) {
        console.error("Error parsing OpenAI response:", error);
        console.error("Response content (trimmed):", response.choices[0]?.message?.content?.trim());
        throw new Error("Invalid JSON response from OpenAI");
    }
};
