import { Context, Session } from "koishi";
import { addGame, getGameByName, removeGameByName } from "../../data/game";
import { at } from "../../utils/message";
import { getCarsByGame, removeCar } from "../../data/car";
import { getChannelDefaultGame, setChannelDefaultGame } from "../../data/channel";

/**
 * 
 */
//
export function registerRemoveGame(ctx: Context) {
    ctx.command("game.remove <name>", { authority: 2 })
        .option("force", "-f")
        .action((c, a) =>process(ctx, c.session, a, c.options.force||false))
}
async function process(ctx: Context, session: Session, _name: string, f: boolean) {
    const name = _name.trim();
    const game = await getGameByName(ctx, session.channelId, session.platform, name);
    const cars = await getCarsByGame(ctx, game.id, session.channelId, session.platform);
    if (cars.length > 0 && !f)
        return at(session, ".has-cars", { game: name, cars: cars.length })
    if (!game)
        return at(session, ".not-found", { game: name })
    const gameDef = await getChannelDefaultGame(ctx, session.channelId, session.platform);
    if (gameDef == game.id)
        await setChannelDefaultGame(ctx, session.channelId, session.platform, null);
    await removeGameByName(ctx, session.channelId, session.platform, name);
    for (const car of cars) {
        await removeCar(ctx, car.id);
    }
    return at(session, ".success", { game: name, cars: cars.length })
}