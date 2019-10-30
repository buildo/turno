import { WebClient } from "@slack/web-api";
import { User } from "./model";
import { getChoreScores, ChoreScore } from "./db";
import * as Chance from "chance";
import zip = require("lodash.zip");

const chance = new Chance();

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
  const choreScores = await getChoreScores();
  return sampleUser(users, choreScores);
};

/**
 * Sample users weighted by the reverse of the number of chores they have done.
 * If you have done more chores, you are selected with a lower probability.
 */
function sampleUser(users: User[], choreScores: ChoreScore[]): User {
  const totalCount = choreScores.reduce((tot, score) => tot + score.count, 0);
  const weightedScores = users.map(user => {
    const score = choreScores.find(s => s.user === user.name);
    if (!score) {
      console.log(`Could not find score for ${user.name}`);
    }
    const scoreCount = (score && score.count) || 0;
    return totalCount - scoreCount;
  });

  console.log(zip(users.map(u => u.name), weightedScores).join("\n"));

  return chance.weighted(users, weightedScores);
}
