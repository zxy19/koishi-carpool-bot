import { Context, Session } from "koishi";
import { addGame } from "../../data/game";

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
    await addGame(ctx, session.channelId, session.platform, name, player);
    return session.text(".success", { player, game: name })
}