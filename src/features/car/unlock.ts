import { Context, Session } from "koishi";
import { getPlayerCar, unlockCar } from "../../data/car";
import { at, carMessage } from "../../utils/message";

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
        return at(session,".not-in-car");
    }
    await unlockCar(ctx, car.id);
    return carMessage(ctx, car, session.text(".success"), session);
}