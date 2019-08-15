const { WebClient } = require("@slack/web-api");
const { handleUrlVerification } = require("./src/handleUrlVerification");
const { handleDailyChores } = require("./src/handleDailyChores");
const { handleEventCallback } = require("./src/handleEventCallback");

const token = process.env.SLACK_API_KEY;
const web = new WebClient(token);

exports.handler = async event => {
  console.log(event);

  const body = JSON.parse(event.body);
  if (!body.type) {
    return unhandledMessage;
  }

  switch (body.type) {
    case "url_verification":
      return handleUrlVerification(body);
    case "daily_chores":
      return handleDailyChores(web);
    case "event_callback":
      return handleEventCallback(web, body);
    default:
      console.log("Unhandled request", event);
      return unhandledMessage;
  }
};

const unhandledMessage = { statusCode: 400, body: "Unknown request" };
