import React, { useState, useEffect } from 'react';
import './ProjectDetails.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faMicrophone, faCheckCircle, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useFileContext } from '../../FileContext';
import { Project } from '../../types';
import { createThemes } from '../../helpers/openaiThemesHelper';

const ProjectDetails: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { project } = location.state as { project: Project };
    const { uploadedFiles, setThemes, objectives } = useFileContext();
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: boolean }>({});
    const [anyCheckboxSelected, setAnyCheckboxSelected] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAnyCheckboxSelected(Object.values(selectedFiles).some(selected => selected));
    }, [selectedFiles]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleCheckboxChange = (fileName: string) => {
        setSelectedFiles(prevState => {
            const newSelectedFiles = { ...prevState, [fileName]: !prevState[fileName] };
            setAnyCheckboxSelected(Object.values(newSelectedFiles).some(selected => selected));
            return newSelectedFiles;
        });
    };

    const handleCreateThemesClick = async () => {
        const selectedFileNames = Object.keys(selectedFiles).filter(fileName => selectedFiles[fileName]);
        if (selectedFileNames.length === 0) {
            alert("No files selected.");
            return;
        }

        setLoading(true);

        try {
            const selectedTexts = uploadedFiles
                .filter(file => selectedFileNames.includes(file.name))
                .map(file => file.extractedText);

            if (!objectives.main) {
                alert("No main objective defined.");
                setLoading(false);
                return;
            }

            const themes = await createThemes(selectedTexts, objectives.main);
            setThemes(themes);
            navigate('/themes');
        } catch (error: any) {
            console.error("Error creating themes:", error.message);
            alert("An error occurred while creating themes. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Finished':
                return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
            case 'In Progress':
                return <FontAwesomeIcon icon={faSpinner} className="text-blue-500" />;
            case 'Canceled':
                return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
            default:
                return null;
        }
    };

    const handleViewClick = (fileName: string) => {
        navigate(`/transcript/${fileName}`, { state: { content: fileName } });
    };

    return (
        <div className="project-details p-6">
            <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600 mb-6">Details of the project</p>
            <div className="flex justify-end mb-4">
                <button className="mr-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center">
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    Upload
                </button>
                <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center">
                    <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
                    Recording
                </button>
            </div>
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 bg-gray-200 text-left text-sm leading-4 text-gray-600 tracking-wider">Name</th>
                            <th className="py-2 px-4 bg-gray-200 text-left text-sm leading-4 text-gray-600 tracking-wider">Created Date</th>
                            <th className="py-2 px-4 bg-gray-200 text-left text-sm leading-4 text-gray-600 tracking-wider">Last Modified</th>
                            <th className="py-2 px-4 bg-gray-200 text-left text-sm leading-4 text-gray-600 tracking-wider">Status</th>
                            <th className="py-2 px-4 bg-gray-200 text-left text-sm leading-4 text-gray-600 tracking-wider">Researcher</th>
                            <th className="py-2 px-4 bg-gray-200 text-left text-sm leading-4 text-gray-600 tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploadedFiles.map((file, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-2 px-4 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={!!selectedFiles[file.name]}
                                        onChange={() => handleCheckboxChange(file.name)}
                                    />
                                    <span className="ml-2">{file.name}</span>
                                </td>
                                <td className="py-2 px-4 text-sm">{formatDate(file.createdDate)}</td>
                                <td className="py-2 px-4 text-sm">{formatDate(file.lastModified)}</td>
                                <td className="py-2 px-4 text-sm font-semibold flex items-center">
                                    {getStatusIcon(file.status)}
                                    <span className="ml-2">{file.status.toUpperCase()}</span>
                                </td>
                                <td className="py-2 px-4 text-sm">{file.researcher}</td>
                                <td className="py-2 px-4 text-sm">
                                    <button
                                        className="action-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => handleViewClick(file.name)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={handleBackClick}
                >
                    Back
                </button>
                <button
                    className={`action-btn ${anyCheckboxSelected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    onClick={handleCreateThemesClick}
                    disabled={!anyCheckboxSelected || loading}
                >
                    {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> : 'Create Themes'}
                </button>
            </div>
            {loading && (
                <div className="loading-message">
                    Creating themes, please wait...
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
