import axios from "axios";
import { dailyMessage } from "./handleDailyChores";
import { sendToMetro } from "./db";
import { randomUser } from "./users";
import { WebClient, SectionBlock } from "@slack/web-api";
import { EventBody } from "./model";

const helpSuffix = "__HELP";

export const handleBlockAction = async (web: WebClient, body: EventBody) => {
  if (body.actions[0].value === "shuffle") {
    return handleShuffle(web, body);
  }

  const newMessage = {
    ...body.message,
    blocks: body.message.blocks.map(block => {
      if (
        block.type === "section" &&
        block.accessory &&
        "value" in block.accessory &&
        block.accessory.value === body.actions[0].value
      ) {
        return {
          ...block,
          text: {
            ...block.text,
            text: thankUser(block.text!.text, `<@${body.user.id}>`)
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: ":handshake: Segna di aver aiutato"
            },
            value: block.accessory.value!.replace(helpSuffix, "") + helpSuffix
          }
        };
      }
      return block;
    })
  };

  await axios.post(body.response_url, {
    replace_original: true,
    ...newMessage
  });

  await sendToMetro(body);

  return { statusCode: 200 };
};

function thankUser(text: string, user: string): string {
  if (text.includes("~")) {
    const regex = /(~.+~\s*\(grazie )(.*)( :pray:.*\))/;
    const users = text.match(regex)![2].split(" ");
    console.log(users);
    const newUsers = [...users, user].join(" ");
    console.log(newUsers);
    return text.replace(regex, `$1${newUsers}$3`);
  } else {
    return `~${text.split("\n")[0]}~ (grazie ${user} :pray:)`;
  }
}

async function handleShuffle(web: WebClient, body: EventBody) {
  const newOwner = await randomUser(web);

  const oldBlock = body.message.blocks[0] as SectionBlock;

  const newTextBlock = {
    ...oldBlock,
    text: {
      ...oldBlock.text,
      text: await dailyMessage(newOwner)
    }
  };
  const newMessage = {
    ...body.message,
    blocks: [newTextBlock, ...body.message.blocks.slice(1)]
  };

  await axios.post(body.response_url, {
    replace_original: true,
    ...newMessage
  });

  await web.chat.postMessage({
    text: `:wave: <@${newOwner.id}>, ora l'incaricato/a sei tu!`,
    channel: body.channel.id,
    thread_ts: body.message.ts
  });

  return { statusCode: 200 };
}
