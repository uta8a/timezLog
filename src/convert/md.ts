import { Entry } from "../../types.ts";
import { dayjs, duration, relativeTime, timezone, utc } from "../../deps.ts";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.tz.setDefault("Asia/Tokyo");

const convertToMarkdown = (entries: Entry[]) => {
  const yesterday = dayjs().tz().subtract(1, "day").format(
    "YYYY-MM-DD",
  ) as string;
  let md = "";
  md += `# 日報 ${yesterday}\n\n`;
  for (const entry of entries) {
    const startTime = dayjs(entry.start).tz().format("HH:mm") as string;
    const endTime = dayjs(entry.stop).tz().format("HH:mm") as string;
    md +=
      `${startTime} ~ ${endTime} ${entry.description} (${entry.display_duration})\n`;
  }
  return md;
};

export { convertToMarkdown };
