import EventEmitter from 'events';
import { GatewayDispatchPayload } from 'discord-api-types/v10';
import { Client } from '../Client';

export class BaseHandler extends EventEmitter {
	client: Client = null!;
	constructor(client: Client) {
		super();

		Object.defineProperty(this, 'client', {
			value: client,
			enumerable: false,
		});
	}

	handle(data: GatewayDispatchPayload) {
		this.client.emit(data.t, data.d);
	}
}
