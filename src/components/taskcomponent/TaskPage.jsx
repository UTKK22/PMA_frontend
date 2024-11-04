// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import Logo from "../../assets/Codesandbox.png";
// import styles from "../taskcomponent/TaskPage.module.css";
// import Cookies from 'js-cookie'
// const TaskPage = () => {
//     const [tasks, setTasks] = useState([]);
//     const [checklist, setChecklist] = useState([]);
//     const [isShow, setIsShow] = useState(false);
//     const id  = localStorage.getItem('id');

//     const getPriorityColor = (priority) => {
//         switch (priority) {
//             case 'low':
//                 return '#63C05B';
//             case 'moderate':
//                 return '#18B0FF';
//             case 'high':
//                 return '#FF2473';
//             default:
//                 return 'inherit';
//         }
//     };

//     const getDueDateColor = (dueDate, state) => {
//         const now = new Date();
//         const dueDateObj = new Date(dueDate);
//         const diff = dueDateObj - now;
//         if (state === 'done') {
//             return '#63C05B';
//         } else if (diff < 0 || state === 'backlog') {
//             return '#CF3636';
//         } else {
//             return '#DBDBDB';
//         }
//     };
//     useEffect(() => {
//         const fetchData = async () => {
//             const config = {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${Cookies.get('token')}`,
//                 },
//             };

//             try {
//                 const response = await axios.get(
//                     `https://pma-backend-4yqr.onrender.com/api/fetch_taskbyid/id`,
//                     config
//                 );
//                 console.log("fetched task data",response.data)
//                 setTasks(response.data);
//                 setChecklist(response.data.checklist.map((item) => ({ ...item })));
//                 setIsShow(response.data.state);
//             } catch (error) {
//                 console.error('Error fetching task data:', error);
//             }
//         };

//         fetchData();
//     }, [id]);

//     useEffect(() => {
//         if (tasks.state === 'backlog') {
//             setIsShow(true);
//         } else if (tasks.state === 'done') {
//             setIsShow(false);
//         }
//     }, [tasks.state]);

//     return (
//         <div className={styles.TaskPageContainer}>
//             <img src={Logo} alt="ProManageLogo" className={styles.logo} />
//             <div className={styles.TaskCard}>
//                 {tasks && (
//                     <div key={tasks._id}>
//                         <div
//                             style={{
//                                 backgroundColor: getPriorityColor(tasks.priority),
//                                 height: '10px',
//                                 width: '10px',
//                                 borderRadius: '50%',
//                                 marginBottom: '10px',
//                             }}
//                         />
//                         <h3>{tasks.title}</h3>
//                         <div className={styles.TaskCheckList}>
//                             <h4>
//                                 Checklist ({checklist.filter(item => item.isChecked).length}/{tasks.checklist?.length || 0})
//                             </h4>
//                         </div>

//                         <ul>
//                             {tasks.checklist?.map((item) => (
//                                 <li key={item._id}>
//                                     <input
//                                         type="checkbox"
//                                         checked={item.isChecked}
//                                         className={styles.Checklist}
//                                         // readOnly
//                                     />
//                                     {item.text}
//                                 </li>
//                             ))}
//                         </ul>

//                         {isShow && (
//                             <div className={styles.Track}>
//                                 <h4>Due Date</h4>
//                                 <div
//                                     className={styles.dueDate}
//                                     style={{
//                                         backgroundColor: getDueDateColor(tasks.dueDate, tasks.state),
//                                     }}
//                                 >
//                                     {moment(tasks.dueDate).format('MMM D')}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default TaskPage;
