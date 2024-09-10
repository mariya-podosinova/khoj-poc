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

    const requestBody: OpenAI.ChatCompletionCreateParamsNonStreaming = {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000, // Adjust token limit as needed
    };

    const response = await retryWithBackoff(() => openai.chat.completions.create(requestBody));

    try {
        const content = response.choices[0].message.content;
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
        const personaData = JSON.parse(jsonString) as { personas: Persona[] };

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
        console.error("Error parsing OpenAI response:", error);
        console.error("Response content (trimmed):", response.choices[0]?.message?.content?.trim());
        throw new Error("Invalid JSON response from OpenAI");
    }
};

const replaceNameInDescription = (persona: Persona, placeholder: string): Persona => {
    const nameRegex = /[A-Z][a-z]+ [A-Z][a-z]+/; // Simple regex to match "First Last" names

    // Helper function to replace names in a string
    const replaceInString = (str: string) => str.replace(nameRegex, placeholder);

    // Replace names in strings and objects
    persona.background = replaceInString(persona.background);
    persona.needs = replaceInString(persona.needs);
    persona.goals = replaceInString(persona.goals);
    persona.painPoints = replaceInString(persona.painPoints);
    persona.socialMedia = replaceInString(persona.socialMedia);

    return persona;
};
