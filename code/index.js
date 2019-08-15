const { WebClient } = require("@slack/web-api");
const { handleUrlVerification } = require("./src/handleUrlVerification");
const { handleDailyChores } = require("./src/handleDailyChores");
const { handleEventCallback } = require("./src/handleEventCallback");
const { handleBlockAction } = require("./src/handleBlockAction");
const querystring = require("querystring");

const token = process.env.SLACK_API_KEY;
const web = new WebClient(token);

function decodePayload(body) {
  try {
    return JSON.parse(body);
  } catch (e) {
    return JSON.parse(querystring.decode(body).payload);
  }
}

exports.handler = async event => {
  console.log(event);

  const body = decodePayload(event.body);

  if (!body.type) {
    console.log("Unhandled request", event);
    return unhandledMessage;
  }

  console.log(body);

  switch (body.type) {
    case "url_verification":
      return handleUrlVerification(body);
    case "daily_chores":
      return handleDailyChores(web);
    case "event_callback":
      return handleEventCallback(web, body);
    case "block_actions":
      return handleBlockAction(web, body);
    default:
      console.log("Unhandled request", event);
      return unhandledMessage;
  }
};

const unhandledMessage = { statusCode: 400, body: "Unknown request" };
