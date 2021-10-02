import io from 'socket.io-client';
import { localBackendHost, productionHost, isProduction } from 'lib/utils/constants';

const URL = isProduction ? productionHost : localBackendHost; //'http://localhost:3005';
const socket = io(URL, {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});

export default socket;