import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFileContext } from '../../FileContext';
import { createPersona } from '../../helpers/openaiPersonaHelper';
import { Persona } from '../../types'; // Ensure Persona type is imported
import './PersonaPage.css';

const PersonaPage = () => {
    const { currentProject, insights, persona, setPersona } = useFileContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('https://randomuser.me/api/?results=2');
                const data = await response.json();
                setImageUrls(data.results.map((result: { picture: { large: string } }) => result.picture.large));
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    const handleCreatePersona = async () => {
        if (!insights) {
            alert("No insights available for persona creation.");
            return;
        }

        setLoading(true);
        try {
            const personaData = await createPersona(JSON.parse(insights));
            setPersona(personaData.personas); // Set both personas
        } catch (error: any) {
            console.error("Error creating persona:", error.message);
            alert("An error occurred while creating the persona. Check the console for more details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (insights && !persona) {
            handleCreatePersona();
        }
    }, [insights]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleContinue = () => {
        navigate('/documents');
    };

    const renderNeeds = (needs: string[] | undefined) => {
        if (!needs || !Array.isArray(needs)) {
            return <p>No needs data available</p>;
        }
        return needs.map((need, idx) => (
            <p key={idx} className="needs-item">{need}</p>
        ));
    };

    if (!persona || persona.length === 0) {
        return (
            <div className="persona-page p-6">
                <h1 className="text-2xl font-bold mb-2">Persona - {currentProject.name}</h1>
                <p className="text-gray-600 mb-6">Details of the project</p>
                <p className="text-gray-600 mb-6">No persona data available. Please generate insights first.</p>
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
                        onClick={handleBackClick}
                    >
                        Back
                    </button>
                    <button
                        className="bg-blue-500 text-white px-3 py-2 rounded ml-4"
                        onClick={handleContinue}
                    >
                        Continue to Documents
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="persona-page p-6">
            <h1 className="text-2xl font-bold mb-2">Persona - {currentProject.name}</h1>
            <p className="text-gray-600 mb-6">Details of the project</p>
            {persona.map((p: Persona, index: number) => (
                <div key={index} className="persona-container mb-12">
                    <h2 className="persona-title">
                        {p.name} - <span className="persona-role">{p.role}</span>
                    </h2>
                    <div className="persona-content">
                        <div className="persona-header">
                            <div className="persona-image-wrapper">
                                <img src={imageUrls[index]} alt="Persona" className="persona-image" />
                            </div>
                            <div className="persona-info">
                                <h3 className="font-bold">Background</h3>
                                <p className="text-gray-700">{p.background}</p>
                            </div>
                        </div>
                        <div className="persona-sections">
                            <div className="left-column">
                                <div className="persona-section">
                                    <h3 className="font-bold">Demographics</h3>
                                    <p>Age: {p.demographics.age}</p>
                                    <p>Location: {p.demographics.location}</p>
                                    <p>Marital status: {p.demographics.maritalStatus}</p>
                                    <p>Accessibility: {p.demographics.accessibility}</p>
                                </div>
                                <div className="persona-section">
                                    <h3 className="font-bold">Social Media</h3>
                                    <p>{p.socialMedia}</p>
                                </div>
                            </div>
                            <div className="right-column">
                                <div className="persona-section needs-section">
                                    <h3 className="font-bold">Needs</h3>
                                    {renderNeeds(p.needs)}
                                </div>
                            </div>
                        </div>
                        <div className="full-width">
                            <div className="persona-section">
                                <h3 className="font-bold">Goals and Motivations</h3>
                                <p>{p.goals}</p>
                            </div>
                            <div className="persona-section">
                                <h3 className="font-bold">Pain Points</h3>
                                {p.painPoints.split(', ').map((painPoint, idx) => (
                                    <p key={idx} className="pain-points-item">{painPoint.trim()}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
                    onClick={handleBackClick}
                >
                    Back
                </button>
                <button
                    className="bg-blue-500 text-white px-3 py-2 rounded ml-4"
                    onClick={handleContinue}
                >
                    Continue to Documents
                </button>
            </div>
        </div>
    );
};

export default PersonaPage;
