import { createLogger, format, transports } from "winston";
import { env } from "@/core/config/env";

const logger = createLogger({
    level: "info", // niveau de log min pour capturer (peut etre info warn debug error etc)
    format: format.combine(
        format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), // Ajoute un timestamp formaté à chaque log
        // Colorise uniquement en développement
        env.NODE_ENV === "development" ? format.colorize() : format.uncolorize(),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] - [${level}]: ${message}` // Format custom pour afficher le log
        })
    ),
    transports: [
        new transports.Console(), // Affiche les logs sur la console
        new transports.File({ filename: "logs/error.log", level: "error" }), // Fichier de log où seront ttes les error
        new transports.File({ filename: "logs/combined.log" }) // Fichier où seront TOUT les logs (sans exception)
    ]
});

export default logger;