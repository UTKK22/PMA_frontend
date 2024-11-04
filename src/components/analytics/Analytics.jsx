import React, { useState, useEffect } from "react";
import styles from "../analytics/Analytics.module.css";
import axios from "axios";
import bluedot from "../../assets/Bluedot.png";
import Cookies from "js-cookie";
const Analytics = () => {
  const [taskList, setTaskList] = useState([]);

  const loadTasks = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };
      const id=localStorage.getItem("id");
      const response = await axios.get(
        `https://pma-backend-4yqr.onrender.com/api/tasks/fetchalltasks?id=${id}`,
        config
      );
      console.log("Analytics",response.data)
      setTaskList(response.data);
    } catch (error) {
      console.error("Failed to retrieve tasks:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const calculateStateCounts = () => {
    return taskList.reduce(
      (accumulator, task) => {
        accumulator[task.status] = (accumulator[task.status] || 0) + 1;
        return accumulator;
      },
      {
        todo: 0,
        "in-progress": 0,
        done: 0,
        backlog: 0,
      }
    );
  };


  const calculatePriorityCounts = () => {
    return taskList.reduce(
      (accumulator, task) => {
        accumulator[task.priority] = (accumulator[task.priority] || 0) + 1;
        return accumulator;
      },
      {
        low: 0,
        moderate: 0,
        high: 0,
      }
    );
  };

  const countPastDueTasks = () => {
    const currentDate = new Date();
    return taskList.reduce(
      (accumulator, task) => {
        if (task.dueDate && new Date(task.dueDate).getDate <= currentDate.getDate) {
          accumulator.DueDate = (accumulator.DueDate || 0) + 1;
        }
        return accumulator;
      },
      { DueDate: 0 }
    );
  };

  return (
    <div className={styles.AnalyticsContainer}>
      <h3>Task Analytics</h3>
      <div className={styles.Analytics}>
        <div className={styles.Tasks}>
          <ul className={styles.TasksLists}>
            {Object.entries(calculateStateCounts()).map(([state, count]) => {
              console.log({state,count})
              return (
                <li key={state}>
                  <img
                    src={bluedot}
                    alt="Task Indicator"
                    style={{ marginRight: "10px" }}
                  />
                  {state.charAt(0).toUpperCase() + state.slice(1)} Tasks:{" "}
                  <strong>{count}</strong>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.Priority}>
          <ul className={styles.PriorityLists}>
            {Object.entries(calculatePriorityCounts()).map(
              ([priority, count]) => (
                <li key={priority}>
                  <img
                    src={bluedot}
                    alt="Priority Indicator"
                    style={{ marginRight: "10px" }}
                  />
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}{" "}
                  Priority: <strong>{count}</strong>
                </li>
              )
            )}
            {Object.entries(countPastDueTasks()).map(([dueDate, count]) => (
              <li key={dueDate}>
                <img
                  src={bluedot}
                  alt="Due Date Indicator"
                  style={{ marginRight: "10px" }}
                />
                {dueDate}: <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
