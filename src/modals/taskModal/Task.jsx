import React, { useState, useEffect } from "react";
import styles from "../taskModal/Task.module.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteIcon from "../../assets/Delete.png";

axios.defaults.withCredentials = true;

const TaskModal = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "low",
    dueDate: null,
    user: localStorage.getItem("id"),
    checklist: [{ text: "", isChecked: false }],
    state: "todo",
    assignee: "",
  });
  const { title, dueDate, assignee, user } = formData;
  const [checkItems, setCheckItems] = useState([
    { text: "", isChecked: false },
  ]);
  const [assignees, setAssignees] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const usersResponse = await axios.get(
          "https://pma-backend-4yqr.onrender.com/api/users/assignees"
        );
        const peopleResponse = await axios.get(
          "https://pma-backend-4yqr.onrender.com/api/people/emails"
        );
        const combinedAssignees = [
          ...usersResponse.data,
          ...peopleResponse.data.emails,
        ];
        setAssignees(combinedAssignees);
      } catch (error) {
        console.error("Error fetching assignees:", error);
      }
    };
    fetchAssignees();
  }, []);

  const handleChange = (e, index) => {
    if (index !== undefined) {
      const updatedCheckItems = [...checkItems];
      updatedCheckItems[index] = {
        ...updatedCheckItems[index],
        [e.target.name]: e.target.value,
      };
      setCheckItems(updatedCheckItems);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(
        "https://pma-backend-4yqr.onrender.com/api/tasks/create_tasks",
        {
          ...formData,
          checklist: checkItems,
        },
        config
      );
      window.location.reload();
      closeModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (index) => {
    const updatedCheckItems = checkItems.filter((_, i) => i !== index);
    setCheckItems(updatedCheckItems);
  };

  const handleAdd = () => {
    setCheckItems([...checkItems, { text: "", isChecked: false }]);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsArrowVisible(!isArrowVisible);
  };

  const selectAssignee = (email) => {
    setFormData({ ...formData, assignee: email });
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    // Clear assignee on delete key press
    if (e.key === "Delete" || e.key === "Backspace") {
      setFormData({ ...formData, assignee: "" });
    }
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => handleChange(e)}
            required
            className={styles.inputField}
          />

          <div className={styles.assigneeContainer}>
            <div className={styles.assigneeLabelInputContainer}>
              <label className={styles.assigneelabel}>Assign to</label>
              <div className={styles.assigneeInput} onClick={toggleDropdown}>
                <input
                  type="text"
                  value={assignee || "Select Assignee"}
                  placeholder="Select Assignee"
                  className={styles.assigneeField}
                  onKeyDown={handleKeyDown} // Add keydown event listener here
                />
                {isArrowVisible && <span className={styles.arrow}>▼</span>}
              </div>
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                {assignees.map((email) => (
                  <div
                    key={email}
                    className={styles.dropdownItem}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.emailInitials}>
                      {email.charAt(0).toUpperCase() +
                        email.charAt(1).toUpperCase()}
                    </div>
                    <span className={styles.emailText}>{email}</span>
                    <button
                      type="button"
                      className={styles.assignButton}
                      onClick={() => selectAssignee(email)}
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.checklistArea}>
            Checklist (1/4)
            {checkItems.map((item, index) => (
              <div className={styles.checklistItem} key={index}>
                <div className={styles.taskInput}>
                  <input
                    type="checkbox"
                    name="isChecked"
                    checked={item.isChecked}
                    onChange={(e) => handleChange(e, index)}
                    className={styles.checkbox}
                  />
                  <input
                    type="text"
                    name="text"
                    value={item.text}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="Add a task"
                    className={styles.checklistInput}
                  />
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className={styles.deleteButton}
                >
                  <img src={DeleteIcon} alt="Delete" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAdd}
            >
              Add New
            </button>
          </div>

          <div className={styles.footer}>
            <DatePicker
              selected={dueDate}
              onChange={(date) =>
                handleChange({ target: { name: "dueDate", value: date } })
              }
              className={styles.datePicker}
              placeholderText="Select Due Date" 
            />
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => closeModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className={styles.saveButton}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
