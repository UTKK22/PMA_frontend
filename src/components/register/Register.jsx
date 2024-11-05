import React, { useState } from 'react';
import styles from '../register/Register.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faEnvelope, faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [icon, setIcon] = useState(faEyeSlash);

    const notifySuccess = () => {
        toast('Registration Successful', {
            position: 'top-center',
            autoClose: 5000,
            theme: 'light',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === 'confirmPassword') {
            setError(value !== formData.password ? 'Passwords do not match' : '');
        }
    };

    const validateForm = () => {
        const { name, email, password, confirmPassword } = formData;
        if (!name || !email || !password || !confirmPassword) {
            return 'All fields are required';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const response = await axios.post('https://pma-backend-4yqr.onrender.com/api/users/signup', formData);
            console.log("response in register", response);
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('id', response.data.id);
            notifySuccess();
            navigate('/dashboard'); // Directly navigate to dashboard
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed, please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordType(prevType => (prevType === 'password' ? 'text' : 'password'));
        setIcon(prevIcon => (prevIcon === faEye ? faEyeSlash : faEye));
    };

    return (
        <div className={styles.RegisterContainer}>
            <h1 className={styles.RegisterHeader}>Register</h1>
            <form className={styles.RegisterForm} onSubmit={handleSubmit}>
                <div className={styles.userInput}>
                    <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={styles.nameInput}
                    />
                </div>
                <div className={styles.userInput}>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.nameInput}
                    />
                </div>
                <div className={styles.userInput}>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input
                        type={passwordType}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={styles.nameInput}
                    />
                    <FontAwesomeIcon
                        icon={icon}
                        className={styles.ToggleIcon}
                        onClick={togglePasswordVisibility}
                    />
                </div>
                <div className={styles.userInput}>
                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                    <input
                        type={passwordType}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={styles.nameInput}
                    />
                </div>
                {error && <label className={styles.errorMessage}>{error}</label>}
                <button type="submit" className={styles.submitButton}>
                    Register
                </button>
            </form>
            <p className={styles.postText}>Already have an account?</p>
            <a href="/login" className={styles.loginButton}>Login</a>
            <ToastContainer />
        </div>
    );
};

export default RegisterForm;
