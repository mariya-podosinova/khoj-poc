import OpenAI from 'openai';
import { Insight } from '../types';  

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

export const createInsights = async (themes: { broaderTheme: string, subTheme: string, code: string, occurrences: number }[]): Promise<Insight[]> => {
    const insights: Insight[] = [];
    
    // Group themes by broaderTheme
    const groupedThemes = themes.reduce((acc, theme) => {
        if (!acc[theme.broaderTheme]) {
            acc[theme.broaderTheme] = [];
        }
        acc[theme.broaderTheme].push(theme);
        return acc;
    }, {} as Record<string, { broaderTheme: string, subTheme: string, code: string, occurrences: number }[]>);

    // Sort the broader themes by the total occurrences of their sub-themes and take the top 3
    const topGroupedThemes = Object.entries(groupedThemes)
        .sort(([, subThemesA], [, subThemesB]) => {
            const totalOccurrencesA = subThemesA.reduce((sum, subTheme) => sum + subTheme.occurrences, 0);
            const totalOccurrencesB = subThemesB.reduce((sum, subTheme) => sum + subTheme.occurrences, 0);
            return totalOccurrencesB - totalOccurrencesA;
        })
        .slice(0, 3);

    for (const [broaderTheme, subThemes] of topGroupedThemes) {
        // Sort sub-themes by occurrences in descending order and get the top 3
        const topSubThemes = subThemes.sort((a, b) => b.occurrences - a.occurrences).slice(0, 3);

        const messages: OpenAI.ChatCompletionMessageParam[] = [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user", content: `Combine qualitative and quantitative data to identify key insights. Determine the most critical findings that impact the user experience. Here is the data: ${JSON.stringify(topSubThemes)}. 

Please return the response in the following JSON format:
{
  "broaderTheme": "<broaderTheme>",
  "subThemes": [
    {
      "subTheme": "<subTheme>",
      "code": "<code>",
      "occurrences": <occurrences>
    },
    ...
  ],
  "keyInsight": "<keyInsight>"
}`
            },
        ];

        const requestBody: OpenAI.ChatCompletionCreateParamsNonStreaming = {
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 800, // Adjust token limit as needed
            temperature: 0.7 // Adjust for optimal response quality
        };

        const response = await retryWithBackoff(() => openai.chat.completions.create(requestBody));

        try {
            const content = response.choices[0].message.content;
            console.log("Received content from OpenAI:", content);

            // Improved regular expression to capture the entire JSON block including potential line breaks
            const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
            let jsonString;
            if (jsonMatch) {
                jsonString = jsonMatch[1].trim();
            } else {
                // Try to parse the content directly if no code block is found
                const jsonStart = content.indexOf('{');
                const jsonEnd = content.lastIndexOf('}') + 1;
                jsonString = content.substring(jsonStart, jsonEnd).trim();
            }

            const insightData = JSON.parse(jsonString) as Insight;
            // Add broaderTheme to the insightData
            insightData.broaderTheme = broaderTheme;
            insights.push(insightData);

        } catch (error) {
            console.error("Error parsing OpenAI response:", error);
            console.error("Response content (trimmed):", response.choices[0]?.message?.content?.trim());
            throw new Error("Invalid JSON response from OpenAI");
        }
    }
    return insights;
};
