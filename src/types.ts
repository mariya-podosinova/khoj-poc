// types.ts

export interface Project {
    name: string;
    createdDate: string;
    lastModified: string;
    status: string;
    researcher: string;
}

export interface File {
    name: string;
    content: string;
    extractedText: string;
    uploaded: boolean;
    createdDate: string;
    lastModified: string;
    status: string;
    researcher: string;
}

export const defaultPersona = {
    name: "Participant 1",
    role: "Primary persona",
    background: "Participant 1 is a 38-year-old professional living in the heart of London with their spouse, Emily. As a high-ranking executive in a multinational corporation, Participant 1’s life is a blend of high-stakes business meetings, frequent travel, and quality time with family. They enjoy the cultural vibrancy of London, often attending theater performances, dining at upscale restaurants, and engaging in weekend getaways to the countryside.",
    demographics: {
        age: 38,
        location: "London",
        maritalStatus: "Married",
        accessibility: "Glasses"
    },
    needs: "Performance: Demands top-tier performance with cutting-edge processors, significant RAM, and quick, responsive interfaces. Security: Prioritizes devices with advanced security measures such as facial recognition, fingerprint sensors, and end-to-end encryption. Camera: Requires a state-of-the-art camera system for high-resolution photos and videos, important for capturing moments with family and for professional purposes. Durability: Looks for a sturdy, water-resistant, and drop-proof device that can endure a hectic lifestyle. Style: Prefers a sleek, sophisticated design with premium materials that reflect professional status.",
    goals: "Efficiency: Seeks to enhance productivity and streamline tasks through a powerful and reliable device. Connectivity: Needs seamless connectivity to stay in touch with an international team, clients, and family. Sustainability: Motivated by a desire to reduce carbon footprint and contribute to environmental conservation by recycling old devices.",
    painPoints: "Performance Lag: Annoyed by any form of lag or slow performance, especially during critical tasks. Battery Life: Finds short battery life disruptive to back-to-back meetings and travel. Security Concerns: Concerned about the security of sensitive business information and personal data. Environmental Impact: Conscious of the negative impact of electronic waste, prefers sustainable options.",
    socialMedia: "LinkedIn, Twitter"
};

export interface Persona {
    name: string;
    role: string;
    background: string;
    demographics: {
        age: number;
        location: string;
        maritalStatus: string;
        accessibility: string;
    };
    needs: string;
    goals: string;
    painPoints: string;
    socialMedia: string;
}

export interface Objectives {
    main: string;
    additional: string;
}

export interface TextItem {
    str: string;
}

export interface TextSectionProps {
    content: string;
}

export interface Insight {
    broaderTheme: string;
    subThemes: {
        subTheme: string;
        code: string;
        occurrences: number;
    }[];
    keyInsight: string;
}

export interface FileContextType {
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    projects: Project[];
    currentProject: Project;
    setCurrentProject: React.Dispatch<React.SetStateAction<Project>>;
    extractedText: string;
    setExtractedText: React.Dispatch<React.SetStateAction<string>>;
    themes: { broaderTheme: string, subTheme: string, code: string, occurrences: number }[];
    setThemes: React.Dispatch<React.SetStateAction<{ broaderTheme: string, subTheme: string, code: string, occurrences: number }[]>>;
    insights: string;
    setInsights: React.Dispatch<React.SetStateAction<string>>;
    persona: Persona;
    setPersona: React.Dispatch<React.SetStateAction<Persona>>;
    objectives: Objectives;
    setObjectives: React.Dispatch<React.SetStateAction<Objectives>>;
}
