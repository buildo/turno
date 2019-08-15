const message = `
Hi @gabro! Today is your turn :-). Here's a list of stuff:

 - svuotare lavastoviglie
 - ruotare sacchi

If you're busy, simply reply HALP in the thread -->
`;

exports.handleDailyChores = async function(web) {
  await web.chat.postMessage({
    text: message,
    channel: "abibo-test",
    link_names: true,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Far partire lavastoviglie"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Mark as done"
          },
          value: "lavastoviglie_done",
          action_id: "lavastoviglie_done"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Scongelare pane"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Mark as done"
          },
          value: "pane_done",
          action_id: "pane_done"
        }
      }
    ]
  });

  return { statusCode: 200 };
};
