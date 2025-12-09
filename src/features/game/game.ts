import { Context, Session } from "koishi";
import { getGameByChannel } from "../../data/game";
import { getChannelDefaultGame } from "../../data/channel";

/**
 * 
 */
//
export function registerGame(ctx: Context) {
    ctx.command("game")
        .action((c) => process(ctx, c.session))
}
async function process(ctx: Context, session: Session) {
    const games = await getGameByChannel(ctx, session.channelId, session.platform);
    const defaultGame = await getChannelDefaultGame(ctx, session.channelId, session.platform);

    return session.text(".game", {
        games,
        defaultGame
    })
}