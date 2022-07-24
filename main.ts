import env from "./src/util/env.ts";
import { dayjs, duration, relativeTime, timezone, utc } from "./deps.ts";
import { getEntry } from "./src/api.ts";
import { Entry } from "./types.ts";
import { convertToMarkdown } from "./src/convert/md.ts";
import { getTweets } from "./src/getTweet.ts";

/** dayjs timezone settings */
/** usage: dayjs(entry.start).tz().format() */
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.tz.setDefault("Asia/Tokyo");
const yesterday = dayjs().tz().subtract(1, "day").format(
  "YYYY-MM-DD",
) as string;
/** load environment value */
// const WORKSPACE_ID = env("WORKSPACE_ID");
const API_KEY = env("API_KEY");

const rawEntries = await getEntry(yesterday, API_KEY);
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

// Convert raw data to JSON file
const tweets = await getTweets();
try {
  await Deno.writeTextFile(
    `./data/json/${yesterday}.json`,
    JSON.stringify(entries),
  );
  await Deno.writeTextFile(
    `./data/tw/${yesterday}.json`,
    JSON.stringify(tweets),
  );
} catch (e) {
  console.error(e);
}

// convertToMarkdown: entries -> Markdown string

const mdData = convertToMarkdown(entries, tweets);
try {
  await Deno.writeTextFile(`./data/md/${yesterday}.md`, mdData);
} catch (e) {
  console.error(e);
}
