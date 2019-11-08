import { WebClient } from "@slack/web-api";
import { EventCallback } from "./model";
import { handleAppHome } from "./handleAppHome";

export const handleEventCallback = async (
  web: WebClient,
  body: EventCallback
) => {
  switch (body.type) {
    case "app_home_opened":
      return handleAppHome(web, body);
    default:
      console.log(`Unknown event type ${body.type}`);
      return { statusCode: 200 };
  }
};
