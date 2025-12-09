import { Context } from "koishi"

interface ChannelBased {
    channel: string,
    platform: string
}
export interface Car extends ChannelBased {
    id: number,
    game: number,
    desc: string,
    locked: boolean,
    lock_at?: Date,
    updated_at: Date,
    tags: string[],
}
export interface CarMember {
    id: number,
    car: number,
    user: string,
    count: number
}
export interface Game extends ChannelBased {
    id: number,
    name: string,
    player: number,
}
export interface ChannelSetting extends ChannelBased {
    id: number,
    default_game?: number
    wait_time: number
}
export type FeatureRegister = (ctx: Context) => Promise<void> | void