// 'use client';
// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// export function ReceiveTasks({
//   activeUser,
//   taskStatuses,
// }: {
//   activeUser: string;
//   taskStatuses: any;
// }) {
//   const socket = io('https://flowsups-client-websocket.onrender.com');
//   const [receiveTasks, setReceiveTasks] = useState(null);

//   useEffect(() => {
//     if (activeUser) {
//       socket.emit('login', activeUser);
//       socket.emit('ask_for_tasks', activeUser);
//     }
//   }, [activeUser]);

//   socket.on('received_tasks', (data: any) => {
//     setReceiveTasks(data);
//   });

//   const handleChangeStatus = (status: any, taskId: any) => {
//     if (status) {
//       socket.emit('set_task_status', { status, activeUser, taskId });
//     }
//   };

//   return (
//     <div>
//       <h2>Tasks:</h2>
//       <ul>
//         {receiveTasks
//           ? receiveTasks.map((task: any) => (
//               <li
//                 key={task.id}
//                 className="w-60 h-20 border border-blue-300 p-2 rounded flex flex-col justify-center items-center my-2"
//               >
//                 <p className="w-full">
//                   <b>{task.title}</b>
//                 </p>
//                 <p className="w-full">{task.description}</p>
//                 <select
//                   name=""
//                   id=""
//                   defaultValue={task.status}
//                   className="w-full"
//                   onChange={(e) => handleChangeStatus(e.target.value, task.id)}
//                 >
//                   {taskStatuses.map((status: any) => (
//                     <option key={status.id} value={status.id}>
//                       {status.status}
//                     </option>
//                   ))}
//                 </select>
//               </li>
//             ))
//           : 'No tasks assigned'}
//       </ul>
//       {!receiveTasks ? (
//         <button onClick={() => socket.emit('ask_for_tasks', activeUser)}>Get tasks</button>
//       ) : (
//         false
//       )}
//     </div>
//   );
// }
