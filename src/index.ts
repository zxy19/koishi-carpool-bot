import { Context } from 'koishi'
import { init } from './data/database'

export const name = 'carpool-bot'
export const inject = {
  required: ['database'],
}
export function apply(ctx: Context) {
  // 初始化数据库表
  ctx.on('ready', async () => {
    await init(ctx);
  });
  ctx.i18n.define('zh-CN', require('./locales/zh-CN'))
}