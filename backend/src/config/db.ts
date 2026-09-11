import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI manquant dans les variables d'environnement.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connecté à MongoDB Atlas");
  } catch (error) {
    console.error("❌ Échec de connexion à MongoDB :", error);
    process.exit(1);
  }
}
