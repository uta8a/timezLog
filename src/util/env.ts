export default function (envName: string) {
  const envValue = Deno.env.get(envName);

  if (!envValue) {
    throw new Error(`No environment value: ${envName}`);
  }

  return envValue;
}
