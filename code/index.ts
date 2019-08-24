import { WebClient } from "@slack/web-api";
import { handleUrlVerification } from "./src/handleUrlVerification";
import { handleDailyChores } from "./src/handleDailyChores";
import { handleBlockAction } from "./src/handleBlockAction";
import * as querystring from "querystring";

const token = process.env.SLACK_API_KEY;
const web = new WebClient(token);

function decodePayload(body: string) {
  try {
    return JSON.parse(body);
  } catch (e) {
    return JSON.parse(querystring.decode(body).payload as string);
  }
}

exports.handler = async (event: any) => {
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
      return handleDailyChores(web, body.channel);
    case "block_actions":
      return handleBlockAction(web, body);
    default:
      console.log("Unhandled request", event);
      return unhandledMessage;
  }
};

const unhandledMessage = { statusCode: 400, body: "Unknown request" };
