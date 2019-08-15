const sample = require("lodash.sample");

async function dailyMessage(web) {
  const users = (await web.users.list({})).members.filter(
    u => !u.is_restricted && !u.is_bot && !u.is_stranger && !u.deleted
  );
  const owner = sample(users);

  return `Ciao @${
    owner.profile.display_name
  }! Oggi è il tuo turno, ecco le cose da fare:`;
}

exports.dailyMessage = dailyMessage;

exports.handleDailyChores = async function(web) {
  const message = await dailyMessage(web);

  const chores = ["Far partire lavastoviglie", "Scongelare pane"];

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
      ...chores.map(chore => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: chore
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: ":ballot_box_with_check:  Segna come fatto"
          },
          value: chore
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
