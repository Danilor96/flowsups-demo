// const express = require('express');
// const app = express();
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const { PrismaClient } = require('@prisma/client');

// app.use(cors());

// const server = http.createServer(app);
// ;

// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// });

// const connectedUsers = {};

// io.on('connection', async (socket) => {
//   console.log('Connection attempt!');

//   // Check logged users
//   socket.on('login', async (email) => {
//     connectedUsers[socket.id] = email;
//     console.log(`User ${email} connected with id: ${socket.id}`);

//     // Retrieve connected users
//     io.emit('user_connected', Object.values(connectedUsers));
//   });

//   socket.on('get_selected_recipient_messages', async (users) => {
//     console.log({ sen: users.sender, reci: users.recipient });

//     const recipientEmail = users.recipient;
//     const senderEmail = users.sender;

//     try {
//       const messages = await prisma?.chat_messages.findMany({
//         where: {
//           OR: [
//             {
//               sender: {
//                 email: senderEmail,
//               },
//               recipient: {
//                 email: recipientEmail,
//               },
//             },
//             {
//               recipient: {
//                 email: senderEmail,
//               },
//               sender: {
//                 email: recipientEmail,
//               },
//             },
//           ],
//         },
//         include: {
//           sender: {
//             select: {
//               email: true,
//             },
//           },
//         },
//         orderBy: {
//           sent_date: 'asc',
//         },
//       });

//       console.log('Prisma: ', messages);
//       const senderSocketId = Object.keys(connectedUsers).find(
//         (id) => connectedUsers[id] === senderEmail,
//       );
//       io.to(senderSocketId).emit('chat_messages', messages);
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log(`User with id ${socket.id} disconnected`);

//     // Delete disconnected users from connected users object
//     delete connectedUsers[socket.id];

//     // Retrieve a new list with connected users
//     io.emit('user_connected', Object.values(connectedUsers));
//   });

//   // Send message to a specific user
//   socket.on('send_message', async (data) => {
//     const { recipientEmail, message } = data;
//     const senderEmail = connectedUsers[socket.id];

//     try {
//       const sender = await prisma?.users.findUnique({
//         where: {
//           email: senderEmail,
//         },
//       });
//       const recipient = await prisma?.users.findUnique({ where: { email: recipientEmail } });

//       if (sender && recipient) {
//         const newMessage = await prisma?.chat_messages.create({
//           data: {
//             messages: message,
//             sent_date: new Date(),
//             sender: { connect: { id: sender.id } },
//             recipient: { connect: { id: recipient.id } },
//           },
//         });

//         const recipientSocketId = Object.keys(connectedUsers).find(
//           (id) => connectedUsers[id] === recipientEmail,
//         );
//         if (recipientSocketId) {
//           console.log('Envíalo');
//           io.to(recipientSocketId).emit('receive_message', {
//             senderEmail: senderEmail,
//             message: newMessage.messages,
//             date: newMessage.sent_date,
//           });
//         }
//       } else {
//         console.error('Sender or recipient not found');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   });
// });

// server.listen(3001, () => {
//   console.log('Server running on port 3001');
// });
