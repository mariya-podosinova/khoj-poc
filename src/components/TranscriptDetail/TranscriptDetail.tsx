import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import TextSection from '../TextSection/TextSection';
import { useFileContext } from '../../FileContext';

const TranscriptDetail: React.FC = () => {
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { uploadedFiles } = useFileContext();

    const contentFromState = location.state?.content || "No content available";
    const file = uploadedFiles.find(file => file.name === id);
    const content = file ? file.content : contentFromState;

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Transcript Detail - {id}</h2>
            <TextSection content={content} />
            <button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={handleBackClick}
            >
                Back
            </button>
        </div>
    );
};

export default TranscriptDetail;
