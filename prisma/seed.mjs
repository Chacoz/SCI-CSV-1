import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 6 chambres. Loyers HORS charges (HC) ; provision de charges à renseigner (0 par défaut).
// Surfaces inconnues pour l'instant (à compléter dans l'espace gestion).
const rooms = [
  { name: "Chambre 1", rent: 335, charges: 0, available: false, order: 1, description: "Chambre meublée, lit, bureau et rangements." },
  { name: "Chambre 2", rent: 335, charges: 0, available: false, order: 2, description: "Chambre meublée, calme et fonctionnelle." },
  { name: "Chambre 3", rent: 379.34, charges: 0, available: false, order: 3, description: "Chambre meublée au 1er étage, lumineuse." },
  { name: "Chambre 4", rent: 335, charges: 0, available: true, order: 4, description: "Chambre meublée — disponible à partir du 1er juillet 2026." },
  { name: "Chambre 5", rent: 425.1, charges: 0, available: false, order: 5, description: "Chambre meublée au 1er étage." },
  { name: "Chambre 6", rent: 335, charges: 0, available: true, order: 6, description: "Chambre meublée — disponible à partir du 1er juillet 2026." },
];

// Locataires à date (juin 2026).
const tenants = [
  {
    room: "Chambre 1",
    fullName: "Paul GARDAN",
    phone: "06 66 15 54 25",
    email: "paulgardan@outlook.fr",
    moveInDate: new Date("2026-06-12"),
    moveOutDate: null,
    deposit: 670,
  },
  {
    room: "Chambre 2",
    fullName: "Thomas BARDOUX-VALLA",
    phone: "06 67 35 47 54",
    email: "hermine.debertoult@gmail.com",
    moveInDate: new Date("2025-08-30"),
    moveOutDate: null,
    deposit: 670,
    notes: "⚠ Tél/email identiques à la chambre 3 dans le tableau source — à vérifier.",
  },
  {
    room: "Chambre 3",
    fullName: "Hermine DE BERTOULT d'HAUTECLOQUE",
    phone: "06 67 35 47 54",
    email: "hermine.debertoult@gmail.com",
    moveInDate: new Date("2024-01-13"),
    moveOutDate: null,
    deposit: 734,
  },
  {
    room: "Chambre 4",
    fullName: "Johan LAVASTRE",
    phone: "07 66 61 99 62",
    email: "johan.lavastre@gmail.com",
    moveInDate: new Date("2025-08-30"),
    moveOutDate: new Date("2026-06-30"),
    deposit: 670,
  },
  {
    room: "Chambre 5",
    fullName: "Claire HOUPERT",
    phone: "06 79 65 43 23",
    email: "houpert.cla@gmail.com",
    moveInDate: new Date("2021-08-30"),
    moveOutDate: null,
    deposit: 760,
  },
  {
    room: "Chambre 6",
    fullName: "Raphaël DEPUYDT",
    phone: "07 84 06 10 96",
    email: "raphael.depuydt@orange.fr",
    moveInDate: new Date("2025-08-30"),
    moveOutDate: new Date("2026-06-30"),
    deposit: 670,
  },
];

async function main() {
  const existing = await prisma.room.count();
  if (existing > 0) {
    console.log(`↪︎  ${existing} chambre(s) déjà en base — seed ignoré.`);
    return;
  }

  const roomIdByName = {};
  for (const room of rooms) {
    const created = await prisma.room.create({ data: room });
    roomIdByName[room.name] = created.id;
  }

  for (const t of tenants) {
    const { room, ...rest } = t;
    await prisma.tenant.create({
      data: { ...rest, roomId: roomIdByName[room] ?? null },
    });
  }

  console.log(`✓ ${rooms.length} chambres et ${tenants.length} locataires créés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
