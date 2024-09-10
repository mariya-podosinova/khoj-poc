import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useFileContext } from '../../FileContext';
import { createInsights } from '../../helpers/openaiInsightsHelper';
import './ThemesPage.css';

const ThemesPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { themes, currentProject, setInsights, objectives } = useFileContext();
    const [loading, setLoading] = useState(false);

    const handleCreateInsights = async () => {
        if (!themes || themes.length === 0) {
            alert("No themes available for insights.");
            return;
        }

        setLoading(true);

        try {
            console.log("Creating insights for themes:", themes);
            const insights = await createInsights(themes);
            console.log("Insights created:", insights);
            setInsights(JSON.stringify(insights, null, 2)); // Save insights in context
            navigate('/insights', { state: { project: currentProject, insights: JSON.stringify(insights, null, 2) } });
        } catch (error) {
            console.error("Error creating insights:", error);
            alert("An error occurred while creating insights.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const groupedThemes = themes.reduce((acc, theme) => {
        const existingTheme = acc.find(t => t.broaderTheme === theme.broaderTheme);
        if (existingTheme) {
            existingTheme.subThemes.push(theme);
        } else {
            acc.push({ broaderTheme: theme.broaderTheme, subThemes: [theme] });
        }
        return acc;
    }, []);

    return (
        <div className="themes-page p-6">
            <h1 className="text-2xl font-bold mb-2">{currentProject.name} - Themes</h1>
            <p className="text-gray-600 mb-6 text-lg">{objectives.main}</p>
            {groupedThemes && groupedThemes.length > 0 ? (
                <div>
                    <div className="themes-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {groupedThemes.map((group, index) => (
                            <div key={index} className="theme-card bg-white p-4 rounded-lg shadow-md relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-semibold">{group.broaderTheme}</h2>
                                    <FontAwesomeIcon icon={faTrashAlt} className="text-gray-500 cursor-pointer" />
                                </div>
                                {group.subThemes.map((subTheme, subIndex) => (
                                    <div key={subIndex} className="sub-theme mb-4 bg-gray-100 p-3 rounded">
                                        <h3 className="font-semibold">{subTheme.subTheme}</h3>
                                        <p>{subTheme.code}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 lg:w-1/2">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 bg-gray-200 text-left text-sm leading-4 text-gray-600 tracking-wider">Sub-Theme</th>
                                    <th className="py-2 px-4 bg-gray-200 text-left text-sm leading-4 text-gray-600 tracking-wider">Occurrences</th>
                                </tr>
                            </thead>
                            <tbody>
                                {themes.sort((a, b) => b.occurrences - a.occurrences).map((theme, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-2 px-4 text-sm">{theme.subTheme}</td>
                                        <td className="py-2 px-4 text-sm">{theme.occurrences}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-gray-600 mb-6">No themes available. Please create themes first.</p>
                    <p className="text-red-500 mb-4">Please generate themes before creating insights.</p>
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
                    className={`bg-blue-500 text-white px-3 py-2 rounded ml-4 ${groupedThemes.length > 0 ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleCreateInsights}
                    disabled={loading || groupedThemes.length === 0}
                >
                    {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> : 'Create Insights'}
                </button>
            </div>
            {loading && (
                <div className="loading-message">
                    Creating insights, please wait...
                </div>
            )}
        </div>
    );
};

export default ThemesPage;
