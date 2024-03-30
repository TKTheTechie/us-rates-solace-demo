import { writable } from 'svelte/store';

export enum LOG_TYPE {
	INFO,
	WARN,
	ERROR
}

export interface LOG_ENTRY {
	type: LOG_TYPE;
	message: string;
}

// Create a writable store for login state
export const loggedIn = writable(false);

export const trader_name = writable('');

export const log = writable<LOG_ENTRY>();

export class ConsoleLogger {
	static log(message: string) {
		log.set({ type: LOG_TYPE.INFO, message });
	}
	static warn(message: string) {
		log.set({ type: LOG_TYPE.WARN, message });
	}
	static error(message: string) {
		log.set({ type: LOG_TYPE.ERROR, message });
	}
}

export enum SOLACE_STATUS_CODES {
	CONNECTING,
	CONNECTED,
	DISCONNECTED
}

export const SOLACE_STATUS = writable<SOLACE_STATUS_CODES>(SOLACE_STATUS_CODES.CONNECTING);

export interface SecurityInfo {
	securityType: string;
	securityTerm: string;
	cusip: string;
	price: number;
	yield: number;
}

