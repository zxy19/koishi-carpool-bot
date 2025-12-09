import { Context } from "koishi";
import { Game } from "../type/carpool";

export async function getGameById(ctx: Context, channel: string, platform: string, gameId: number):Promise<Game|null> {
    return await ctx.model.get('carpool_game', { id: gameId, channel, platform })[0] || null;
}
export async function getGameByName(ctx: Context, channel: string, platform: string, name: string):Promise<Game|null> {
    return await ctx.model.get('carpool_game', { name, channel, platform })[0] || null;
}
export async function addGame(ctx: Context, channel: string, platform: string, name: string, player: number) {
    return await ctx.model.create('carpool_game', { channel, platform, name, player });
}
export async function removeGameByName(ctx: Context, channel: string, platform: string, name: string) {
    return (await ctx.model.remove('carpool_game', { name, channel, platform })).removed;
}