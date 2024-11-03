import React, { useState } from 'react';
import styles from '../login/Login.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
axios.defaults.withCredentials = true; 
import Cookies from 'js-cookie'
const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showError, setShowError] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const displayToast = (message, isSuccess) => {
        const toastMethod = isSuccess ? toast.success : toast.error;
        toastMethod(message, {
            position: 'top-right',
            autoClose: 5000,
            theme: 'light',
        });
    };

    const handleInputChange = ({ target: { name, value } }) => {
        setCredentials((prev) => ({ ...prev, [name]: value }));
        if (value) setShowError(false);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = credentials;
        if (!email || !password) {
            setShowError(true);
            return;
        }

        try {
            const response = await axios.post('https://pma-backend-psi.vercel.app/api/users/login', { email, password });
            const { name, id,token } = response.data;
            console.log("response in login",response.data)
            localStorage.setItem('name',(name))
            localStorage.setItem('id',id)
            Cookies.set("token",token);
            displayToast('Login Successful', true);
            navigate('/dashboard'); 
        } catch (err) {
            console.log({err})
            console.log("hello there")
            displayToast('Login Failed: ' + (err.response?.data?.message || 'Server Error'), false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <>
            <div className={styles.loginContainer}>
                <h1 className={styles.loginHeader}>Login</h1>
                <form className={styles.loginForm} onSubmit={handleFormSubmit}>
                    <div className={styles.inputGroup}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </div>
                    {showError && !credentials.email && (
                        <p className={styles.errorMessage}>Email is required</p>
                    )}
                    <div className={styles.inputGroup}>
                        <FontAwesomeIcon icon={faLock} className={styles.icon} />
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                        <FontAwesomeIcon
                            icon={isPasswordVisible ? faEye : faEyeSlash}
                            className={styles.toggler}
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                    {showError && !credentials.password && (
                        <p className={styles.errorMessage}>Password is required</p>
                    )}
                    <button type="submit" className={styles.submitButton}>Log In</button>
                </form>
                <p className={styles.redirectText}>Don't have an account yet?</p>
                <a href="/register" className={styles.registerButton}>Register</a>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;
