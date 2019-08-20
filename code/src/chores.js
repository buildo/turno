/**
 * @typedef {'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun'} Weekday
 *
 * @typedef {object} Chore
 * @prop {string} id
 * @prop {string} title
 * @prop {string} [description]
 * @prop {Array<Weekday>} [weekdays]
 */

/**
 * @type Array<Chore>
 */
exports.chores = [
  {
    id: "lavastoviglie_loft_2",
    title: "Far partire lavastoviglie Loft 2",
    description:
      "Far riferimento al runbook appeso sul portellone della lavastoviglie"
  },
  {
    id: "nutribees",
    title: "Ritirare i Nutribees",
    description: "Vanno ritirati da Victor e messi in frigo in Loft 2"
  }
];
