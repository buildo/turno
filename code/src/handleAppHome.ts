import { WebClient } from "@slack/web-api";
import { EventCallback } from "./model";
import { getChoreScores } from "./db";
import sortBy = require("lodash.sortby");

export const handleAppHome = async (web: WebClient, body: EventCallback) => {
  const choreScores = sortBy(await getChoreScores(), s => -s.count);

  await web.views.publish({
    user_id: body.user,
    view: {
      type: "home" as any, // FIXME(gabro)
      title: {
        type: "plain_text",
        text: "Turno"
      },
      blocks: choreScores.map(score => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${toNumberEmojis(score.count)} *${score.user}*`
        }
      }))
    }
  });

  return { statusCode: 200 };
};

const numberEmojis: { [_: string]: string } = {
  "1": ":one:",
  "2": ":two:",
  "3": ":three:",
  "4": ":four:",
  "5": ":five:",
  "6": ":six:",
  "7": ":seven:",
  "8": ":eight:",
  "9": ":nine:",
  "0": ":zero:"
};

function toNumberEmojis(n: number): string {
  return String(n)
    .split("")
    .map(c => numberEmojis[c])
    .join("");
}
