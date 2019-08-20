const axios = require("axios").default;
const { dailyMessage } = require("./handleDailyChores");
const { sendToMetro } = require("./db");
const { randomUser } = require("./users");

exports.handleBlockAction = async function(web, body) {
  if (body.actions[0].value === "shuffle") {
    return handleShuffle(web, body);
  }

  const newMessage = {
    ...body.message,
    blocks: body.message.blocks.map(block => {
      if (block.accessory && block.accessory.value === body.actions[0].value) {
        return {
          ...block,
          text: {
            ...block.text,
            text: `~${block.text.text.split("\n")[0]}~ (grazie <@${
              body.user.id
            }> :pray:)`
          },
          accessory: undefined
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

/**
 * @param {import("@slack/web-api").WebClient} web
 * @param {unknown} body
 */
async function handleShuffle(web, body) {
  const newOwner = await randomUser(web);

  const newTextBlock = {
    ...body.message.blocks[0],
    text: {
      ...body.message.blocks[0].text,
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
    text: `:wave: <@${newOwner.id}>, ora l'owner sei tu!`,
    channel: body.channel.id,
    thread_ts: body.message.ts
  });

  return { statusCode: 200 };
}
