import { Context, Session } from "koishi";
import { addGame, removeGameByName } from "../../data/game";

/**
 * 
 */
//
export function registerRemoveGame(ctx: Context) {
    ctx.command("game.remove <name>", { authority: 2 })
        .action((c, a) => process(ctx, c.session, a))
}
async function process(ctx: Context, session: Session, _name: string) {
    const name = _name.trim();
    if ((await removeGameByName(ctx, session.channelId, session.platform, name)) == 0)
        return session.text(".not-found", { game: name })
    return session.text(".success", { game: name })
}