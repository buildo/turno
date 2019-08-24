import sample = require("lodash.sample");
import { WebClient } from "@slack/web-api";
import { User } from "./model";

// Top-level variables belong to the lambda execution context, which will stay around for a while
// across lambda executions. We use it as a cache for Slack API requests.
// See https://docs.aws.amazon.com/lambda/latest/dg/running-lambda-code.html
interface Cache {
  users?: Array<User>;
}
const cache: Cache = {};

async function slackUsers(web: WebClient): Promise<Array<User>> {
  if (cache.users) {
    return cache.users;
  }
  const users = ((await web.users.list({})).members as Array<User>).filter(
    u =>
      !u.is_restricted &&
      !u.is_bot &&
      !u.is_stranger &&
      !u.deleted &&
      u.name !== "slackbot"
  );
  cache.users = users;
  return users;
}

export const randomUser = async (web: WebClient): Promise<User> => {
  const users = await slackUsers(web);
  return sample(users)!;
};
