import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFileContext } from '../../FileContext';
import './ObjectivePage.css';

const ObjectivePage: React.FC = () => {
    const { currentProject, setObjectives } = useFileContext();
    const navigate = useNavigate();
    const [mainObjective, setMainObjective] = useState('');
    const [additionalObjective, setAdditionalObjective] = useState('');

    const handleContinue = () => {
        setObjectives({ main: mainObjective, additional: additionalObjective });
        navigate('/interview');
    };

    return (
        <div className="objective-page">
            <div className="objective-content">
                <h1 className="title">Objective - {currentProject.name}</h1>
                <p className="subtitle">Details of the project</p>
                <p className="subtitle">For the demo: why people don't throw away their old phones and their preferences for giving them away</p>
                <div className="form-container">
                    <div className="form-group">
                        <label className="form-label">Research main goal/objective</label>
                        <textarea
                            className="form-input"
                            value={mainObjective}
                            onChange={(e) => setMainObjective(e.target.value)}
                            placeholder="Enter your research objective here..."
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Research additional goals/objectives (optional)</label>
                        <textarea
                            className="form-input"
                            value={additionalObjective}
                            onChange={(e) => setAdditionalObjective(e.target.value)}
                            placeholder="Enter your research objective here..."
                        />
                    </div>
                    <div className="button-group">
                        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                        <button className="continue-button" onClick={handleContinue}>Continue</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObjectivePage;
