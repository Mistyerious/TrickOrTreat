import EventEmitter from 'events';
import { Shard } from './Shard';

export class Client extends EventEmitter {
	#shard: Shard;
	token: string = null!;
	constructor(token: string) {
		super();
		this.#shard = null!;
		Object.defineProperty(this, 'token', {
			value: token,
			enumerable: false,
		});
	}

	connect() {
		this.#shard = new Shard(this);

		this.#shard.connect();
	}
}
