const { randomUser } = require("./users");
const { chores } = require("./chores");

async function dailyMessage(owner) {
  return `Ciao <@${owner.id}>! Oggi è il tuo turno, ecco le cose da fare:`;
}

exports.dailyMessage = dailyMessage;

exports.handleDailyChores = async function(web) {
  const owner = await randomUser(web);
  const message = await dailyMessage(owner);

  const todayWeekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short"
  }).format(new Date());
  const todayChores = chores.filter(
    chore => !chore.weekdays || chore.weekdays.includes(todayWeekday)
  );

  await web.chat.postMessage({
    channel: "abibo-test",
    link_names: true,
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
          text: `*${chore.title}*\n_${chore.description}_`
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
            "Se l'owner non può, clicca qui per scegliere un altro owner a caso"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: ":game_die:  Scegli nuovo owner",
            emoji: true
          },
          value: "shuffle"
        }
      }
    ]
  });

  return { statusCode: 200 };
};
