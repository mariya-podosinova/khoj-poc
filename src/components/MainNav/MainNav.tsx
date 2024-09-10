import React from 'react';
import './MainNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faCog } from '@fortawesome/free-solid-svg-icons';

const MainNav: React.FC = () => {
    return (
        <div className="main-nav w-full flex justify-between items-center bg-white p-4 shadow-md">
            <div className="flex items-center">
                <FontAwesomeIcon icon={faIdCard} className="text-blue-500 text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-700">KHOJ</span>
            </div>
            <div className="flex items-center">
                <FontAwesomeIcon icon={faCog} className="text-gray-500 text-xl mr-4" />
                <img
                    src="https://via.placeholder.com/40" // Replace with actual image source
                    alt="User Avatar"
                    className="rounded-full w-10 h-10"
                />
            </div>
        </div>
    );
};

export default MainNav;
