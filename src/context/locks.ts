import { Mutex, Semaphore, withTimeout } from 'async-mutex';

export const CAR_OPERATE_LOCK = new Mutex();

export async function operateCarWrapErr<P extends any[], R>(cb: (...p: P) => Promise<R>, ...a: P): Promise<R> {
    let ret = null;
    await CAR_OPERATE_LOCK.acquire();
    try {
        ret = await cb(...a);
    } catch (e) {
        CAR_OPERATE_LOCK.release()
        throw e;
    }
    CAR_OPERATE_LOCK.release()
    return ret;
}