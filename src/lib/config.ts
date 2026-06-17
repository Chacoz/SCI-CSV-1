// Configuration du bien — modifie ces valeurs pour personnaliser la vitrine.
// (Tout est centralisé ici : un seul endroit à éditer.)

export type Highlight = { icon: string; title: string; text: string };

export type SiteConfig = {
  name: string;
  shortName: string;
  address: string;
  city: string;
  postalCode: string;
  tagline: string;
  intro: string;
  contactEmail: string;
  contactPhone: string;
  highlights: Highlight[];
};

export const siteConfig: SiteConfig = {
  // Identité du bien
  name: "La Colocation Armand-Carrel",
  shortName: "Armand-Carrel",
  address: "Rue Armand-Carrel",
  city: "Lille",
  postalCode: "59000",

  // Accroche affichée en haut de la page d'accueil
  tagline: "Une colocation de 6 chambres en plein cœur de Lille",
  intro:
    "Maison entièrement aménagée, espaces communs conviviaux et chambres meublées. " +
    "Idéale pour étudiants et jeunes actifs qui veulent vivre à Lille sans la solitude d'un studio.",

  // Contact pour les personnes intéressées
  contactEmail: "contact@charlescozette.com",
  contactPhone: "",

  // Points forts mis en avant sur la vitrine
  highlights: [
    { icon: "🛏️", title: "6 chambres meublées", text: "Lit, bureau, rangements — prêtes à vivre." },
    { icon: "🍳", title: "Cuisine équipée", text: "Grande cuisine partagée, salon convivial." },
    { icon: "🚆", title: "Hyper centre", text: "À quelques minutes des transports et des facs." },
    { icon: "🌐", title: "Tout compris", text: "Internet fibre, charges et entretien inclus." },
  ],
};
