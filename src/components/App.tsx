import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainNav from './MainNav/MainNav';
import Sidebar from './Sidebar/Sidebar';
import Dashboard from './Dashboard/Dashboard';
import InterviewPage from './Interview/InterviewPage';
import ProjectDetails from './ProjectDetails/ProjectDetails';
import TranscriptDetail from './TranscriptDetail/TranscriptDetail';
import { FileProvider } from '../FileContext';
import ThemesPage from './ThemesPage/ThemesPage';
import InsightsPage from './Insights/InsightsPage';
import PersonaPage from './Persona/PersonaPage';
import ObjectivesPage from './Objectives/ObjectivesPage';
import DocumentsPage from './Documents/DocumentsPage';

const App = () => {
  return (
    <FileProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <MainNav />
          <div className="flex flex-row flex-grow">
            <Sidebar />
            <div className="flex-grow">
              <Routes>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/objectives" element={<ObjectivesPage />} />
                <Route path="/interview" element={<InterviewPage />} />
                <Route path="/transcript/:id" element={<TranscriptDetail />} />
                <Route path="/themes" element={<ThemesPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/persona" element={<PersonaPage />} />
                <Route path="/project-details" element={<ProjectDetails />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/" element={<Navigate to="/home" />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </FileProvider>
  );
};

export default App;
