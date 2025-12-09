import { Context } from "koishi";
import { Car } from "../type/carpool";

export async function init(ctx: Context) {
    ctx.model.extend('carpool_car', {
        id: 'unsigned',
        game: 'unsigned',
        desc: 'text',
        channel: 'text',
        platform: 'text',
        locked: 'boolean',
        lock_at: 'timestamp',
        updated_at: 'timestamp',
        tags: 'list'
    }, {
        autoInc: true
    });
    ctx.model.extend('carpool_car_member', {
        id: 'unsigned',
        car: 'unsigned',
        user: 'string',
        count: 'unsigned'
    }, { autoInc: true });
    ctx.model.extend('carpool_game', {
        id: 'unsigned',
        name: 'text',
        player: 'unsigned',
        channel: 'text',
        platform: 'text',
    }, { autoInc: true });
    ctx.model.extend("carpool_channel", {
        id: "unsigned",
        channel: "text",
        platform: "text",
        default_game: {
            type: "unsigned",
            nullable: true,
        },
        wait_time: {
            type: "unsigned",
            initial: 10,
        },
    }, { autoInc: true })
}