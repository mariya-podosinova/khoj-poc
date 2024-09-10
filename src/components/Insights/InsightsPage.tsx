import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFileContext } from '../../FileContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FileContextType, Insight } from '../../types';

const InsightsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { themes, currentProject, setInsights, insights: contextInsights } = useFileContext() as FileContextType;

    const project = location.state?.project || currentProject;
    const [loading, setLoading] = useState<boolean>(false);
    const [insightsData, setInsightsData] = useState<Insight[]>([]); // Use the correct type for insightsData

    useEffect(() => {
        console.log("Themes:", themes);
        console.log("Current Project:", currentProject);
    }, [themes, currentProject]);

    useEffect(() => {
        if (contextInsights) {
            try {
                const parsedInsights: Insight[] = JSON.parse(contextInsights);
                setInsightsData(parsedInsights);
            } catch (error) {
                console.error("Error parsing insights:", error);
            }
        }
    }, [contextInsights]);

    const handleCreatePersona = () => {
        if (!contextInsights) {
            alert("No insights available for persona creation.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            navigate('/persona', { state: { project, insights: contextInsights } });
        }, 20000); // Simulate a delay for loading indicator demonstration
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="insights-page p-6">
            <h1 className="text-2xl font-bold mb-2">{project.name} - Insights</h1>
            {insightsData.length > 0 ? (
                <>
                    <p className="text-gray-600 mb-6">Details of the project</p>
                    {insightsData.map((insight, index) => (
                        <div key={index} className="insight-section mb-6 bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">{insight.broaderTheme}</h2>
                                <FontAwesomeIcon icon={faTrashAlt} className="text-gray-500 cursor-pointer" />
                            </div>
                            {insight.subThemes.map((subTheme, subIndex) => (
                                <div key={subIndex} className="mb-2 p-2 bg-gray-100 rounded">
                                    <strong>{subTheme.subTheme}:</strong> {subTheme.code} ({subTheme.occurrences} occurrences)
                                </div>
                            ))}
                            <p className="font-bold">Key Insight: <span className="font-normal">{insight.keyInsight}</span></p>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <p className="text-gray-600 mb-6">No insights generated yet.</p>
                    <p className="text-red-500 mb-4">Please generate insights on the Themes page before creating a persona.</p>
                </>
            )}
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
                    onClick={handleBackClick}
                >
                    Back
                </button>
                <button
                    className={`bg-blue-500 text-white px-3 py-2 rounded ml-4 ${(!contextInsights || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    onClick={handleCreatePersona}
                    disabled={!contextInsights || loading}
                >
                    {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> : <span>Create Persona</span>}
                </button>
            </div>
            {loading && (
                <div className="loading-message">
                    Navigating to persona creation, please wait...
                </div>
            )}
        </div>
    );
};

export default InsightsPage;
