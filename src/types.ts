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

export interface Persona {
    name: string;
    role: string;
    background: string;
    demographics: {
        age: string;
        location: string;
        maritalStatus: string;
        accessibility: string;
    };
    needs: string[]; 
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
    persona: Persona[]; // Updated to be an array of Persona
    setPersona: React.Dispatch<React.SetStateAction<Persona[]>>; // Updated to be an array of Persona
    objectives: Objectives;
    setObjectives: React.Dispatch<React.SetStateAction<Objectives>>;
}
