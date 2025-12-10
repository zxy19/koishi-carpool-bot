import { Context, Element, Session, User } from "koishi";
import { Car } from "../type/carpool";
import { getCarById, getCarLeader, getCarPlayerCount, getCarPlayers } from "../data/car";
import { getGameById } from "../data/game";

export async function carMessage(ctx: Context, car: Car | number, message: string | Element | Element[], session?: Session, atOnly = false, atUser:string = '') {
    const carObj: Car = typeof car === "object" ? car : await getCarById(ctx, car);
    if (!carObj)
        return session ? session.text("carpool.car-not-found") : ctx.i18n.render(['zh-CN'], ["carpool.car-not-found"], {})[0];
    const game = await getGameById(ctx, carObj.channel, carObj.platform, carObj.game);
    const parameters = {
        id: carObj.id,
        message,
        desc: carObj.desc,
        member: await getCarPlayers(ctx, carObj.id),
        tags: carObj.tags,
        game: game?.name || "?",
        player: await getCarPlayerCount(ctx, carObj.id),
        maxPlayer: game?.player,
        atUser
    };
    const msgKey = atOnly ? "carpool.car-message-at" : "carpool.car-message";
    if (session)
        return session.text(msgKey, parameters);
    const leaderUid = await getCarLeader(ctx, carObj.id);
    const user = (await ctx.database.getUser(carObj.platform, leaderUid));
    const locale = (user && user.locales[0]) || "zh-CN";
    return ctx.i18n.render([locale], [msgKey], parameters)
}

export async function sendCarMessageI18N(ctx: Context, car: Car | number, messageKey: string, param: any) {
    const carObj: Car = typeof car === "object" ? car : await getCarById(ctx, car);
    if (!carObj) return false;
    const channelCheks = (await Promise.all(ctx.bots.filter(t => t.platform == carObj.platform).map(t => ({
        ch: t.getChannel(carObj.channel),
        bot: t
    }))));
    const bot = channelCheks.find(t => t.ch)?.bot;
    if (!bot) {
        return false;
    }
    const leaderUid = await getCarLeader(ctx, carObj.id);
    const user = (await ctx.database.getUser(carObj.platform, leaderUid));
    const messageTxt = ctx.i18n.render(user.locales, [messageKey], param);
    const msg = await carMessage(ctx, carObj, messageTxt);
    bot.sendMessage(carObj.channel, msg);
}
export function at(session: Session, msgKey: string, param: any = undefined) {
    return session.text("carpool.at", { key: msgKey, msg: session.text(msgKey, param) });
}