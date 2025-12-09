import { Context } from "koishi";
import { operateCarWrapErr } from "../context/locks";
import { sendCarMessageI18N } from "../utils/message";
import { getChannelWaitTime } from "../data/channel";
import { removeCar } from "../data/car";

export function registerExpireJob(ctx: Context) {
    ctx.setInterval(() => updateExpire(ctx), 10000);
}
async function updateExpire(ctx: Context) {
    operateCarWrapErr(async () => {
        const data = await ctx.model.get("carpool_car", { locked: false });
        const removeIds: number[] = [];
        const expireSettingCache: Record<string, number> = {};
        for (const car of data) {
            if (car.lock_at)
                continue;
            let expireMin = expireSettingCache[car.platform + "|" + car.channel] || (await getChannelWaitTime(ctx, car.channel, car.platform));
            expireSettingCache[car.platform + "|" + car.channel] = expireMin;
            const expirePredicator = new Date();
            expirePredicator.setMinutes(expirePredicator.getMinutes() - expireMin);
            if (expirePredicator.getTime() > car.updated_at.getTime()) {
                removeIds.push(car.id);
                sendCarMessageI18N(ctx, car, "carpool.car-expired", {});
            }
        }
        for (const id of removeIds) {
            removeCar(ctx, id);
        }
        return null;
    });
}