import { createServer } from 'http';
import WebSocketServer from './websocketServer';

const server = createServer();
const wss = new WebSocketServer(server);

server.listen(8080, () => {
  const address = server.address();
  const port = typeof address === 'string' ? address : address?.port;
  console.log(`Server is listening on port ${port}`);
});
