import env from "./src/util/env.ts";

const WORKSPACE_ID = env("WORKSPACE_ID");
const API_KEY = env("API_KEY");
const res = await fetch(
  `https://api.track.toggl.com/api/v8/workspaces/${WORKSPACE_ID}/projects`,
  {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      Authorization: `Basic ${btoa(`${API_KEY}:api_token`)}`,
    },
  },
);
const rawData = await res.json();
console.log(rawData);
