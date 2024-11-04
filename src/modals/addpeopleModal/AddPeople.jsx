import React, { useState } from 'react';
import styles from '../addpeopleModal/AddPeople.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddPeople = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const handleAddEmail = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get("token");
            await axios.post('https://pma-backend-lac.vercel.app/api/people/add', { email }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            closeModal(false);
        } catch (err) {
            setError(err.response ? err.response.data.message : "An error occurred");
        }
    };

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <div className={styles.title}>
                    <h1>Add People to the Board</h1>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleAddEmail}>
                    <input
                        className={styles.emailinput}
                        type="email"
                        placeholder="Enter the email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className={styles.footer}>
                       
                        <button onClick={() => closeModal(false)} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.addButton}>
                            Add Email
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPeople;
