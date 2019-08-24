import { Client } from "pg";
import { EventBody } from "./model";

export const sendToMetro = async (body: EventBody) => {
  const client = new Client();
  await client.connect();
  const query = {
    text: "INSERT INTO turno_chores(raw) VALUES($1)",
    values: [JSON.stringify(body)]
  };
  await client.query(query);
  await client.end();
};
