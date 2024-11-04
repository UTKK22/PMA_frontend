import React, { useState, useEffect } from 'react';
import styles from '../editModal/Edit.module.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DeleteIcon from '../../assets/Delete.png';
axios.defaults.withCredentials = true;
const EditsModal = ({ closeModal, taskId }) => {
    const [taskDetails, setTaskDetails] = useState(null);
    const [formFields, setFormFields] = useState({
        title: '',
        priority: 'low',
        dueDate: new Date(),
        user: localStorage.getItem('id'),
        checklist: [{ text: '', isChecked: false }],
        state: 'todo',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const response = await axios.get(
                    `https://pma-backend-4yqr.onrender.com/api/tasks/fetch_tasksbyid/${taskId}`
                );
                setTaskDetails(response.data);
                setFormFields(response.data);
            } catch (error) {
                console.error('Error retrieving task:', error);
            }
        };

        if (taskId) {
            fetchTaskDetails();
        }
    }, [taskId]);

    const handleInputChange = (e, index) => {
        if (index !== undefined) {
            const updatedChecklist = [...formFields.checklist];
            updatedChecklist[index] = {
                ...updatedChecklist[index],
                text: e.target.value,
                isChecked: e.target.checked,
            };
            setFormFields({ ...formFields, checklist: updatedChecklist });
        } else {
            setFormFields({ ...formFields, [e.target.name]: e.target.value });
        }
    };

    const handleFormSubmit = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };

            const errors = validateFields(formFields);
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            }

            await axios.put(
                `https://pma-backend-4yqr.onrender.com/api/tasks/edit_task/${taskId}`,
                formFields,
                config
            );
            closeModal(false);
            window.location.reload();
        } catch (error) {
            const errorMessage = error.response?.data?.errors || { global: error.message };
            setFormErrors(errorMessage);
        }
    };

    const handleChecklistItemDelete = (e, index) => {
        e.preventDefault();
        const updatedChecklist = [...formFields.checklist];
        updatedChecklist.splice(index, 1);
        setFormFields({ ...formFields, checklist: updatedChecklist });
    };

    const handleChecklistItemAdd = (e) => {
        e.preventDefault();
        setFormFields((prev) => ({
            ...prev,
            checklist: [...prev.checklist, { text: '', isChecked: false }],
        }));
    };

    const validateFields = (data) => {
        const errors = {};
        if (!data.title) errors.title = 'Title is mandatory';
        if (!data.dueDate) errors.dueDate = 'Due date is required';
        return errors;
    };

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <form className={styles.modal}>
                    <label className={styles.required}>Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter task title"
                        value={formFields.title}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.title && <p className={styles.error}>{formErrors.title}</p>}

                    <div className={styles.prioritySection}>
                        <label className={styles.required}>Select Priority</label>
                        {['high', 'moderate', 'low'].map((level) => (
                            <button
                                key={level}
                                value={level}
                                name="priority"
                                onClick={(e) => handleInputChange(e)}
                                type="button"
                                className={formFields.priority === level ? styles.active : ''}
                            >
                                {level.toUpperCase()} PRIORITY
                            </button>
                        ))}
                    </div>

                    <div className={styles.checklistSection}>
                        {formFields.checklist.map((item, index) => (
                            <div className={styles.checklistItem} key={index}>
                                <input
                                    type="checkbox"
                                    checked={item.isChecked}
                                    onChange={(e) => handleInputChange(e, index)}
                                    className={styles.checklistCheckbox}
                                />
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => handleInputChange(e, index)}
                                    placeholder="Add a checklist item"
                                    className={styles.checklistInput}
                                />
                                <button onClick={(e) => handleChecklistItemDelete(e, index)} className={styles.deleteButton}>
                                    <img src={DeleteIcon} alt="Delete" />
                                </button>
                            </div>
                        ))}
                        <button className={styles.addButton} onClick={handleChecklistItemAdd}>
                            + Add New Item
                        </button>
                    </div>

                    <div className={styles.datePickerSection}>
                        <DatePicker
                            selected={formFields.dueDate}
                            onChange={(date) => handleInputChange({ target: { name: 'dueDate', value: date } })}
                            required
                        />
                        {formErrors.dueDate && (
                            <p className={styles.error}>{formErrors.dueDate}</p>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelButton} onClick={() => closeModal(false)}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.saveButton} onClick={handleFormSubmit}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditsModal;
