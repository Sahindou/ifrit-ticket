import express from "express";
import cors from "cors";
import { env } from "@/core/config/env";
import router from "@/api/routes/";

const app = express();

app.use(
  cors({
    origin: env.ORIGIN, // Autoriser UNIQUEMENT cette adresse à requêter sur mon serv
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Méthodes HTTPS autorisées (les autres seront bloquées)
    credentials: true,
  })
);
app.use(express.json()); // pour analyser les requêtes JSON
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  // Route de base pour vérifier que le serveur fonctionne
  res.json({
    message: "✅ Ifrit tickets - API en ligne",
    version: "1.3.0",
    documentation: "non disponible",
    endpoints: {
      tickets: "/tickets",
      typeTickets: "/type-tickets",
      auth: "/auth",
      // users: "/users",
    },
  });
});

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/", router); // Utiliser le routeur pour les routes API

app.listen(env.PORT, () => {
  // Mise en écoute du serveur (met le serveur en écoute sur le port spécifié et affiche un message à la logger quand c'est prêt)
  console.log("Le serveur est en écoute sur: http://localhost:" + env.PORT);
});
