import { Context, Session } from "koishi";
import { getPlayerCar } from "../../data/car";
import { at, carMessage } from "../../utils/message";

/**
 * 查看当前车队信息
 * /car
 */
export function registerCarInfo(ctx: Context) {
    ctx.command("car [msg:text]")
        .action(({ session }, msg) => process(ctx, session, msg))
}

async function process(ctx: Context, session: Session, msg: string) {
    if (msg && msg.trim()) {
        const res = await session.execute(`car.${msg}`);
        if (res && res.length) {
            return res;
        }
    }
    const car = await getPlayerCar(ctx, session.userId);
    if (!car)
        return at(session, ".not-in-car");

    return await carMessage(ctx, car, msg || session.text(".car-info"), session);
}