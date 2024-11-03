import React, { useState } from 'react';
import styles from '../navigation/SideNavigation.module.css';
import LogoutModal from '../../modals/logoutmodal/Logout';
import Logo from '../../assets/codesandbox.png';
import DatabaseIcon from '../../assets/Database.png';
import BoardIcon from '../../assets/Layout.png';
import SettingsIcon from '../../assets/Settings.png';
import LogoutIcon from '../../assets/Logout.png';
import {useLocation, useNavigate} from 'react-router-dom';

const navigationItems = [
    { path: '/dashboard', label: 'Board', icon: BoardIcon },
    { path: '/analytics', label: 'Analytics', icon: DatabaseIcon },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

const SideNav = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const location=useLocation(); 
    const handleNavigation = (path) => () => {
        navigate(path);

    };

    return (
        <>
            <div className={styles.SideNavContainer}>
                <div className={styles.SideNavHeaders}>
                    <img src={Logo} alt="Logo" className={styles.logo} />
                    <span className={styles.text}> Pro Manage</span>
                </div>
                <div className={styles.SideNavButtons}>
                    {navigationItems.map(({ path, label, icon }) => (
                        <button
                            key={path}
                            type="button"
                            className={`${styles.navButton} ${location.pathname === path ? styles.active : ''}`}
                            onClick={handleNavigation(path)}
                            aria-label={`Navigate to ${label}`}
                        >
                            <img src={icon} alt={label} className={styles.Headicon} />
                            <span className={styles.labels}>{label}</span>
                        </button>
                    ))}
                </div>
                <div className={styles.logout}>
                    <button
                        type="button"
                        className={styles.LogoutNavBtn}
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Log out"
                    >
                        <img src={LogoutIcon} alt="Logout" className={styles.btn} />
                        <span className={styles.btn}>Log out</span>
                    </button>
                </div>
            </div>
            {isModalOpen && <LogoutModal closeModal={setIsModalOpen} />}
        </>
    );
};

export default SideNav;
