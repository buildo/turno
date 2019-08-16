const { Client } = require("pg");

exports.sendToMetro = async function(event) {
  const client = new Client();
  await client.connect();
  const query = {
    text: "INSERT INTO turno_chores(raw) VALUES($1)",
    values: [JSON.stringify(event)]
  };
  await client.query(query);
  await client.end();
};
