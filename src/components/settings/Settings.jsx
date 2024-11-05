import React, { useState } from 'react';
import styles from '../settings/Settings.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

const Settings = () => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
    });
    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
    });

    const showSuccessMessage = () => {
        toast.success('Settings updated successfully!', {
            position: 'top-right',
            autoClose: 5000,
            theme: 'light',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const { name, email, currentPassword, newPassword } = userInfo;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (currentPassword && newPassword) {
            updateData.currentPassword = currentPassword;
            updateData.newPassword = newPassword;
        } else if (currentPassword || newPassword) {
            toast.error('Both current and new passwords are required for a password update.');
            return;
        }

        if (Object.keys(updateData).length === 0) {
            toast.error('No fields to update.');
            return;
        }
        if (Object.keys(updateData).length > 1 && !(currentPassword && newPassword)) {
            toast.error('Please update only one field at a time.');
            return;
        }
        
        try {
            const response = await axios.put('https://pma-backend-4yqr.onrender.com/api/users/update-settings', updateData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                showSuccessMessage();
                if (name) localStorage.setItem('name', name);
                setUserInfo({ name: '', email: '', currentPassword: '', newPassword: '' });
            }
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Unable to update settings. Please try again.');
        }
    };
    
    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    return (
        <div className={styles.settingContainer}>
            <h3>Settings</h3>
            <form className={styles.settingsForm} onSubmit={handleFormSubmit}>
                <div className={styles.userInput}>
                    <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={styles.userInput}>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={styles.userInput}>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input
                        type={passwordVisibility.current ? 'text' : 'password'}
                        placeholder="Current Password"
                        name="currentPassword"
                        value={userInfo.currentPassword}
                        onChange={handleInputChange}
                    />
                    <FontAwesomeIcon
                        icon={passwordVisibility.current ? faEye : faEyeSlash}
                        className={styles.toggleIcon}
                        onClick={() => togglePasswordVisibility('current')}
                    />
                </div>

                <div className={styles.userInput}>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input
                        type={passwordVisibility.new ? 'text' : 'password'}
                        placeholder="New Password"
                        name="newPassword"
                        value={userInfo.newPassword}
                        onChange={handleInputChange}
                    />
                    <FontAwesomeIcon
                        icon={passwordVisibility.new ? faEye : faEyeSlash}
                        className={styles.toggleIcon}
                        onClick={() => togglePasswordVisibility('new')}
                    />
                </div>

                <button type="submit" className={styles.updateButton}>
                    Update
                </button>
                <ToastContainer />
            </form>
        </div>
    );
};

export default Settings;
