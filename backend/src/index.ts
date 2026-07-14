import { loadRootEnv } from './shared/loadRootEnv.js';
import { Logger } from './shared/Logger.js';
import { createServer } from './shared/Server.js';

loadRootEnv();

const port = Number(process.env.PORT ?? 3005);
const host = process.env.HOST ?? '0.0.0.0';
const app = createServer();

app.listen(port, host, () => {
  Logger.info(`Backend listening on ${host}:${port}`);
});
