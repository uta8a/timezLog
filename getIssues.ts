const args = Deno.args

if (args.length !== 3) {
  console.error('Invalid arg length, usage: deno run "$BODY" "$CREATED_AT" "$TITLE"')
  Deno.exit(1)
}

const body = args[0]
const created_at = args[1]
const title = args[2]

const md = `---\ncreated_at: ${created_at}\n---\n\n${body}`

// ref. https://medium.com/deno-the-complete-reference/deno-nuggets-generate-a-random-string-80e320d2bc2c
function getRandomString(s: number) {
  if (s % 2 == 1) {
    throw new Deno.errors.InvalidData("Only even sizes are supported");
  }
  const buf = new Uint8Array(s / 2);
  crypto.getRandomValues(buf);
  let ret = "";
  for (let i = 0; i < buf.length; ++i) {
    ret += ("0" + buf[i].toString(16)).slice(-2);
  }
  return ret;
}

const filename = getRandomString(10)

try {
  await Deno.mkdir(`./data/issue/${title}`)
  await Deno.writeTextFile(`./data/issue/${title}/${filename}.md`, md);
} catch (e) {
  console.error(e);
}
