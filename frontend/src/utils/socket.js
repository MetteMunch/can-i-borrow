import { io } from 'socket.io-client';

export const socket = io('http://localhost:8080', {
  withCredentials: true, //clienten sender cookie med socket-forbindelsen, så serveren kan se hvilken bruger der er på
  autoConnect: false, //bruger bliver ikke automatisk forbundet..men vi styrer det (det sker ved login)
});
