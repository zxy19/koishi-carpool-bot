import { Context, Session } from "koishi";
import { getPlayerCar, setCarDest, getCarLeader } from "../../data/car";
import { carMessage } from "../../utils/message";

/**
 * 修改车队描述
 * /car.desc 新描述
 */
export function registerDescCar(ctx: Context) {
    ctx.command("car.desc <desc:text>")
        .action(({ session }, desc) => process(ctx, session, desc))
}

async function process(ctx: Context, session: Session, desc: string) {
    const car = await getPlayerCar(ctx, session.userId);
    if (!car)
        return session.text(".not-in-car");

    const leader = await getCarLeader(ctx, car.id);
    if (session.userId != leader) {
        return session.text(".not-leader");
    }

    await setCarDest(ctx, car.id, desc);
    return await carMessage(ctx, car, session.text(".desc-updated"), session);
}