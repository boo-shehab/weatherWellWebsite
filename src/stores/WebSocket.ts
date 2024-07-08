// stores/chat.js

import { ref } from 'vue';
import { defineStore } from 'pinia';
import { io } from 'socket.io-client';

const URL = "192.168.223.69:3001";
const socket = io(URL);

export const useSocketStore = defineStore('webSocket', () => {
  const connected = ref(false);
  const data = ref(null);
  const location = ref('baghdad');
  const initializeSocket = () => {
    console.log('Attempting to connect...');

    socket.on("connect", () => {
      connected.value = true;
      console.log('Connected to WebSocket server');
    });

    socket.on("disconnect", () => {
      connected.value = false;
      console.log('Disconnected from WebSocket server');
    });

    socket.on(location.value, (args) => {
      data.value = args;
      console.log('foo event:', data.value);
    });

    socket.on("bar", (...args) => {
      console.log('bar event:', args);
    });
  };

  const disconnectSocket = () => {
    socket.disconnect();
  };

  return {
    connected,
    data,
    location,
    initializeSocket,
    disconnectSocket,
  };
});
