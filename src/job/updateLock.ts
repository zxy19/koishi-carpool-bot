import { Context } from "koishi";
import { operateCarWrapErr } from "../context/locks";
import { sendCarMessageI18N } from "../utils/message";

export function registerUpdateLockJob(ctx: Context) {
    ctx.setInterval(() => updateLock(ctx), 10000);
}
async function updateLock(ctx: Context) {
    operateCarWrapErr(async () => {
        const data = await ctx.model.get("carpool_car", { locked: false });
        const lockIds: number[] = [];
        const now = new Date().getTime();
        for (const car of data) {
            if (!car.lock_at)
                continue;
            if (car.lock_at.getTime() < now) {
                lockIds.push(car.id);
                sendCarMessageI18N(ctx, car, "carpool.car-locked", {});
            }
        }
        await ctx.model.set("carpool_car", lockIds, { locked: true });
    });
}