import { Context } from "koishi";
import { ChannelSetting } from "../type/carpool";

export async function getChannelObject(ctx: Context, channel: string, platform: string): Promise<ChannelSetting> {
    const t = await ctx.model.get('carpool_channel', { channel, platform })[0];
    if (!t) {
        await ctx.model.create('carpool_channel', { channel, platform, wait_time: 10, default_game: null });
        return await getChannelObject(ctx, channel, platform);
    }
    return t;
}
export async function getChannelDefaultGame(ctx: Context, channel: string, platform: string) {
    return (await getChannelObject(ctx, channel, platform)).default_game;
}
export async function getChannelWaitTime(ctx: Context, channel: string, platform: string) {
    return (await getChannelObject(ctx, channel, platform)).wait_time;
}