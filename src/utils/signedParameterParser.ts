export function parse<K extends string | number | symbol>(cmd: string, keys: K[], filterEmpty: boolean = true): { data: Record<K, string[]>, rest: string[] } {
    const data = {} as Record<K, string[]>;
    const rest = [] as string[];
    for (const key of keys) {
        data[key] = [];
    }
    const a = cmd.split(" ");
    for (let s of a) {
        if (s.length == 0) {
            if (!filterEmpty)
                rest.push(s);
            continue;
        }
        const ch0 = s.charAt(0);
        if (data[ch0] !== undefined) {
            data[ch0 as K].push(s.substring(1));
        } else {
            rest.push(s);
        }
    }
    return { data, rest };
}