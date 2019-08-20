const sample = require("lodash.sample");

// Top-level variables belong to the lambda execution context, which will stay around for a while
// across lambda executions. We use it as a cache for Slack API requests.
// See https://docs.aws.amazon.com/lambda/latest/dg/running-lambda-code.html
const cache = {};

/**
 * @param {import("@slack/web-api").WebClient} web
 */
async function slackUsers(web) {
  if (cache.users) {
    return cache.users;
  }
  const users = (await web.users.list({})).members.filter(
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

exports.randomUser = async function(web) {
  const users = await slackUsers(web);
  return sample(users);
};
