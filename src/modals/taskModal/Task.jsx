import React, { useState, useEffect } from "react";
import styles from "../taskModal/Task.module.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteIcon from "../../assets/Delete.png";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

const TaskModal = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "low",
    dueDate: new Date(),
    user: localStorage.getItem("id"),
    checklist: [{ text: "", isChecked: false }],
    state: "todo",
    assignee: "",
  });
  const { title, dueDate, assignee, user } = formData;
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [checkItems, setCheckItems] = useState([
    { text: "", isChecked: false },
  ]);
  const [assignees, setAssignees] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const usersResponse = await axios.get(
          "https://pma-backend-psi.vercel.app/api/users/assignees"
        );
        console.log("userresponse", usersResponse);
        const peopleResponse = await axios.get(
          "https://pma-backend-psi.vercel.app/api/people/emails"
        );
        console.log("peoplerespnse", peopleResponse);
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
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };
      await axios.post(
        "https://pma-backend-psi.vercel.app/api/tasks/create_tasks",
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
  };

  const selectAssignee = (email) => {
    setFormData({ ...formData, assignee: email });
    setIsDropdownOpen(false);
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

          <div className={styles.priorityContainer}>
            <label className={styles.label}>Select Priority</label>
            <div className={styles.priorityButtons}>
              <button
                value="high"
                name="priority"
                onClick={handleChange}
                type="button"
                className={styles.priorityButton}
                style={{
                  backgroundColor:
                    selectedPriority === "high"
                      ? "rgba(238, 236, 236, 1)"
                      : "white",
                }}
              >
                <div
                  className={styles.colorIndicator}
                  style={{ backgroundColor: "red" }}
                ></div>
                HIGH PRIORITY
              </button>
              <button
                value="moderate"
                name="priority"
                onClick={handleChange}
                type="button"
                className={styles.priorityButton}
                style={{
                  backgroundColor:
                    selectedPriority === "moderate"
                      ? "rgba(238, 236, 236, 1)"
                      : "white",
                }}
              >
                <div
                  className={styles.colorIndicator}
                  style={{ backgroundColor: "blue" }}
                ></div>
                MODERATE PRIORITY
              </button>
              <button
                value="low"
                name="priority"
                onClick={handleChange}
                type="button"
                className={styles.priorityButton}
                style={{
                  backgroundColor:
                    selectedPriority === "low"
                      ? "rgba(238, 236, 236, 1)"
                      : "white",
                }}
              >
                <div
                  className={styles.colorIndicator}
                  style={{ backgroundColor: "green" }}
                ></div>
                LOW PRIORITY
              </button>
            </div>
          </div>

          <div className={styles.assigneeContainer}>
            <label className={styles.label}>Assignee</label>
            <div className={styles.assigneeInput} onClick={toggleDropdown}>
              <input
                type="text"
                value={assignee || "Select Assignee"}
                readOnly
                className={styles.assigneeField}
              />
              <span className={styles.arrow}>▼</span>
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                {assignees.map((email) => (
                  <div
                    key={email}
                    className={styles.dropdownItem}
                    onClick={() => selectAssignee(email)}
                  >
                    {email}
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
