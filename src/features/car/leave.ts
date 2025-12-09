import { Context, Session } from "koishi";
import { parse } from "../../utils/signedParameterParser";
import { getChannelDefaultGame } from "../../data/channel";
import { addCar, getCarLeader, getCarPlayerCount, getCarPlayers, getCarsByChannel, getCarsByGame, getPlayerCar, joinCar, leaveCar, removeCar } from "../../data/car";
import { getGameById, getGameByName } from "../../data/game";
import { JOIN_CAR } from "../../context/locks";
import { carMessage } from "../../utils/message";

/**
 * 等车
 * /car.wait :游戏名 描述 +人数 #标签
 */
//
export function registerWaitCar(ctx: Context) {
    ctx.command("car.leave")
        .action((c, a) => process(ctx, c.session, a))
}
async function process(ctx: Context, session: Session, parserArg: string) {
    const car = await getPlayerCar(ctx, session.userId);
    if (!car)
        return session.text(".not-in-car");
    const leader = await getCarLeader(ctx, car.id);
    if (session.userId == leader) {
        const msg = carMessage(ctx, car, session.text(".removed"), session);
        await removeCar(ctx, car.id);
        return msg;
    }
    await leaveCar(ctx, session.userId, car.id);
    return carMessage(ctx, car, session.text(".susscess"), session);
}