// stores/chat.js

import { ref } from 'vue';
import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import axiosIns from '@/plugins/axios';
import { title } from 'process';

const URL = "54.255.152.196:8080";
const socket = io(URL);

export const useSocketStore = defineStore('webSocket', () => {
  const connected = ref(false);
  const data = ref(null);
  const location = ref('baghdad');
  const sensors = ref([]);
const getSensorsType = async() => {
  try {
    await axiosIns.get(`sensor/668fb1217a0550a1ee115b27`).then((data) => {
      data = data.data;
      console.log('sensor', data)
      for(let i =0; i < data.length; i++) {
        axiosIns.get(`sensor-type/${data[i].sensorTypeId}`).then(( sensorData) =>{
          console.log('sensor type',sensorData.data)
          sensors.value.push({
            id: sensorData.data.id,
            name: sensorData.data.name,
            title: null,
            description: null,
          })
        }
        )
      }
    })
  } catch(e) {
    console.log(e);
  }
}

  const initializeSocket = () => {
    console.log('Attempting to connect...');
    socket.on("connect", () => {
      connected.value = true;
      getSensorsType()
      console.log('Connected to WebSocket server');
    });
    socket.on("disconnect", () => {
      connected.value = false;
      console.log('Disconnected from WebSocket server');
    });
    socket.on('66910b09cd6f49dcfdb74906/sensorsData', (args) => {
      data.value = args;
      sensors.value.forEach((sensor, index) => {
        if (sensor.id === args.sensorTypeId) {
          sensors.value[index] = { ...sensor, ...args };
        }
      });
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
    sensors,
    initializeSocket,
    disconnectSocket,
  };
});
