import { Context, Element, Session, User } from "koishi";
import { Car } from "../type/carpool";
import { getCarById, getCarLeader, getCarPlayerCount, getCarPlayers } from "../data/car";
import { getGameById } from "../data/game";

export async function carMessage(ctx: Context, car: Car | number, message: string | Element, session?: Session) {
    const carObj: Car = typeof car === "object" ? car : await getCarById(ctx, car);
    if (!carObj)
        return session ? session.text("carpool.car-not-found") : ctx.i18n.render(['zh-CN'], ["carpool.car-not-found"], {})[0];
    const game = await getGameById(ctx, carObj.channel, carObj.platform, carObj.game);
    const parameters = {
        message,
        desc: carObj.desc,
        member: await getCarPlayers(ctx, carObj.id),
        tags: carObj.tags,
        game: game.name || "?",
        player: await getCarPlayerCount(ctx, carObj.id),
        maxPlayer: game.player
    };
    if (session)
        return session.text("carpool.car-message", parameters);
    const leaderUid = await getCarLeader(ctx, carObj.id);
    const user = (await ctx.database.getUser(carObj.platform, leaderUid));
    const locale = (user && user.locales[0]) || "zh-CN";
    return ctx.i18n.render([locale], ["carpool.car-message"], parameters)[0]
}

export async function sendCarMessageI18N(ctx: Context, car: Car | number, messageKey: string, param: any) {
    const carObj: Car = typeof car === "object" ? car : await getCarById(ctx, car);
    if (!carObj) return false;
    const channelCheks = (await Promise.all(ctx.bots.filter(t => t.platform == carObj.platform).map(t => ({
        ch: t.getChannel(carObj.channel),
        bot: t
    }))));
    const bot = channelCheks.find(t => t.ch)?.bot;
    if (!bot)
        return false;

    const leaderUid = await getCarLeader(ctx, carObj.id);
    const user = (await ctx.database.getUser(carObj.platform, leaderUid));
    const messageTxt = ctx.i18n.render(user.locales, [messageKey], param)[0];
    const msg = await carMessage(ctx, carObj, messageTxt);
    bot.sendMessage(carObj.channel, msg);
}