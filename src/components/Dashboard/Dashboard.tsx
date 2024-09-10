import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useFileContext } from '../../FileContext';
import { Project } from '../../types';

const Dashboard: React.FC = () => {
    const { projects, setCurrentProject } = useFileContext();
    const navigate = useNavigate();
    const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

    const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const project = projects.find(p => p.name === event.target.value);
        if (project) {
            setSelectedProject(project);
            setCurrentProject(project);
        }
    };

    const handleContinueClick = (project: Project) => {
        navigate('/project-details', { state: { project } });
    };

    return (
        <div className="dashboard p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="mb-4">
                <label htmlFor="projectSelect" className="block text-sm font-medium text-gray-700">
                    Select Project
                </label>
                <select
                    id="projectSelect"
                    value={selectedProject.name}
                    onChange={handleProjectChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {projects.map((project, index) => (
                        <option key={index} value={project.name}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto">
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
                        {projects.map((project, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-2 px-4 text-sm">{project.name}</td>
                                <td className="py-2 px-4 text-sm">{project.createdDate}</td>
                                <td className="py-2 px-4 text-sm">{project.lastModified}</td>
                                <td className="py-2 px-4 text-sm text-green-500 font-semibold">{project.status.toUpperCase()}</td>
                                <td className="py-2 px-4 text-sm">{project.researcher}</td>
                                <td className="py-2 px-4 text-sm">
                                    <button
                                        className="action-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => handleContinueClick(project)}
                                    >
                                        Continue
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
