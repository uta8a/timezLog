type Entry = {
  start: string;
  stop?: string;
  duration: number;
  display_duration?: string; // 表示用にアバウトな数字に丸めている
  description: string;
};

export type { Entry };
