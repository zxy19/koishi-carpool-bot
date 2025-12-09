import { Car, CarMember, ChannelSetting, Game } from "./type/carpool";

declare module 'koishi' {
  interface Tables {
    carpool_car: Car,
    carpool_car_member: CarMember,
    carpool_game: Game,
    carpool_channel: ChannelSetting
  }
}
