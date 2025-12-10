import { Context, Session } from "koishi";
import { parse } from "../../utils/signedParameterParser";
import { getChannelDefaultGame } from "../../data/channel";
import { addCar, getCarPlayerCount, getCarPlayers, getCarsByChannel, getCarsByGame, getPlayerCar, joinCar } from "../../data/car";
import { getGameById, getGameByName } from "../../data/game";
import { operateCarWrapErr } from "../../context/locks";
import { at, carMessage } from "../../utils/message";

/**
 * 等车
 * /car.wait :游戏名 描述 +人数 #标签
 */
//
export function registerWaitCar(ctx: Context) {
    ctx.command("car.wait <parser:text>")
        .action((c, a) => process(ctx, c.session, a))
}
async function process(ctx: Context, session: Session, parserArg: string) {
    if (await getPlayerCar(ctx, session.userId)) {
        return at(session,".already-in-car");
    }
    const { data, rest } = parse<":" | "+" | "#">(parserArg, [":", "+", "#"])
    const gameName = (data[':'][0] || "").trim();
    let game = gameName && (await getGameByName(ctx, session.channelId, session.platform, gameName)).id;
    if (!game) game = await getChannelDefaultGame(ctx, session.channelId, session.platform);
    if (!game) return at(session,".no-default-game");

    const playerNum = parseInt(data['+'][0] || "1");
    const tags = data['#'].map(t => t.trim()).filter(t => t.length > 0);
    const desc = rest.join(" ").trim();
    return await findAndJoinOrCreate(ctx, session, game, playerNum, tags, desc);
}
async function findAndJoinOrCreate(ctx: Context, session: Session, gameId: number, playerNum: number, tags: string[], desc: string) {
    const { car, message } = await operateCarWrapErr(async () => {
        let car = await findCanJoin(ctx, session, gameId, playerNum, tags);
        let message = session.text(".join");
        if (car) {
            await joinCar(ctx, session.userId, car.id, playerNum);
        } else {
            message = session.text(".create");
            car = await addCar(ctx, session.channelId, session.platform, gameId, tags, desc);
            await joinCar(ctx, session.userId, car.id, playerNum);
        }
        return { car, message };
    });
    return await carMessage(ctx, car, message, session);
}
async function findCanJoin(ctx: Context, session: Session, gameId: number, playerNum: number, tags: string[]) {
    const game = await getGameById(ctx, session.channelId, session.platform, gameId);
    const cars = await getCarsByGame(ctx, gameId, session.channelId, session.platform);
    for (const car of cars) {
        if (car.locked) continue;
        if (tags.length) {
            let notMatch = false;
            for (const tag of tags) {
                if (!car.tags.includes(tag)) {
                    notMatch = true;
                    break;
                }
            }
            if (notMatch) continue;

        }
        const players = await getCarPlayerCount(ctx, car.id);
        if (players + playerNum <= game.player) {
            return car;
        }
    }
    return null;
}