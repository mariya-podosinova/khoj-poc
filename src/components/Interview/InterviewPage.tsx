import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './InterviewPage.css';
import { useFileContext } from '../../FileContext';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { File, TextItem } from '../../types';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;

const InterviewPage: React.FC = () => {
    const { uploadedFiles, setUploadedFiles, currentProject, setExtractedText } = useFileContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePdfUpload = async (files: FileList) => {
        setLoading(true);
        const extractedTexts: string[] = [];

        for (const file of Array.from(files)) {
            const reader = new FileReader();

            reader.onload = async () => {
                const content = reader.result as string;
                const extractedText = await extractTextFromPdf(content);
                extractedTexts.push(extractedText);

                setUploadedFiles((prevFiles) => [
                    ...prevFiles,
                    {
                        name: file.name,
                        content,
                        extractedText,
                        uploaded: true,
                        createdDate: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        status: 'Finished',
                        researcher: 'Unknown'
                    },
                ]);

                if (extractedTexts.length === files.length) {
                    setExtractedText(extractedTexts.join(' ')); // Combine all extracted texts
                    setLoading(false);
                }
            };

            reader.onerror = (error) => {
                console.error("Error reading file:", error);
            };

            reader.readAsDataURL(file);
        }
    };

    const extractTextFromPdf = async (pdfData: string): Promise<string> => {
        const loadingTask = pdfjsLib.getDocument({ data: atob(pdfData.split(',')[1]) });
        const pdf = await loadingTask.promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            textContent.items.forEach((item: TextItem) => {
                text += item.str + ' ';
            });
        }

        return text;
    };

    const handleDelete = (fileName: string) => {
        setUploadedFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
    };

    const handleContinue = () => {
        navigate('/project-details', { state: { project: currentProject } });
    };

    return (
        <div className="interview-page p-4">
            <h2 className="text-2xl font-bold mb-4">{currentProject.name}</h2>
            <p className="text-gray-600 mb-6">Details of the project</p>
            <div className="upload-container">
                <div className="upload-box">
                    <p className="upload-box-title">Upload Files</p>
                    <input
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={(e) => e.target.files && handlePdfUpload(e.target.files)}
                        className="file-input"
                        disabled={loading}
                    />
                    {loading ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                        <p>Click or drag the file here to upload</p>
                    )}
                </div>
                <div className="recording-section">
                    <h3 className="recording-title">Recording</h3>
                    <button className="recording-button">Start Recording</button>
                </div>
            </div>
            <div className="uploaded-files-list">
                {uploadedFiles.map((file, index) => (
                    <div key={index} className="uploaded-file-item">
                        <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            {file.status === 'Finished' ? (
                                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                            ) : (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            )}
                        </div>
                        <button
                            onClick={() => handleDelete(file.name)}
                            className="delete-button"
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="actions">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
                <button
                    className="continue-button"
                    onClick={handleContinue}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default InterviewPage;
