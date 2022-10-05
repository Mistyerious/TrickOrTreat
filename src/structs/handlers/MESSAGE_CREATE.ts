import { Client } from '../Client';
import { GatewayDispatchPayload } from 'discord-api-types/v10';

export default (client: Client, packet: GatewayDispatchPayload) => {
	// @ts-ignore
	client.actions.MessageCreate.handle(packet.d);
};
