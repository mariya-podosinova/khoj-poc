import React, { createContext, useContext, useState, ReactNode } from 'react';
import { File, Project, FileContextType } from './types';

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error("useFileContext must be used within a FileProvider");
    }
    return context;
};

export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [projects, setProjects] = useState<Project[]>([
        { name: 'Health app design', createdDate: '10/20/2018', lastModified: '04/15/2023', status: 'Finished', researcher: 'Jessica Lee' },
        { name: 'Food app', createdDate: '10/20/2018', lastModified: '04/15/2023', status: 'Finished', researcher: 'Jessica Lee' },
        { name: 'Charity website', createdDate: '10/20/2018', lastModified: '04/15/2023', status: 'Finished', researcher: 'Jessica Lee' },
        { name: 'E-commerce platform', createdDate: '10/20/2018', lastModified: '04/15/2023', status: 'Finished', researcher: 'Jessica Lee' },
    ]);
    const [currentProject, setCurrentProject] = useState<Project>(projects[0]);
    const [extractedText, setExtractedText] = useState<string>('');
    const [themes, setThemes] = useState<{ broaderTheme: string, subTheme: string, code: string, occurrences: number }[]>([]);
    const [insights, setInsights] = useState<string>('');
    const [persona, setPersona] = useState<any>(null); // Initialize persona to null
    const [objectives, setObjectives] = useState<{ main: string; additional: string }>({ main: '', additional: '' });

    return (
        <FileContext.Provider value={{ uploadedFiles, setUploadedFiles, projects, currentProject, setCurrentProject, extractedText, setExtractedText, themes, setThemes, insights, setInsights, persona, setPersona, objectives, setObjectives }}>
            {children}
        </FileContext.Provider>
    );
};
