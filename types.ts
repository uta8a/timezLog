type Entry = {
  start: string;
  stop?: string;
  duration: number;
  display_duration?: string; // 表示用にアバウトな数字に丸めている
  description: string;
};

type Tweet = {
  date: string;
  tweet_id: string;
  text: string;
};

export type { Entry, Tweet };
