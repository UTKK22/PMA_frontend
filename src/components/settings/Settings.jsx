import React, { useState } from 'react';
import styles from '../settings/Settings.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const Settings = () => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
    });
    const [validationErrors, setValidationErrors] = useState({
        name: false,
        email: false,
        currentPassword: false,
        newPassword: false,
    });
    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
    });

    const showSuccessMessage = () => {
        toast('Settings updated successfully!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    // const handleFormSubmit = async (e) => {
    //     e.preventDefault();
    //     const { name, email, currentPassword, newPassword } = userInfo;

    //     // Create an object to store updates
    //     let updateData = {};
    //     let hasError = false;

    //     // Determine which field is being updated
    //     if (name.trim().length > 0) {
    //         updateData.name = name;
    //     }

    //     if (email.trim().length > 0) {
    //         updateData.email = email;
    //     }

    //     // Check for password update
    //     if (currentPassword.trim().length > 0 || newPassword.trim().length > 0) {
    //         if (currentPassword.trim().length === 0) {
    //             setValidationErrors((prev) => ({ ...prev, currentPassword: true }));
    //             hasError = true;
    //         }
    //         if (newPassword.trim().length === 0) {
    //             setValidationErrors((prev) => ({ ...prev, newPassword: true }));
    //             hasError = true;
    //         }

    //         // Ensure both passwords are filled out for a password update
    //         if (currentPassword.trim().length > 0 && newPassword.trim().length > 0) {
    //             updateData.currentPassword = currentPassword;
    //             updateData.newPassword = newPassword;
    //         } else {
    //             hasError = true; // At least one password field is missing
    //         }
    //     }

    //     // If there are validation errors, return early
    //     if (hasError) return;

    //     // Count how many fields are being updated
    //     const numberOfFieldsToUpdate = Object.keys(updateData).length;

    //     // If the user is updating password, consider it as one field
    //     if (currentPassword.trim().length > 0 && newPassword.trim().length > 0) {
    //         const isUpdatingPassword = numberOfFieldsToUpdate === 1; // If name/email is also present
    //         if (isUpdatingPassword) {
    //             toast.error('Please update only one field at a time.');
    //             return;
    //         }
    //     }
    
    //     if (numberOfFieldsToUpdate === 0) {
    //         toast.error('No fields to update.');
    //         return;
    //     }

    //     try {
    //         const response = await axios.put('http://localhost:4000/api/users/update-settings', updateData, {
    //             headers: { 
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${Cookies.get('token')}`
    //             },
    //         });

    //         if (response.status === 200) {
    //             showSuccessMessage();
    //             // Clear inputs after success
    //             setUserInfo({ name: '', email: '', currentPassword: '', newPassword: '' }); 
    //             setValidationErrors({
    //                 name: false,
    //                 email: false,
    //                 currentPassword: false,
    //                 newPassword: false,
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Failed to update settings:', error);
    //         toast.error('Unable to update settings. Please try again.');
    //     }
    // };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const { name, email, currentPassword, newPassword } = userInfo;
        
        // Create an object to store updates
        let updateData = {};
        let hasError = false;
    
        // Determine which field is being updated
        if (name.trim().length > 0) {
            updateData.name = name;
        }
    
        if (email.trim().length > 0) {
            updateData.email = email;
        }
    
        // Check for password update
        if (currentPassword.trim().length > 0 || newPassword.trim().length > 0) {
            if (currentPassword.trim().length === 0) {
                toast.error('Current password is required.');
                hasError = true;
            }
            if (newPassword.trim().length === 0) {
                toast.error('New password is required.');
                hasError = true;
            }
    
            // Ensure both passwords are filled out for a password update
            if (currentPassword.trim().length > 0 && newPassword.trim().length > 0) {
                updateData.currentPassword = currentPassword;
                updateData.newPassword = newPassword;
            } else {
                hasError = true; // At least one password field is missing
            }
        }
    
        // If there are validation errors, return early
        if (hasError) return;
    
        // Count how many fields are being updated
        const numberOfFieldsToUpdate = Object.keys(updateData).length;
        if (numberOfFieldsToUpdate === 0) {
            toast.error('No fields to update.');
            return;
        }
        if (numberOfFieldsToUpdate > 2) {
            toast.error('Please update only one field at a time.');
            return;
        }
    
        try {
            const response = await axios.put('https://pma-backend-psi.vercel.app/api/users/update-settings', updateData, {
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`
                },
            });
    
            if (response.status === 200) {
                showSuccessMessage();
                // const updatedUserData = { ...JSON.parse(localStorage.getItem("name"))}; 
                localStorage.setItem("name", (updateData.name));
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
                    {/* {validationErrors.name && <label className={styles.errorMessage}>Name is required</label>} */}
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
                    {/* {validationErrors.email && <label className={styles.errorMessage}>Email is required</label>} */}
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
                    {validationErrors.currentPassword && <label className={styles.errorMessage}>Current password is required</label>}
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
                    {validationErrors.newPassword && <label className={styles.errorMessage}>New password is required</label>}
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
