import { Context } from "koishi";
import { FeatureRegister } from "./type/carpool";
import { registerCarInfo } from "./features/car/car";
import { registerDescCar } from "./features/car/desc";
import { registerWaitCar } from "./features/car/wait";
import { registerLeaveCar } from "./features/car/leave";
import { registerAddGame } from "./features/game/addGame";
import { registerRemoveGame } from "./features/game/removeGame";
import { registerSetDefaultGame } from "./features/game/setDefaultGame";
import { registerGame } from "./features/game/game";
import { registerUpdateLockJob } from "./job/updateLock";
import { registerExpireJob } from "./job/updateExpire";
const T: FeatureRegister[] = [
    registerCarInfo,
    registerDescCar,
    registerWaitCar,
    registerLeaveCar,
    registerAddGame,
    registerRemoveGame,
    registerSetDefaultGame,
    registerGame,

    registerUpdateLockJob,
    registerExpireJob
]
export function registerAll(ctx: Context) {
    return Promise.all(T.map(t => t(ctx)).filter(t => typeof t === "object" && t.then));
}