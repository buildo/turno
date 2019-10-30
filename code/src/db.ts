import { Client, types } from "pg";
import { EventBody } from "./model";

types.setTypeParser(types.builtins.INT8, val => parseInt(val));

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

export type ChoreScore = { user: string; count: number };

export const getChoreScores = async (): Promise<ChoreScore[]> => {
  const client = new Client();
  await client.connect();
  const query = {
    text: `
    SELECT "metro"."turno_chores_view"."user" AS "user", count(*) AS "count"
    FROM "metro"."turno_chores_view"
    GROUP BY "metro"."turno_chores_view"."user"
    ORDER BY "count" DESC, "metro"."turno_chores_view"."user" ASC
    `
  };
  const res = await client.query(query);
  await client.end();
  return res.rows;
};
