import { Client } from '../Client';

export class ActionManager {
	client: Client = null!;
	constructor(client: Client) {
		Object.defineProperty(this, 'client', {
			value: client,
			enumerable: false,
		});

		this.register(require('./MessageCreate'));
	}

	register(action: any) {
		// this[action.name.replace(/Action$/, '')] =
	}
}
