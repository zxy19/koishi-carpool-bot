import { Context, Session } from "koishi";
import { getPlayerCar } from "../../data/car";
import { carMessage } from "../../utils/message";

/**
 * 查看当前车队信息
 * /car
 */
export function registerCarInfo(ctx: Context) {
    ctx.command("car [msg:text]")
        .action(({ session }, msg) => process(ctx, session, msg))
}

async function process(ctx: Context, session: Session, msg: string) {
    const car = await getPlayerCar(ctx, session.userId);
    if (!car)
        return session.text(".not-in-car");

    return await carMessage(ctx, car, msg || session.text(".car-info"), session);
}