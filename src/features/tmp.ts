import { Context, Session } from "koishi";

/**
 * 
 */
//
export function registerTmp(ctx: Context) {
    ctx.command("car.wait <parser:text>")
        .action((c, a) => process(ctx, c.session, a))
}
async function process(ctx: Context, session: Session, parserArg: string) {

}