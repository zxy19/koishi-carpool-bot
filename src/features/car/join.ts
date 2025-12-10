import { Context, Session } from "koishi";
import { parse } from "../../utils/signedParameterParser";
import { getChannelDefaultGame } from "../../data/channel";
import { addCar, getCarById, getCarPlayerCount, getCarPlayers, getCarsByChannel, getCarsByGame, getPlayerCar, joinCar } from "../../data/car";
import { getGameById, getGameByName } from "../../data/game";
import { operateCarWrapErr } from "../../context/locks";
import { at, carMessage } from "../../utils/message";

/**
 * 上车
 * /car.join
 */
//
export function registerJoinCar(ctx: Context) {
    ctx.command("car.join <id> <player>")
        .action((c, a, p) => process(ctx, c.session, a, p))
}
async function process(ctx: Context, session: Session, carId: string, player: string) {
    let p = 1;
    if (player) {
        try {
            if (player.startsWith("+"))
                p = parseInt(player.substring(1));
            else
                p = parseInt(player);
        } catch (e) {
            return at(session,".invalid-player-num");
        }
    }
    if (await getPlayerCar(ctx, session.userId)) {
        return at(session,".already-in-car");
    }
    carId = carId.trim();
    let id = -1;
    try {
        id = parseInt(carId);
    } catch (ignore) { }
    if (carId.startsWith("#")) {
        try {
            id = parseInt(carId.substring(1));
        } catch (ignore) { }
    }
    if (id == -1)
        return at(session,".invalid-car-id");
    const car = await getCarById(ctx, id);
    if (!car || car.channel != session.channelId || car.platform != session.platform)
        return at(session,".car-not-found");
    if (car.locked)
        return at(session,".car-locked");
    const game = await getGameById(ctx, car.channel, car.platform, car.game);
    if (game.player - (await getCarPlayerCount(ctx, id)) < p)
        return at(session,".car-full");
    return await operateCarWrapErr(async () => {
        await joinCar(ctx, session.userId, id, p);
        return await carMessage(ctx, id, session.text(".join"));
    });
}