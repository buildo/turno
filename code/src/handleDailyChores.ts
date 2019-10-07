import { randomUser } from "./users";
import { weekChores, Weekday, saltuaryChores } from "./chores";
import { WebClient } from "@slack/web-api";
import { User } from "./model";

const turnoBotUserId = "ULQ0WAXFT";
export const dailyMessage = async (owner: User) =>
  `Ciao <@${owner.id}>! Oggi è il tuo turno, qui sotto trovi le cose da fare.\n\nChiunque può aiutare e <@${turnoBotUserId}> se ne ricorderà!`;

export const handleDailyChores = async (web: WebClient, channel?: string) => {
  const owner = await randomUser(web);
  const message = await dailyMessage(owner);

  const todayWeekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short"
  }).format(new Date()) as Weekday;

  const todayChores = weekChores.filter(
    chore => !chore.weekdays || chore.weekdays.includes(todayWeekday)
  );

  await web.chat.postMessage({
    channel: channel || "food",
    link_names: true,
    text: message,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: message
        }
      },
      ...todayChores.map(chore => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${chore.title}*\n${chore.description}`
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: ":ballot_box_with_check:  Segna come fatto"
          },
          value: chore.id
        }
      })),
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            ":hand: Hai fatto un'attività non settimanale? Aggiungila scegliendola dalla lista e poi segnala come fatta"
        },
        block_id: "saltuary_chores",
        accessory: {
          type: "static_select",
          options: saltuaryChores.map(chore => ({
            text: {
              type: "plain_text",
              text: chore.title
            },
            value: chore.id
          }))
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "Se l'incaricato/a non può, clicca qui per scegliere un'altra persona a caso"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: ":game_die:  Scegli nuovo incaricato/a",
            emoji: true
          },
          value: "shuffle"
        }
      }
    ]
  });

  return { statusCode: 200 };
};
