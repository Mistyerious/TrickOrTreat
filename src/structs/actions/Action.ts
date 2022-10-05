import { Client } from '../Client';
import { GatewayDispatchPayload } from 'discord-api-types/v10';

export class Action {
	client: Client = null!;
	constructor(client: Client) {
		Object.defineProperty(this, 'client', {
			value: client,
			enumerable: false,
		});
	}

	handle(data: GatewayDispatchPayload): any {
		return data;
	}
}
