const { WebClient } = require("@slack/web-api");

const token = "xoxb-2194261799-704030371537-Dm1vmBp1kILIXd4KN48nBRcA";
const web = new WebClient(token);

exports.handleEventCallback = async function(web, body) {
  if (body.event.type !== "message" || body.event.subtype === "bot_message") {
    return { statusCode: 200 };
  }
  if (body.event.text.toLowerCase().includes("halp")) {
    console.log("sending message", body.event);
    await web.chat.postMessage({
      text: "Here to help!",
      channel: body.event.channel,
      thread_ts: body.container.message_ts
    });
    return { statusCode: 200 };
  }
};
