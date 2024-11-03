import React, { useEffect, useState } from "react";
import styles from "../dashboard/Dashboard.module.css";
import axios from "axios";
import moment from "moment";
import down from "../../assets/DownArrow.png";
import createBtn from "../../assets/Add.png";
import addpeople from "../../assets/People.png";
import TaskModal from "../../modals/taskModal/Task";
import DeleteModal from "../../modals/deleteModal/Delete";
import dots from "../../assets/Dot.png";
import { useClipboard } from "use-clipboard-copy";
import { toast, ToastContainer } from "react-toastify";
import closeButton from "../../assets/Collapse-all.png";
import EditModal from "../../modals/editModal/Edit";
import AddPeople from "../../modals/addpeopleModal/AddPeople";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
const DashBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [authorization, setAuthorization] = useState(false);
  const [isOpen, setIsOpen] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [taskState, setTaskState] = useState(tasks.state);
  const [filter, setFilter] = useState("This Week");
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [openTasks, setOpenTasks] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const token = Cookies.get("token");
  const notify = () => {
    toast("Link Copied ", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      style: {
        backgroundColor: "rgba(246, 255, 249, 1)",
        border: "2px solid rgba(72, 193, 181, 1)",
        boxShadow: "0px 4px 16px 0px rgba(16, 11, 39, 0.08)",
        borderRadius: "19px",
        color: "rgba(39, 48, 58, 1)",
        fontSize: "16px",
        fontFamily: "Poppins",
        textAlign: "center",
        width: "80%",
      },
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "#63C05B";
      case "moderate":
        return "#18B0FF";
      case "high":
        return "#FF2473";
      default:
        return "inherit";
    }
  };
  const getDueDateColor = (dueDate, state) => {
    // console.log("dueDate",dueDate);
    // console.log("state",state);
    const now = new Date();
    const dueDateObj = new Date(dueDate);
    const diff = dueDateObj - now;
    if (state === "done") {
      return "rgba(99, 192, 91, 1)";
    } else if (diff < 0 || state === "backlog") {
      return "rgba(90, 90, 90, 1)";
    } else {
      return " #CF3636";
    }
  };

  useEffect(() => {
    setAuthorization(!!token);
  }, [token]);

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const token = Cookies.get("token");
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };

  //     try {
  //       const response = await axios.get(
  //         "http://localhost:4000/api/tasks/fetchalltasks",
  //         config
  //       );
  //       const tasksItems = response.data;

  //       const checklist = tasksItems.flatMap((task) => task.checklist);
  //       console.log("taskitems", tasksItems);
  //       setTasks(tasksItems);
  //       setChecklist(checklist);
  //       setTaskState(tasksItems[0]?.status);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchTasks();
  // }, [taskState, isCheck]);

  // const updateTaskState = async (newTaskState, taskId) => {
  //   const token = Cookies.get("token");
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   const currentTask = tasks.find((task) => task._id === taskId);

  //   const updatedTask = {
  //     status: newTaskState,
  //     checklist: currentTask.checklist
  //   };
  //   if (currentTask.state === "done" && newTaskState !== "done") {
  //     updatedTask.checklist = currentTask.checklist.map((item) => ({
  //       ...item,
  //       isChecked: false,
  //       // isCheck:false
  //     }));
  //   }
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:4000/api/tasks/update_task/state/${taskId}`,
  //        updatedTask,
  //       // { status: newTaskState },
  //       config
  //     );
  //     setTaskState(response.data.status);
  //     setTasks((prevTasks) =>
  //       prevTasks.map((task) =>
  //         task._id === taskId
  //           ? {
  //               ...response.data,
  //               checklist: updatedTask.checklist,
  //               checklistLength: 0,
  //             }
  //           : task
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating task state:", error);
  //   }
  // };
  const updateTaskState = async (newTaskState, taskId) => {
    const token = Cookies.get("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const currentTask = tasks.find((task) => task._id === taskId);
    const updatedTask = {
      status: newTaskState,
      checklist: currentTask.checklist,
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/api/tasks/update_task/state/${taskId}`,
        updatedTask,
        config
      );

      setTaskState(response.data.status);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? response.data : task))
      );
    } catch (error) {
      console.error("Error updating task state:", error);
    }
  };

  useEffect(() => {
    const fetchInitialTasks = async () => {
      const initialFilter = "This Week";
      setFilter(initialFilter);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        };

        const response = await axios.get(
          `http://localhost:4000/api/tasks/filter?filter=${initialFilter}`,
          config
        );

        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks on mount:", error);
      }
    };

    fetchInitialTasks();
  }, []);

  const handleFitlerChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    console.log(config);
    axios
      .get(`http://localhost:4000/api/tasks/filter?filter=${newFilter}`, config)
      .then((res) => {
        console.log(res.data, "filter");
        setTasks(res.data);
      })
      .catch((err) => console.log(err.message));
  };

  const handleDropDown = (taskId) => {
    setOpenTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const handleMenuClick = (taskId) => {
    if (isMenuOpen === taskId) {
      setIsMenuOpen(null);
    } else {
      setIsMenuOpen(taskId);
    }
  };

  const handleShare = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      notify();
      // toast.success("Link Copied ");
    } catch (error) {
      console.error("Could not copy text: ", error);
      toast.error("Failed to copy link.");
    }
  };
  const handleCheck = async (taskId, checklistId, ischecked) => {
    try {
      const token = Cookies.get("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task._id === taskId) {
            return {
              ...task,
              checklist: task.checklist.map((item) =>{
                if(item._id === checklistId){
                  return { ...item, isChecked: !item.isChecked }
                }
                else{
                  return item
                }
              }
              ),
            };
          }
          return task;
        });
      });
      const url = `http://localhost:4000/api/tasks/${taskId}/checklists/${checklistId}`;

      const updatedChecklist={ischeck: !ischecked}

      console.log({updatedChecklist})


      await axios.put(url, updatedChecklist, config);
    } catch (error) {
      console.error("Error toggling checklist:", error.message);
    }
  };


  const completed = (checklist) => {
    return checklist.reduce((count, item) => {
      return count + (item.isChecked ? 1 : 0);
    }, 0);
  };

  const handleEditClick = (taskId) => {
    setSelectedTaskId(taskId);
    setEditModal(true);
  };

  const handleCloseAll = (taskState) => {
    setOpenTasks((prevState) => {
      const updatedState = { ...prevState };
      // Close only tasks with the specified state
      Object.keys(updatedState).forEach((taskId) => {
        const task = tasks.find((t) => t._id === taskId);
        if (task && task.status === taskState) {
          delete updatedState[taskId]; // Close this task
        }
      });
      return updatedState; // Return the updated state
    });
  };

  const handleDeleteClick = (taskId) => {
    setSelectedTaskId(taskId);
    setDeleteModal(true);
  };
  const greetings = `Welcome!  ${localStorage.getItem("name")}`;
  const handleAdd = () => {
    setAddModal(true);
  };
  const closeAdd = () => {
    setAddModal(false);
  };

  const getInitials = (email) => {
    const initials = `${email}`?.slice(0, 2).toUpperCase();
    console.log({ initials });
    return initials;
  };

  return (
    <>
      {authorization && (
        <div className={styles.MainContainer}>
          <div className={styles.DashBoardContainer1}>
            <div className={styles.DashBoardHeaders}>
              <h3>{greetings}</h3>
              <div className={styles.container2}>
                <span className={styles.board}>Board</span>
                <span className={styles.people} onClick={() => handleAdd()}>
                  <img src={addpeople} alt="addpeople" /> Add People
                </span>
                {addModal && <AddPeople closeModal={closeAdd} />}
              </div>
            </div>
            <div className={styles.DashBoardDateheaders}>
              <h3>{moment().format("Do MMM YYYY")}</h3>
              <select
                className={styles.DashBoardSelector}
                value={filter}
                onChange={handleFitlerChange}
              >
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
          </div>
          <div className={styles.DashBoardContainer2}>
            <div className={styles.TaskBoard}>
              <div className={styles.Task}>
                <div className={styles.create}>
                  <h3>Backlog</h3>
                  <button onClick={() => handleCloseAll("backlog")}>
                    <img src={closeButton} alt="closebtn" />
                  </button>
                </div>
                <div className={styles.TaskContainer}>
                  {tasks?.filter((task) => task.status === "backlog")
                    .map((task) => (
                      <div key={task._id} className={styles.TaskCard}>
                        <div className={styles.dropdownMenu}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              alignContent: "center ",
                              justifyContent: "center",
                              marginTop: "10px",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: getPriorityColor(
                                  task.priority
                                ),
                                height: "10px",
                                width: "10px",
                                borderRadius: "50px",
                                content: "",
                                marginRight: "2px",
                              }}
                            ></div>
                            <div>
                              <p className={styles.TaskPriority}>
                                {task.priority?.toUpperCase()} PRIORITY
                              </p>
                            </div>
                            {task.assignee && (
                              <div className={styles.assigneeinitials}>
                                {getInitials(task?.assignee)}
                              </div>
                            )}
                          </div>

                          <button
                            className={styles.dropbtn}
                            onClick={(e) => handleMenuClick(task._id)}
                          >
                            <img src={dots} alt="dots" />
                          </button>
                        </div>
                        {isMenuOpen === task._id && (
                          <div
                            id="myDropdown"
                            className={styles.dropdownContent}
                          >
                            <button onClick={() => handleEditClick(task._id)}>
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleShare(
                                  `http://localhost:5173/sharetask/${task._id}`
                                )
                              }
                            >
                              Share
                            </button>
                            <button
                              style={{ color: "#CF3636" }}
                              onClick={() => handleDeleteClick(task._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <h3>{task.title}</h3>
                        <div className={styles.TaskCheckList}>
                          <h4>
                            checklist ({completed(task.checklist)}/
                            {task.checklist?.length || 0})
                          </h4>

                          <button
                            className={styles.dropdown}
                            onClick={() => handleDropDown(task._id)}
                          >
                            <img src={down} alt="down" />
                          </button>
                        </div>
                        {openTasks[task._id] && (
                          <ul>
                            {task.checklist?.map((item, index) => (
                              <li key={index}>
                                <label className={styles.customCheckbox}>
                                {console.log(task.checklist,'checklist')}
                                  <input
                                    type="checkbox"
                                    checked={item.isChecked}
                                    onChange={(e) =>
                                      handleCheck(task._id, item._id, item.isChecked)
                                    }
                                    className={styles.Checklist}
                                  />
                                  <span
                                    className={styles.checkboxIndicator}
                                  ></span>
                                  
                                </label>
                                {item.text}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className={styles.Track}>
                          {task.dueDate && (<div
                            className={styles.dueDate}
                            style={{
                              backgroundColor: getDueDateColor(
                                task.dueDate,
                                task.status
                              ),
                            }}
                          >
                            {moment(task.dueDate).format("MMM D")}
                          </div>)}

                          <div className={styles.trackbtns}>
                            <button
                              className={styles.btn}
                              value="PROGRESS"
                              onClick={() =>
                                updateTaskState("in-progress", task._id)
                              }
                            >
                              PROGRESS
                            </button>
                            <button
                              className={styles.btn}
                              value="TODO"
                              onClick={() => updateTaskState("todo", task._id)}
                            >
                              TODO
                            </button>
                            <button
                              className={styles.btn}
                              value="DONE"
                              onClick={() => updateTaskState("done", task._id)}
                            >
                              DONE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className={styles.Task}>
                <div className={styles.create}>
                  <h3>To do</h3>
                  <div className={styles.createClose}>
                    <button onClick={() => setOpenModal(true)}>
                      <img src={createBtn} alt="btn" />
                    </button>
                    <button onClick={() => handleCloseAll("todo")}>
                      <img src={closeButton} alt="closebtn" />
                    </button>
                  </div>
                </div>
                <div className={styles.TaskContainer}>
                  {console.log({ tasks })}
                  {tasks
                    .filter((task) => task.status === "todo")
                    .map((task, index) => (
                      <div key={index} className={styles.TaskCard}>
                        <div className={styles.dropdownMenu}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "10px",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: getPriorityColor(
                                  task.priority
                                ),
                                height: "10px",
                                width: "10px",
                                borderRadius: "50px",
                                content: "",
                                marginRight: "2px",
                              }}
                            ></div>
                            <div>
                              <p className={styles.TaskPriority}>
                                {task.priority?.toUpperCase()} PRIORITY
                              </p>
                            </div>
                            {task.assignee && (
                              <div className={styles.assigneeinitials}>
                                {getInitials(task?.assignee)}
                              </div>
                            )}
                          </div>

                          <button
                            className={styles.dropbtn}
                            onClick={(e) => handleMenuClick(task._id)}
                          >
                            <img src={dots} alt="dots" />
                          </button>
                        </div>
                        {isMenuOpen === task._id && (
                          <div
                            id="myDropdown"
                            className={styles.dropdownContent}
                          >
                            <button onClick={() => handleEditClick(task._id)}>
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleShare(
                                  `http://localhost:5173/sharetask/${task._id}`
                                )
                              }
                            >
                              Share
                            </button>
                            <button
                              style={{ color: "#CF3636" }}
                              onClick={() => handleDeleteClick(task._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <h3>{task.title}</h3>

                        <div className={styles.TaskCheckList}>
                          <h4>
                            checklist ({completed(task.checklist)}/
                            {task.checklist?.length || 0})
                          </h4>

                          <button
                            className={styles.dropdown}
                            onClick={(e) => handleDropDown(task._id)}
                            key={task._id}
                          >
                            <img src={down} alt="down" />
                          </button>
                        </div>
                        {isOpen ||
                          (openTasks[task._id] && (
                            <ul>
                              {task.checklist?.map((item, index) => (
                                <li key={index}>
                                  <label className={styles.customCheckbox}>
                                  {console.log(task.checklist,'checklist', item)}
                                  <input
                                    type="checkbox"
                                    checked={item.isChecked}
                                    onChange={(e) =>
                                      handleCheck(task._id, item._id, item.isChecked)
                                    }
                                    className={styles.Checklist}
                                  />
                                  <span
                                    className={styles.checkboxIndicator}
                                  ></span>
                                  
                                </label>
                                  {item.text}
                                </li>
                              ))}
                            </ul>
                          ))}
                        <div className={styles.Track}>
                        {task.dueDate && (<div
                            className={styles.dueDate}
                            style={{
                              backgroundColor: getDueDateColor(
                                task.dueDate,
                                task.status
                              ),
                            }}
                          >
                            {moment(task.dueDate).format("MMM D")}
                          </div>)}
                          <div className={styles.trackbtns}>
                            <button
                              className={styles.btn}
                              value="in-progress"
                              onClick={() =>
                                updateTaskState("in-progress", task._id)
                              }
                            >
                              PROGRESS
                            </button>
                            <button
                              className={styles.btn}
                              value="backlog"
                              onClick={() =>
                                updateTaskState("backlog", task._id)
                              }
                            >
                              BACKLOG
                            </button>
                            <button
                              className={styles.btn}
                              value="done"
                              onClick={() => updateTaskState("done", task._id)}
                            >
                              DONE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className={styles.Task}>
                <div className={styles.create}>
                  <h3>In progress</h3>
                  <button onClick={() => handleCloseAll("in-progress")}>
                    <img src={closeButton} alt="closebtn" />
                  </button>
                </div>
                <div className={styles.TaskContainer}>
                  {tasks
                    .filter((task) => task.status === "in-progress")
                    .map((task) => (
                      <div key={task._id} className={styles.TaskCard}>
                        <div className={styles.dropdownMenu}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "10px",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: getPriorityColor(
                                  task.priority
                                ),
                                height: "10px",
                                width: "10px",
                                borderRadius: "50px",
                                content: "",
                                marginRight: "2px",
                              }}
                            ></div>
                            <div>
                              <p className={styles.TaskPriority}>
                                {task.priority?.toUpperCase()} PRIORITY
                              </p>
                            </div>
                            {task.assignee && (
                              <div className={styles.assigneeinitials}>
                                {getInitials(task?.assignee)}
                              </div>
                            )}
                          </div>

                          <button
                            className={styles.dropbtn}
                            onClick={(e) => handleMenuClick(task._id)}
                          >
                            <img src={dots} alt="dots" />
                          </button>
                        </div>
                        {isMenuOpen === task._id && (
                          <div
                            id="myDropdown"
                            className={styles.dropdownContent}
                          >
                            <button onClick={() => handleEditClick(task._id)}>
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleShare(
                                  `http://localhost:5173/sharetask/${task._id}`
                                )
                              }
                            >
                              Share
                            </button>
                            <button
                              style={{ color: "#CF3636" }}
                              onClick={() => handleDeleteClick(task._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <h3>{task.title}</h3>

                        <div className={styles.TaskCheckList}>
                          <h4>
                            checklist ({completed(task.checklist)}/
                            {task.checklist?.length || 0})
                          </h4>

                          <button
                            className={styles.dropdown}
                            onClick={(e) => handleDropDown(task._id)}
                            key={task._id}
                          >
                            <img src={down} alt="down" />
                          </button>
                        </div>
                        {openTasks[task._id] && (
                          <ul>
                            {task.checklist?.map((item, index) => (
                              <li key={index}>
                                 <label className={styles.customCheckbox}>
                                 {console.log(task.checklist,'checklist')}
                                  <input
                                    type="checkbox"
                                    checked={item.isChecked}
                                    onChange={(e) =>
                                      handleCheck(task._id, item._id, item.isChecked)
                                    }
                                    className={styles.Checklist}
                                  />
                                  <span
                                    className={styles.checkboxIndicator}
                                  ></span>
                                  
                                </label>
                                {item.text}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className={styles.Track}>
                        {task.dueDate && (<div
                            className={styles.dueDate}
                            style={{
                              backgroundColor: getDueDateColor(
                                task.dueDate,
                                task.status
                              ),
                            }}
                          >
                            {moment(task.dueDate).format("MMM D")}
                          </div>)}
                          <div className={styles.trackbtns}>
                            <button
                              className={styles.btn}
                              onClick={() =>
                                updateTaskState("backlog", task._id)
                              }
                            >
                              BACKLOG
                            </button>
                            <button
                              className={styles.btn}
                              onClick={() => updateTaskState("todo", task._id)}
                            >
                              TODO
                            </button>
                            <button
                              className={styles.btn}
                              onClick={() => updateTaskState("done", task._id)}
                            >
                              DONE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className={styles.Task}>
                <div className={styles.create}>
                  <h3>Done</h3>
                  <button onClick={() => handleCloseAll("done")}>
                    <img src={closeButton} alt="closebtn" />
                  </button>
                </div>
                <div className={styles.TaskContainer}>
                  {tasks
                    .filter((task) => task.status === "done")
                    .map((task) => (
                      <div key={task._id} className={styles.TaskCard}>
                        <div className={styles.dropdownMenu}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyItems: "center",
                              marginTop: "10px",
                              alignContent: "center",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: getPriorityColor(
                                  task.priority
                                ),
                                height: "10px",
                                width: "10px",
                                borderRadius: "50px",
                                content: "",
                                marginRight: "2px",
                              }}
                            ></div>
                            <div>
                              <p className={styles.TaskPriority}>
                                {task.priority?.toUpperCase()} PRIORITY
                              </p>
                            </div>
                            {task.assignee && (
                              <div className={styles.assigneeinitials}>
                                {getInitials(task?.assignee)}
                              </div>
                            )}
                          </div>

                          <button
                            className={styles.dropbtn}
                            onClick={(e) => handleMenuClick(task._id)}
                          >
                            <img src={dots} alt="dots" />
                          </button>
                        </div>
                        {isMenuOpen === task._id && (
                          <div
                            id="myDropdown"
                            className={styles.dropdownContent}
                          >
                            <button onClick={() => handleEditClick(task._id)}>
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleShare(
                                  `http://localhost:5173/sharetask/${task._id}`
                                )
                              }
                            >
                              Share
                            </button>
                            <button
                              style={{ color: "#CF3636" }}
                              onClick={() => handleDeleteClick(task._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <h3>{task.title}</h3>

                        <div className={styles.TaskCheckList}>
                          <h4>
                            checklist ({completed(task.checklist)}/
                            {task.checklist?.length || 0})
                          </h4>

                          <button
                            className={styles.dropdown}
                            onClick={(e) => handleDropDown(task._id)}
                            key={task._id}
                          >
                            <img src={down} alt="down" />
                          </button>
                        </div>
                        {openTasks[task._id] && (
                          <ul>
                            {task.checklist?.map((item, index) => (
                              <li key={index}>
                                <label className={styles.customCheckbox}>
                                {console.log(task.checklist,'checklist')}
                                  <input
                                    type="checkbox"
                                    checked={item.isChecked}
                                    onChange={(e) =>
                                      handleCheck(task._id, item._id, item.isChecked)
                                    }
                                    className={styles.Checklist}
                                  />
                                  <span
                                    className={styles.checkboxIndicator}
                                  ></span>
                                  
                                </label>
                                {item.text}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className={styles.Track}>
                          {task.dueDate && (<div
                            className={styles.dueDate}
                            style={{
                              backgroundColor: getDueDateColor(
                                task.dueDate,
                                task.status
                              ),
                            }}
                          >
                            {moment(task.dueDate).format("MMM D")}
                          </div>)}
                          <div className={styles.trackbtns}>
                            <button
                              className={styles.btn}
                              onClick={() =>
                                updateTaskState("backlog", task._id)
                              }
                            >
                              BACKLOG
                            </button>
                            <button
                              className={styles.btn}
                              onClick={() => updateTaskState("todo", task._id)}
                            >
                              TODO
                            </button>
                            <button
                              className={styles.btn}
                              onClick={() =>
                                updateTaskState("in-progress", task._id)
                              }
                            >
                              PROGRESS
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tasks.map(
        (task) =>
          deleteModal && (
            <DeleteModal
              key={task._id}
              closeModal={setDeleteModal}
              taskId={selectedTaskId}
            />
          )
      )}
      <ToastContainer />
      {tasks.map(
        (task) =>
          editModal && (
            <EditModal
              key={task._id}
              closeModal={setEditModal}
              taskId={selectedTaskId}
            />
          )
      )}

      {openModal && <TaskModal closeModal={setOpenModal} />}

      {!authorization && <p> Please login or register to access this page !</p>}
    </>
  );
};

export default DashBoard;
