const axios = require("axios").default;
const { dailyMessage } = require("./handleDailyChores");

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
            text: `~${block.text.text}~ (grazie @${body.user.username} :pray:)`
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

  return { statusCode: 200 };
};

async function handleShuffle(web, body) {
  const newTextBlock = {
    ...body.message.blocks[0],
    text: {
      ...body.message.blocks[0].text,
      text: await dailyMessage(web)
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

  return { statusCode: 200 };
}
