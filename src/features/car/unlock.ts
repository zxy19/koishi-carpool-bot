import { Context, Session } from "koishi";
import { getPlayerCar, unlockCar } from "../../data/car";

/**
 * 
 */
//
export function registerUnlock(ctx: Context) {
    ctx.command("car.unlock")
        .action((c) => process(ctx, c.session))
}

async function process(ctx: Context, session: Session) {
    const car = await getPlayerCar(ctx, session.userId);
    if (!car) {
        return session.text(".not-in-car");
    }
    await unlockCar(ctx, car.id);
    return session.text(".success");
}