// 'use client';

// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { InputTask } from './InputTask';
// import { IndividualAsignedTasks } from './IndividualAsignedTasks';

// export function AsignTasks({
//   users,
//   activeUser,
//   activeUserId,
// }: {
//   users: any;
//   activeUser: string;
//   activeUserId: number | null;
// }) {

//   const socket = io('https://flowsups-client-websocket.onrender.com');
//   const [selectedUser, setSelectedUser] = useState('');
//   const [task, setTask] = useState('');
//   const [taskTitle, setTaskTitle] = useState('');
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [userSpecificTasks, setUserSpecificTasks] = useState(null);

//   const handleSendTask = () => {
//     if (selectedUserId && task && taskTitle && activeUserId) {
//       const data = {
//         title: taskTitle,
//         description: task,
//         assigned: selectedUserId,
//         creator: activeUserId,
//         task_status: 1,
//         assignedEmail: selectedUser,
//       };
//       socket.emit('save_task', data);
//       setTask('');
//       setTaskTitle('');
//       socket.emit('ask_for_all_tasks_of_an_user', { selectedUser, activeUser });
//     } else {
//       console.log('task, task title, selected user or sender user is undefined');
//     }
//   };

//   useEffect(() => {
//     if (activeUser) {
//       socket.emit('login', activeUser);
//     }
//   }, [activeUser]);

//   useEffect(() => {
//     if (selectedUser) {
//       socket.emit('ask_for_all_tasks_of_an_user', { selectedUser, activeUser });
//     }
//   }, [selectedUser]);

//   socket.on('get_all_tasks_of_an_user', (data) => {
//     setUserSpecificTasks(data);
//   });

//   return (
//     <div>
//       Users:
//       <ul>
//         {users.map((user: any) => {
//           if (user.user_has[0].role_id! != 1 && user.user_has[0].role_id != 2) {
//             return (
//               <li
//                 onClick={() => {
//                   setSelectedUser('');
//                   setSelectedUser(user.email);
//                   setSelectedUserId(user.id);
//                 }}
//                 key={user.id}
//               >
//                 {user.email}
//               </li>
//             );
//           }
//         })}
//       </ul>
//       {selectedUser && (
//         <aside className="relative p-2 border border-blue-300 rounded w-72 h-fit">
//           <h2 className="mx-auto mb-2 w-fit">Assign task to {selectedUser}</h2>
//           <InputTask
//             action={handleSendTask}
//             task={task}
//             setTask={setTask}
//             taskTitle={taskTitle}
//             setTaskTitle={setTaskTitle}
//           />
//           <h2>Tasks assigned:</h2>
//           <IndividualAsignedTasks assignedTasks={userSpecificTasks} />
//           <article
//             onClick={() => {
//               setSelectedUser('');
//               setTask('');
//               setTaskTitle('');
//             }}
//             className="absolute flex items-center justify-center w-5 h-5 text-white bg-red-600 rounded-full cursor-pointer top-1 right-1"
//           >
//             X
//           </article>
//         </aside>
//       )}
//     </div>
//   );
// }
