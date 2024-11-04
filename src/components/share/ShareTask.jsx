import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import styles from "../share/ShareTask.module.css";
import moment from "moment";
// import { newDate } from 'react-datepicker';
import greendot from "../../assets/GreenDot.png";
import bluedot from "../../assets/Bluedot.png";
import reddot from "../../assets/Reddot.png";
import logo from "../../assets/codesandbox.png";
axios.defaults.withCredentials = true;
const ShareTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const token = Cookies.get("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get(
          `https://pma-backend-4yqr.onrender.com/api/tasks/fetch_tasksbyid/${id}`,
          config
        );
        setTask(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!task) return <p>No task found</p>;
  const countCheckedItems = (checklist) => {
    return checklist.reduce((count, item) => {
      return count + (item.isChecked ? 1 : 0);
    }, 0);
  };
  // const montharray=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // const date=newDate(task.dueDate);
  // const m=date.getMonth();
  // const month=montharray[m];
  // const day=date.getDate();
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return greendot;
      case "moderate":
        return bluedot;
      case "high":
        return reddot;
      default:
        return "inherit";
    }
  };
  return (
    <>
      <div className={styles.header}>
        <img src={logo} alt="Codesandbox" />
        <div>Pro Manage</div>
      </div>
      <div className={styles.container}>
        <span>
          <img src={getPriorityColor(task.priority)}></img>
        </span>
        <span className={styles.prior}> {task.priority?.toUpperCase()} PRIORITY</span>
        <h2>{task.title}</h2>
        <div className={styles.checklistContainer}>
          <h4>
            Checklist ({countCheckedItems(task.checklist)}/
            {task.checklist.length})
          </h4>
          <ul>
            {task.checklist.map((item, index) => (
              <li key={index}>
                <label className={styles.customCheckbox}>
                  <input type="checkbox" checked={item.isChecked} readOnly />
                  <span className={styles.checkboxIndicator}></span>
                  {item.text}
                </label>
              </li>
            ))}
          </ul>
        </div>
        { task.dueDate  && (<>
        <span>Due Date</span>
        <span className={styles.duedate}>
          {moment(task.dueDate).format("MMM D")}
        </span>
        </>)}
      </div>
    </>
  );
};

export default ShareTask;
