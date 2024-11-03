import React from 'react';
import styles from '../logoutmodal/Logout.module.css';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie'
const LogoutModal = ({ closeModal }) => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('id');
        Cookies.remove("token");
        navigate('/login');
        window.location.reload();
    };

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <div className={styles.title}>
                    <h1>Confirm Logout</h1>
                </div>
                <div className={styles.footer}>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Yes, Logout
                    </button>
                    <button onClick={() => closeModal(false)}className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;