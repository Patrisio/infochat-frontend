import io from 'socket.io-client';

const URL = 'https://infochat-production.herokuapp.com';
const socket = io(URL);

export default socket;