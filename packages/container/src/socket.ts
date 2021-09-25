import io from 'socket.io-client';

const URL = 'http://localhost:3005';
const socket = io(URL, {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});

export default socket;