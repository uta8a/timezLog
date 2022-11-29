import { Entry } from "../../types.ts";
import {
  dayjs,
  duration,
  escapeHtml,
  Handlebars,
  Marked,
  relativeTime,
  timezone,
  utc,
} from "../../deps.ts";
import { expandGlob } from "https://deno.land/std@0.110.0/fs/expand_glob.ts";
import { basename } from "https://deno.land/std@0.110.0/path/win32.ts";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.tz.setDefault("Asia/Tokyo");

async function isExists(filepath: string): Promise<boolean> {
  try {
    const file = await Deno.stat(filepath);
    return file.isFile || file.isDirectory;
  } catch (_e) {
    return false;
  }
}
type SortByDate = {
  date: string;
};
const sortBy = (a: SortByDate, b: SortByDate) => {
  const as = a.date.split(":");
  const bs = b.date.split(":");
  const at = Number(as[0]) * 60 + Number(as[1]);
  const bt = Number(bs[0]) * 60 + Number(bs[1]);
  // return at < bt
  if (at < bt) return -1;
  if (at > bt) return 1;
  return 0;
};

const handle = new Handlebars({
  baseDir: "assets/html",
  layoutsDir: "layouts/",
  extname: ".hbs",
  partialsDir: "partials/",
  cachePartials: true,
  defaultLayout: "main",
  helpers: undefined,
  compilerOptions: undefined,
});

const convertToHtml = async (entries: Entry[]) => {
  const yesterday = dayjs().tz().subtract(1, "day").format(
    "YYYY-MM-DD",
  ) as string;
  // 今日の分のHTMLを出力
  const isFile = await isExists(`./data/comment/${yesterday}.md`);
  let comment = "";
  if (isFile) {
    const decoder = new TextDecoder("utf-8");
    const markdown = decoder.decode(
      await Deno.readFile(`./data/comment/${yesterday}.md`),
    );
    const markup = Marked.parse(markdown);
    comment = markup.content;
  }
  type Toggl = {
    start: string;
    end: string;
    description: string;
    duration: string;
  };
  const toggl: Toggl[] = [];
  for (const entry of entries) {
    const startTime = dayjs(entry.start).tz().format("HH:mm") as string;
    const endTime = dayjs(entry.stop).tz().format("HH:mm") as string;
    toggl.push({
      start: startTime,
      end: endTime,
      description: entry.description,
      duration: entry.display_duration!,
    });
  }
  type Times = {
    date: string;
    body: string;
  };
  const isDir = await isExists(`./data/issue/${yesterday}`);
  const times: Times[] = [];
  if (isDir) {
    // listing file in dir
    const decoder = new TextDecoder("utf-8");
    for await (const file of expandGlob(`./data/issue/${yesterday}/*.md`)) {
      const markdown = decoder.decode(
        await Deno.readFile(file.path),
      );
      const markup = Marked.parse(markdown);
      times.push({
        date: dayjs(markup.meta.created_at).tz().format("HH:mm") as string,
        body: markup.content,
      });
    }
  }

  // sort times, tweets
  times.sort(sortBy);

  // const indexData = await handle.renderView("index", { list: "" });
  const dailyData = await handle.renderView("daily", {
    day: yesterday,
    isComment: comment !== "",
    comment: comment,
    isToggl: toggl.length !== 0,
    toggl: toggl,
    isTimes: times.length !== 0,
    times: times,
  });
  return dailyData;
};

const genIndexHtml = async () => {
  const isDir = await isExists(`./data/pub_html/daily`);
  const links: string[] = [];
  if (isDir) {
    // listing file in dir
    for await (const file of expandGlob(`./data/pub_html/daily/*.html`)) {
      const pathname = basename(file.path);
      links.push(pathname);
    }
  }
  links.sort().reverse();
  const indexData = await handle.renderView("index", { link: links });
  return indexData;
};

export { convertToHtml, genIndexHtml };
