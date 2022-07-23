import { Entry } from "../types.ts";

const getEntry = async (today: string, API_KEY: string) => {
  const res = await fetch(
    `https://api.track.toggl.com/api/v8/time_entries?start_date=${today}T00%3A00%3A00%2B09%3A00&end_date=${today}T23%3A59%3A59%2B09%3A00`,
    {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        Authorization: `Basic ${btoa(`${API_KEY}:api_token`)}`,
      },
    },
  );
  const rawData = await res.json() as Entry[];
  return rawData;
};

export { getEntry };
