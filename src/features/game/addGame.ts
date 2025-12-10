import { Context, Session } from "koishi";
import { addGame, getGameByName } from "../../data/game";
import { at } from "../../utils/message";

/**
 * 
 */
//
export function registerAddGame(ctx: Context) {
    ctx.command("game.add <name> <player:number>", { authority: 2 })
        .action((c, a, b) => process(ctx, c.session, a, b))
}
async function process(ctx: Context, session: Session, _name: string, player: number) {
    const name = _name.trim();
    if (await getGameByName(ctx, session.channelId, session.platform, name))
        return at(session, ".exists", { game: name })
    await addGame(ctx, session.channelId, session.platform, name, player);
    return at(session,".success", { player, game: name })
}