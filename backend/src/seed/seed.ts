import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Listing } from "../models/Listing";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI manquant.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅ Connecté à MongoDB pour le seed.");

  // ---------- 1. Compte administrateur ----------
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@homease.bj").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMoi123!";
  const adminName = process.env.ADMIN_NAME || "Administrateur Homizzy";

  let admin = await User.findOne({ email: adminEmail });
  if (admin) {
    admin.role = "admin";
    admin.isSuspended = false;
    await admin.save();
    console.log(`ℹ️  Le compte admin existait déjà (${adminEmail}) — rôle confirmé.`);
  } else {
    admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`✅ Compte administrateur créé : ${adminEmail}`);
  }

  // ---------- 2. Un propriétaire de démo ----------
  const ownerEmail = "proprietaire.demo@homease.bj";
  let owner = await User.findOne({ email: ownerEmail });
  if (!owner) {
    owner = await User.create({
      name: "Propriétaire Démo",
      email: ownerEmail,
      password: "Demo1234!",
      role: "owner",
    });
    console.log(`✅ Propriétaire de démo créé : ${ownerEmail}`);
  }

  // ---------- 3. Annonces de démonstration ----------
  const demoCount = await Listing.countDocuments({ isDemo: true });
  if (demoCount === 0) {
    await Listing.insertMany([
      {
        owner: owner._id,
        title: "[DÉMO] Appartement moderne à Fidjrossè",
        description:
          "Bel appartement moderne au calme, proche de la plage, idéal pour jeune cadre ou expatrié. Ceci est une annonce de démonstration.",
        category: "appartement",
        transactionType: "location",
        price: 250000,
        city: "Cotonou",
        neighborhood: "Fidjrossè",
        bedrooms: 3,
        bathrooms: 2,
        surfaceM2: 120,
        furnished: true,
        amenities: ["climatisation", "parking", "sécurité", "eau", "électricité"],
        photos: [],
        status: "approuvee",
        isDemo: true,
        isFeatured: true,
      },
      {
        owner: owner._id,
        title: "[DÉMO] Chambre meublée à Abomey-Calavi",
        description:
          "Chambre meublée dans une résidence sécurisée, proche de l'université. Ceci est une annonce de démonstration.",
        category: "chambre",
        transactionType: "location",
        price: 45000,
        city: "Abomey-Calavi",
        neighborhood: "Godomey",
        bedrooms: 1,
        bathrooms: 1,
        surfaceM2: 18,
        furnished: true,
        amenities: ["eau", "électricité", "sécurité"],
        photos: [],
        status: "approuvee",
        isDemo: true,
      },
      {
        owner: owner._id,
        title: "[DÉMO] Villa avec piscine à Fidjrossè",
        description:
          "Villa haut de gamme avec piscine et jardin, idéale pour famille. Ceci est une annonce de démonstration.",
        category: "villa",
        transactionType: "vente",
        price: 85000000,
        city: "Cotonou",
        neighborhood: "Fidjrossè",
        bedrooms: 5,
        bathrooms: 4,
        surfaceM2: 350,
        furnished: false,
        amenities: ["piscine", "parking", "sécurité", "climatisation"],
        photos: [],
        status: "approuvee",
        isDemo: true,
        isFeatured: true,
      },
      {
        owner: owner._id,
        title: "[DÉMO] Parcelle titrée à Abomey-Calavi",
        description:
          "Parcelle de terrain titrée, viabilisée, idéale pour construction. Ceci est une annonce de démonstration.",
        category: "parcelle",
        transactionType: "vente",
        price: 12000000,
        city: "Abomey-Calavi",
        neighborhood: "Cococodji",
        surfaceM2: 500,
        furnished: false,
        amenities: [],
        photos: [],
        status: "approuvee",
        isDemo: true,
      },
      {
        owner: owner._id,
        title: "[DÉMO] Bureau moderne à Cotonou",
        description:
          "Espace de bureau moderne au centre-ville, idéal pour startup ou petite entreprise. Ceci est une annonce de démonstration.",
        category: "bureau",
        transactionType: "location",
        price: 180000,
        city: "Cotonou",
        neighborhood: "Haie Vive",
        surfaceM2: 60,
        furnished: false,
        amenities: ["climatisation", "parking", "électricité"],
        photos: [],
        status: "approuvee",
        isDemo: true,
      },
    ]);
    console.log("✅ Annonces de démonstration créées.");
  } else {
    console.log("ℹ️  Des annonces de démonstration existent déjà — aucune création.");
  }

  console.log("\n🎉 Seed terminé.");
  console.log(`   Connecte-toi avec : ${adminEmail} / (le mot de passe défini dans .env)`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur pendant le seed :", err);
  process.exit(1);
});
