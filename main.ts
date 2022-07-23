import env from "./src/util/env.ts";
import { dayjs, duration, relativeTime, timezone, utc } from "./deps.ts";
import { getEntry } from "./src/api.ts";
import { Entry } from "./types.ts";

/** dayjs timezone settings */
/** usage: dayjs(entry.start).tz().format() */
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.tz.setDefault("Asia/Tokyo");
const today = dayjs().tz().format("YYYY-MM-DD");

/** load environment value */
// const WORKSPACE_ID = env("WORKSPACE_ID");
const API_KEY = env("API_KEY");

const rawEntries = await getEntry(today, API_KEY);
const entries: Entry[] = [];
for (const entry of rawEntries) {
  // スクリプトが動いている時に実行中のEntryは、現在時刻を終わりとみなす
  if (entry.stop === undefined) {
    const now = dayjs().tz().format("YYYY-MM-DDTHH:mm:ss+09:00");
    entry.stop = now;
    entry.duration = dayjs(now).unix() - dayjs(entry.start).unix();
  }
  // TimeZoneをAsia/Tokyoに変更
  entry.start = dayjs(entry.start).tz().format("YYYY-MM-DDTHH:mm:ss+09:00");
  entry.stop = dayjs(entry.stop).tz().format("YYYY-MM-DDTHH:mm:ss+09:00");
  const display_duration = dayjs.duration({ seconds: entry.duration })
    .humanize();
  entries.push({
    start: entry.start,
    stop: entry.stop,
    duration: entry.duration,
    description: entry.description,
    display_duration: display_duration,
  });
}

console.log(entries);
