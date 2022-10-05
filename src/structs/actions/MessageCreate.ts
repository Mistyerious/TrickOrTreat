import { Action } from './Action';
import { GatewayDispatchPayload } from 'discord-api-types/v10';

export class MessageCreate extends Action {
	handle(data: GatewayDispatchPayload) {
		this.client.emit('messageCreate', data);

		return {};
	}
}
