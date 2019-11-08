export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

interface Chore {
  id: string;
  title: string;
  description?: string;
  weekdays?: Array<Weekday>;
}

export const weekChores: Array<Chore> = [
  {
    id: "recuperare_stoviglie_in_giro",
    title: ":tumbler_glass: Recuperare bicchieri e tazzine in giro",
    description:
      "Vanno recuperati da tavoli e scrivanie e 'ribilanciati' (tazzine in area relax, maggior parte dei bicchieri in loft 2)"
  },
  {
    id: "sistemare_area_relax",
    title: ":coffee: Sistemare area relax",
    description:
      "Pulire il bancone da briciole e macchie, buttare confezioni finite dalla dispensa, buttare frutta marcia"
  },
  {
    id: "scongelare_pane",
    title: ":baguette_bread: Tirare fuori il pane dal congelatore",
    description:
      "Da fare entro le 11:30. <https://paper.dropbox.com/doc/procedures-Lunch--AjQNCWvWlI2o19IitXq3gNzwAg-SvxCHMPUkG2c7BkfR8QZ2#:h2=Scongelare-pane|Istruzioni qui>"
  },
  {
    id: "svuotare_cestini_loft2",
    title: ":recycle: Svuotare i cestini loft 2 e area relax",
    description:
      "Loft 2: plastica e umido sempre, indifferenziato se pieno. Area relax: umido sotto il lavello sempre. <https://paper.dropbox.com/doc/procedures-Lunch--AjQNCWvWlI2o19IitXq3gNzwAg-SvxCHMPUkG2c7BkfR8QZ2#:h2=Svuotare-cestini|Istruzioni qui>",
    weekdays: ["Tue", "Thu"]
  },
  {
    id: "svuotare_lavastoviglie_loft2",
    title: ":knife_fork_plate: Svuotare lavastoviglie loft 2",
    description: "Da fare prima di pranzo"
  },
  {
    id: "ritirare_nutribees",
    title: ":bee: Ritirare i nutribees in portineria e metterli in frigo",
    description: "Da fare prima delle 14:00, perché poi va via Victor",
    weekdays: ["Thu"]
  },
  {
    id: "pulire_area_pranzo",
    title: ":fork_and_knife: Pulire area pranzo",
    description:
      "Include pulire i tavoli, mettere in frigo il formaggio, etc..."
  },
  {
    id: "far_partire_lavastoviglie_loft2",
    title: ":knife_fork_plate: Caricare e far partire lavastoviglie loft 2",
    description: "Da fare subito dopo il pranzo"
  },
  {
    id: "far_partire_lavastoviglie_area_relax",
    title: ":knife_fork_plate: Caricare e far partire lavastoviglie area relax",
    description: "Da fare dopo la pausa pranzo"
  },
  {
    id: "svuotare_lavastoviglie_area_relax",
    title: ":knife_fork_plate: Svuotare lavastoviglie area relax",
    description: "Da fare entro sera"
  }
];

export const saltuaryChores: Array<Chore> = [
  {
    id: "sistemare_spesa",
    title: ":shopping_trolley: Sistemare la spesa"
  },
  {
    id: "ordinare_spesa",
    title: ":shopping_trolley: Ordinare la spesa"
  },
  {
    id: "sistemare_cortilia",
    title: ":apple: Sistemare Cortilia"
  },
  {
    id: "pulire_macchinetta_caffè",
    title: ":coffee:️ Pulire macchinetta caffè area relax"
  },
  {
    id: "ordinare_nutribees",
    title: ":bee:️ Ordinare Nutribees per la prossima settimana"
  },
  {
    id: "ordinare_casual_lunch",
    title: ":taco: Ordinare casual lunch",
    description:
      "Include tutti task collegati all'ordine del casual lunch (sondaggio, setup, e ordinazione)"
  },
  {
    id: "frullare_frutta",
    title: ":tropical_drink: Frullare frutta"
  },
  {
    id: "pulire_frutta",
    title: ":melon: :knife: Tagliare/Servire frutta"
  }
];
