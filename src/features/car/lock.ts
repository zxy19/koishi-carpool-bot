import { Context, Session } from "koishi";
import { getPlayerCar, lockCar } from "../../data/car";
import { at, carMessage } from "../../utils/message";

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
        return at(session,".not-in-car");
    }
    const multiplier = multipliers[unit || "m"];
    if (!multiplier)
        return at(session,".invalid-uni");
    let lockAt: Date = null;
    if (time) {
        lockAt = new Date();
        lockAt.setSeconds(lockAt.getSeconds() + time * multiplier);
        await lockCar(ctx, car.id, lockAt);
        return carMessage(ctx, car, session.text(".delay", { delay: "" + time + at(session,".unit." + (unit || "m")) }), session, true);
    }
    await lockCar(ctx, car.id, lockAt);
    return carMessage(ctx, car, session.text(".success"), session, true);
}