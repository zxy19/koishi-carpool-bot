import {Mutex, Semaphore, withTimeout} from 'async-mutex';

export const JOIN_CAR = new Mutex();