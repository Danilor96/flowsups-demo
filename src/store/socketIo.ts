import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketStore {
  socket: Socket | null;
  initializeSocket: (userEmail: string) => void;
  updateDataWithSocket: (
    dataToUpdate: string,
    emailToEmit?: string,
    extraData?: Record<string, unknown>,
  ) => void;
  emiterUser: string | null;
  setEmiterUser: (email: string) => void;
}

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001';

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  emiterUser: null,
  initializeSocket: (userEmail) => {
    set((state) => {
      if (state.socket) return state;

      const socketInstance = io(socketUrl, {
        query: {
          userEmail,
        },
      });

      return { socket: socketInstance };
    });
  },
  updateDataWithSocket: (dataToUpdate, emailToEmit, extraData) => {
    const { socket, emiterUser } = get();

    if (emailToEmit) {
      socket?.emit('ask_for_update_data', dataToUpdate, true, emailToEmit, extraData, emiterUser);
    } else {
      socket?.emit('ask_for_update_data', dataToUpdate, false, '', extraData, emiterUser);
    }
  },
  setEmiterUser: (email) => {
    set({ emiterUser: email });
  },
}));
