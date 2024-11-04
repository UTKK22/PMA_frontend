import React from 'react';
import styles from '../deleteModal/Delete.module.css';
import axios from 'axios';
import Cookies from 'js-cookie'
const DeleteModal = ({ closeModal, taskId }) => {
    // Axios configuration for API calls
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
    };

    // Function to handle the deletion of a task
    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `https://pma-backend-lac.vercel.app/api/tasks/delete_task/${taskId}`,
                config
            );
            console.log('Task successfully deleted:', response.data);
            closeModal(false);
            window.location.reload(); // Reload the page to reflect changes
        } catch (error) {
            console.error('Failed to delete task:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <div className={styles.title}>
                    <h1>Are you certain you want to delete this task?</h1>
                </div>
                <div className={styles.footer}>
                    <button className={styles.deleteButton} onClick={handleDelete}>
                        Yes, Delete
                    </button>
                    <button
                        onClick={() => closeModal(false)}
                        className={styles.cancelButton} 
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
