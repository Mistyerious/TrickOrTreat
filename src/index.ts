import { Client } from './structs/Client';
import { TOKEN } from './config';

const client = new Client(TOKEN);

client.on('READY', console.log);
client.on('debug', console.log);

client.connect();
