import { OpenAI } from 'openai';

// Initialize OpenAI client with proper configuration
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

// Type definitions for the API response
interface Theme {
    broaderTheme: string;
    subThemes: {
        broaderTheme: string;
        subTheme: string;
        code: string;
        occurrences: number;
    }[];
}

// Retry function with exponential backoff
export const retryWithBackoff = async <T>(fn: () => Promise<T>, retries = 5, delay = 1000): Promise<T> => {
    try {
        return await fn();
    } catch (error: any) {
        if (retries === 0 || error.response?.status !== 429) throw error;
        await new Promise(res => setTimeout(res, delay));
        return retryWithBackoff(fn, retries - 1, delay * 2);
    }
};

// Create themes from extracted texts and objectives
export const createThemes = async (extractedTexts: string[], objective: string): Promise<Theme[]> => {
    const themes: Theme[] = [];
    
    for (const extractedText of extractedTexts) {
        const messages = [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user", content: `Based on the analysis of the transcripts, create a JSON array where each object has the following fields:
                - "broaderTheme": A general category encompassing multiple related sub-themes.
                - "subTheme": Specific themes that fall under the broader category.
                - "code": Detailed reasons or actions mentioned by participants that illustrate the sub-themes.
                - "occurrences": The number of times this theme was mentioned.
                The array should be based on the following objective: ${objective}. Here is the transcript: ${extractedText}`
            }
        ];

        const requestBody = {
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 800, 
            temperature: 0.7 
        };

        // Make the API call with retry logic
        const response = await retryWithBackoff(() => openai.chat.completions.create(requestBody));

        let responseData: Theme[] = [];
        try {
            const content = response.choices[0].message.content;
            const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
                const jsonString = jsonMatch[1].trim();
                responseData = JSON.parse(jsonString);
                themes.push(...responseData);
            } else {
                throw new Error("JSON data not found in the response.");
            }
        } catch (error) {
            console.error("Error parsing OpenAI response:", error);
            console.error("Response content (trimmed):", response.choices[0].message.content.trim());
            throw new Error("Invalid JSON response from OpenAI");
        }
    }
    
    return themes;
};
