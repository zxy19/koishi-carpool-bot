import { Context, Session } from "koishi";
import { getPlayerCar, setCarDest, getCarLeader } from "../../data/car";
import { at, carMessage } from "../../utils/message";

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
        return at(session,".not-in-car");

    const leader = await getCarLeader(ctx, car.id);
    if (session.userId != leader) {
        return at(session,".not-leader");
    }

    await setCarDest(ctx, car.id, desc);
    return await carMessage(ctx, car.id, session.text(".desc-updated"), session);
}