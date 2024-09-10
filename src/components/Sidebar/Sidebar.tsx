import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFileAlt, faUser, faChartBar, faArchive, faFile, faBook, faUserCircle, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const Sidebar: React.FC = () => {
    return (
        <nav className="sidebar">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faHome} className="icon" />
                Dashboard
            </NavLink>
            <NavLink to="/objectives" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faFileAlt} className="icon" />
                Interview
            </NavLink>
            <NavLink to="/themes" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faUser} className="icon" />
                Themes
            </NavLink>
            <NavLink to="/insights" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faChartBar} className="icon" />
                Insights
            </NavLink>
            <NavLink to="/persona" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faUserCircle} className="icon" />
                Persona
            </NavLink>
            {/* <NavLink to="/backlogs" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faArchive} className="icon" />
                Backlogs
            </NavLink>
            <NavLink to="/template" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faFile} className="icon" />
                Template
            </NavLink> */}
            <NavLink to="/documents" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faFilePdf} className="icon" />
                Documents
            </NavLink>
        </nav>
    );
};

export default Sidebar;
