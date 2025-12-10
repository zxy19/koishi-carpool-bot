import { Context, Session } from "koishi";
import { parse } from "../../utils/signedParameterParser";
import { getChannelDefaultGame, setChannelWaitTime } from "../../data/channel";
import { addCar, getCarById, getCarPlayerCount, getCarPlayers, getCarsByChannel, getCarsByGame, getPlayerCar, joinCar } from "../../data/car";
import { getGameById, getGameByName } from "../../data/game";
import { operateCarWrapErr } from "../../context/locks";
import { at, carMessage } from "../../utils/message";

/**
 * 设置等待时间
 * carpool.wait-time
 */
//
export function registerChannelSetWaitTime(ctx: Context) {
    ctx.command("carpool.wait-time <time:number>", { authority: 3 })
        .action((c, a) => process(ctx, c.session, a))
}
async function process(ctx: Context, session: Session, time: number) {
    await setChannelWaitTime(ctx, session.channelId, session.platform, time);
    return at(session, ".success", { time: time });
}