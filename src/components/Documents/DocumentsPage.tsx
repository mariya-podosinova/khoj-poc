import React from 'react';
import { useFileContext } from '../../FileContext';
import { jsPDF } from 'jspdf';
import './DocumentsPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const DocumentsPage: React.FC = () => {
    const { persona, insights, currentProject } = useFileContext();

    const generatePDF = (title, contentCallback, fileName) => {
        const doc = new jsPDF();
        const marginLeft = 10;
        const marginTop = 10;
        const lineHeight = 10;
        const maxLineWidth = 180;

        doc.setFontSize(20);
        doc.text(title, marginLeft, marginTop);

        let currentY = marginTop + 20;

        const addContent = (title, content, startY) => {
            doc.setFontSize(16);
            const titleLines = doc.splitTextToSize(title, maxLineWidth);
            titleLines.forEach((line) => {
                if (startY > 280) {
                    doc.addPage();
                    startY = marginTop + lineHeight;
                }
                doc.text(line, marginLeft, startY);
                startY += lineHeight;
            });

            doc.setFontSize(12);
            const contentLines = doc.splitTextToSize(content, maxLineWidth);
            contentLines.forEach((line) => {
                if (startY > 280) {
                    doc.addPage();
                    startY = marginTop + lineHeight;
                }
                doc.text(line, marginLeft, startY);
                startY += lineHeight;
            });
            return startY;
        };

        contentCallback(doc, addContent, currentY);

        doc.save(fileName);
    };

    const handleDownloadPersona = (persona, participantNumber) => {
        generatePDF(
            `Participant ${participantNumber}`,
            (doc, addContent, currentY) => {
                currentY = addContent(`Name: Participant ${participantNumber}`, '', currentY);
                currentY = addContent(`Role: ${persona.role}`, '', currentY + 10);
                currentY = addContent('Background:', persona.background, currentY);
                currentY = addContent(
                    'Demographics:',
                    `Age: ${persona.demographics.age}\nLocation: ${persona.demographics.location}\nMarital Status: ${persona.demographics.maritalStatus}\nAccessibility: ${persona.demographics.accessibility}`,
                    currentY
                );
                currentY = addContent('Needs:', persona.needs, currentY);
                currentY = addContent('Goals:', persona.goals, currentY);
                currentY = addContent('Pain Points:', persona.painPoints, currentY);
                addContent('Social Media:', persona.socialMedia, currentY);
            },
            `Participant${participantNumber}.pdf`
        );
    };

    const handleDownloadInsights = () => {
        generatePDF(
            'Project Insights',
            (doc, addContent, currentY) => {
                const insightsData = JSON.parse(insights);
                insightsData.forEach((insight, index) => {
                    currentY = addContent(`Insight ${index + 1}: ${insight.broaderTheme}`, '', currentY);
                    insight.subThemes.forEach((subTheme) => {
                        currentY = addContent(
                            `${subTheme.subTheme}: ${subTheme.code} (${subTheme.occurrences} occurrences)`,
                            '',
                            currentY
                        );
                    });
                    currentY = addContent(`Key Insight: ${insight.keyInsight}`, '', currentY + 10);
                });
            },
            `${currentProject.name}-insights.pdf`
        );
    };

    return (
        <div className="documents-page">
            <div className="documents-card">
                <FontAwesomeIcon icon={faFilePdf} className="documents-icon" />
                <h2 className="documents-title">Personas</h2>
                {persona && persona.length > 0 ? (
                    persona.map((p, index) => (
                        <div key={index} className="persona-section">
                            <h3 className="persona-name">Participant {index + 1} - {p.role}</h3>
                            <button
                                className="documents-download-button"
                                onClick={() => handleDownloadPersona(p, index + 1)}
                            >
                                Download Participant {index + 1}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No persona data available.</p>
                )}
            </div>
            <div className="documents-card">
                <FontAwesomeIcon icon={faFilePdf} className="documents-icon" />
                <h2 className="documents-title">Project Insights</h2>
                <div className="insights-section">
                    <button
                        className="documents-download-button"
                        onClick={handleDownloadInsights}
                    >
                        Download Insights
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;
