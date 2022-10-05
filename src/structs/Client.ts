import EventEmitter from 'events';
import { Shard } from './Shard';
import { ActionManager } from './actions';

export class Client extends EventEmitter {
	#shard: Shard;
	token: string = null!;
	actions: ActionManager = null!;
	constructor(token: string) {
		super();
		this.#shard = null!;
		Object.defineProperty(this, 'token', {
			value: token,
			enumerable: false,
		});
		Object.defineProperty(this, 'actions', {
			value: new ActionManager(this),
			enumerable: false,
		});
	}

	connect() {
		this.#shard = new Shard(this);

		this.#shard.connect();
	}
}
