import { Context } from "koishi";
import { Car, CarMember } from "../type/carpool";

export async function getPlayerCar(ctx: Context, userId: string): Promise<Car | null> {
    const um = await ctx.model.get('carpool_car_member', { user: userId });
    if (um.length == 0)
        return null;
    return (await ctx.model.get('carpool_car', { id: um[0].car }))[0] || null;
}
export async function getCarById(ctx: Context, carId: number): Promise<Car | null> {
    return await ctx.model.get('carpool_car', { id: carId })[0] || null;
}
export async function getCarPlayers(ctx: Context, carId: number): Promise<string[]> {
    const players = await ctx.model.get('carpool_car_member', { car: carId });
    return players.map(p => p.user);
}

export async function getCarPlayerCount(ctx: Context, carId: number): Promise<number> {
    const players = await ctx.model.get('carpool_car_member', { car: carId });
    return players.map(p => p.count).reduce((a, b) => a + b, 0);
}

export async function getCarsByChannel(ctx: Context, channelId: string, platform: string): Promise<Car[]> {
    return await ctx.model.get('carpool_car', { channel: channelId, platform: platform });
}
export async function getCarsByGame(ctx: Context, game: number, channelId: string, platform: string): Promise<Car[]> {
    return await ctx.model.get('carpool_car', { channel: channelId, platform, game });
}
export async function getCarLeader(ctx: Context, carId: number): Promise<string | null> {
    const carMember = await ctx.database
        .select('carpool_car_member')
        .where({ car: carId })
        .orderBy('id', 'asc')
        .limit(1)
        .execute();
    return carMember[0]?.user || null;
}

export async function joinCar(ctx: Context, user: string, car: number, count: number): Promise<CarMember | null> {
    const res = await ctx.model.set("carpool_car", { id: car }, {
        updated_at: new Date()
    });
    if (!res.matched)
        return null;
    return await ctx.model.create("carpool_car_member", {
        car, user, count
    })
}
export async function leaveCar(ctx: Context, user: string, car: number) {
    const res = await ctx.model.set("carpool_car", { id: car }, {
        updated_at: new Date()
    });
    if (!res.matched)
        return null;
    return await ctx.model.remove("carpool_car_member", { user })
}
export async function addCar(ctx: Context, channel: string, platform: string, game: number, tags: string[], desc: string): Promise<Car | null> {
    return await ctx.model.create("carpool_car", {
        channel, platform, game, tags, desc, updated_at: new Date()
    })
}
export async function removeCar(ctx: Context, car: number) {
    await ctx.model.remove("carpool_car_member", { car });
    await ctx.model.remove("carpool_car", { id: car });
}
export async function setCarDest(ctx: Context, car: number, desc: string) {
    await ctx.model.set("carpool_car", { id: car }, { desc });
}

export async function lockCar(ctx: Context, car: number, lockAt?: Date) {
    if (lockAt) {
        await ctx.model.set("carpool_car", { id: car }, {
            lock_at: lockAt,
            locked: false
        });
    } else {
        await ctx.model.set("carpool_car", { id: car }, {
            lock_at: null,
            locked: true
        });
    }
}
export async function unlockCar(ctx: Context, car: number) {
    await ctx.model.set("carpool_car", { id: car }, {
        lock_at: null,
        locked: false
    });
}