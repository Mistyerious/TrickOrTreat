import { RawData, WebSocket } from 'ws';
import { GatewayDispatchEvents, GatewayOpcodes, GatewayReceivePayload } from 'discord-api-types/v10';
import { BaseHandler } from './handlers';
import { Client } from './Client';

export class Shard {
	#gateway: WebSocket = null!;
	client: Client = null!;
	#sequence: number | null = null;
	#session_id: any = null;
	#lastHeartbeat: number | null = null;
	#lastAck: number | null = null;
	#readyAt: number | null = null;
	constructor(client: Client) {
		Object.defineProperty(this, 'client', {
			value: client,
			enumerable: false,
		});
	}

	get ping() {
		return this.#lastHeartbeat! - this.#lastAck!;
	}

	connect() {
		if (this.#gateway) throw new Error('GATEWAY_CONNECTION_ESTABLISHED');

		this.#gateway = new WebSocket('wss://gateway.discord.gg?v=10');

		this.#gateway.on('message', this.#processMessage.bind(this));
	}

	#debug(msg: string) {
		this.client.emit('debug', msg);
	}

	#identify() {
		this.#session_id ? this.#reconnect() : this.#identifyNew();
	}

	#identifyNew() {
		this.#gateway.send(
			JSON.stringify({
				op: GatewayOpcodes.Identify,
				d: {
					token: this.client.token, // Move to private file later,
					properties: {
						os: process.platform,
						browser: 'trickortreat',
						device: 'trickortreat',
					},
					intents: 131071,
				},
			}),
		);
	}

	#reconnect() {}

	#processMessage(raw: RawData) {
		let data: GatewayReceivePayload = JSON.parse(raw.toString());

		if (data.s && this.#sequence && data.s > this.#sequence) this.#sequence = data.s;

		switch (data.op) {
			case GatewayOpcodes.Dispatch: {
				switch (data.t) {
					case GatewayDispatchEvents.Ready: {
						this.#session_id = data.d.session_id;
						this.#readyAt = Date.now();
						new BaseHandler(this.client).handle(data);
					}
				}
				break;
			}
			case GatewayOpcodes.Hello: {
				const heartbeat = data.d.heartbeat_interval;
				const jitter = Math.floor(Math.random() * heartbeat);
				this.#debug(`Received Hello - First Heartbeat: (${jitter}ms)`);
				setTimeout(() => {
					this.#debug(`Sending first Heartbeat - Interval: (${heartbeat}ms)`);
					this.#gateway.send(JSON.stringify({ op: GatewayOpcodes.Heartbeat, d: this.#sequence }));
					this.#lastHeartbeat = Date.now();
					setInterval(() => {
						this.#debug('Sending heartbeat');
						this.#gateway.send(JSON.stringify({ op: GatewayOpcodes.Heartbeat, d: this.#sequence }));
						this.#lastHeartbeat = Date.now();
					}, heartbeat);
				}, jitter);

				this.#identifyNew();
			}
			case GatewayOpcodes.HeartbeatAck: {
				this.#debug(`Received Ack`);
				this.#lastAck = Date.now();
			}
			case GatewayOpcodes.InvalidSession: {
			}
			case GatewayOpcodes.Reconnect: {
			}
		}
	}
}
