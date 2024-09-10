import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { TextSectionProps } from '../../types';

const TextSection: React.FC<TextSectionProps> = ({ content }) => {
    const isPdf = content.startsWith('data:application/pdf');

    return (
        <section className="col-[1/2] row-[2/3] bg-[#fff] [scrollbar-width:thin] relative p-4">
            {isPdf ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer fileUrl={content} />
                </Worker>
            ) : (
                content.split('\n').map((para, index) => (
                    <p key={index} className="mb-2">{para}</p>
                ))
            )}
        </section>
    );
};

export default TextSection;
