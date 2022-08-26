import { Tweet } from "../types.ts";
import { dayjs, duration, relativeTime, timezone, utc } from "../deps.ts";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.tz.setDefault("Asia/Tokyo");

const getTweets = async (): Promise<Tweet[]> => {
  const today = dayjs().tz().format("YYYY-MM-DD") as string;
  const yesterday = dayjs().tz().subtract(1, "day").format(
    "YYYY-MM-DD",
  ) as string;
  const res = await fetch("https://api.twitter.com/1.1/guest/activate.json", {
    method: "POST",
    headers: {
      "authorization":
        "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
      "user-agent": "Mozilla/5.0",
    },
  });

  const jsonData = await res.json();

  const headers = {
    "authorization":
      "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
    "user-agent": "Mozilla/5.0",
    "x-guest-token": jsonData.guest_token,
  };
  const query = await fetch(
    `https://api.twitter.com/1.1/search/tweets.json?q=${
      encodeURI(`from:kaito_tateyama since:${yesterday}_00:00:00_JST`)
    }&until=${today}&count=100&result_type=recent`,
    {
      method: "GET",
      headers: headers,
    },
  );

  const queryData = await query.json();

  const rawTweets = queryData.statuses;

  const tweets: Tweet[] = [];
  if (rawTweets === undefined) {
    console.error("Error: rawTweets is undefined.");
    return tweets;
  }
  for (const tweet of rawTweets) {
    tweets.push({
      date: tweet.created_at,
      tweet_id: tweet.id_str,
      text: tweet.text,
    });
  }
  return tweets;
};
export { getTweets };
