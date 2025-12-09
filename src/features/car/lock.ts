import { Context, Session } from "koishi";
import { getPlayerCar, lockCar } from "../../data/car";

/**
 * 
 */
//
export function registerLock(ctx: Context) {
    ctx.command("car.lock [time:number] [unit]")
        .action((c, a, u) => process(ctx, c.session, a, u))
}
const multipliers = {
    "s": 1, "m": 60, "h": 3600
}
async function process(ctx: Context, session: Session, time: number, unit: string) {
    const car = await getPlayerCar(ctx, session.userId);
    if (!car) {
        return session.text(".not-in-car");
    }
    const multiplier = multipliers[unit || "m"];
    if (!multiplier)
        return session.text(".invalid-uni");
    let lockAt: Date = null;
    if (time) {
        lockAt = new Date();
        lockAt.setSeconds(lockAt.getSeconds() + time * multiplier);
    }
    await lockCar(ctx, car.id, lockAt);
    return session.text(".success");
}