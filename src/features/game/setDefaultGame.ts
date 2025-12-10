import { Context, Session } from "koishi";
import { addGame, getGameByName } from "../../data/game";
import { getChannelDefaultGame, setChannelDefaultGame } from "../../data/channel";
import { at } from "../../utils/message";

/**
 * 
 */
//
export function registerSetDefaultGame(ctx: Context) {
    ctx.command("game.default <name>", { authority: 2 })
        .action((c, a) => process(ctx, c.session, a))
}
async function process(ctx: Context, session: Session, _name: string) {
    const name = _name.trim();
    const game = await getGameByName(ctx, session.channelId, session.platform, name);
    if (!game) {
        return at(session,".not-found", { game: name })
    }
    await setChannelDefaultGame(ctx, session.channelId, session.platform, game.id);
    return at(session,".success", { game: game.name })
}