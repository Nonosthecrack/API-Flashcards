import express from "express";
import userRoutes from "./routers/UsersRoutes.js";
import logger from "./middlewares/logger.js";
import authRouter from "./routers/authRoutes.js";
import flashCardRouter from "./routers/flashCardRoutes.js";
import collectionRouter from "./routers/collectionRoutes.js";
import adminUsersRouter from "./routers/adminUsersRoutes.js";
import revisionRouter from "./routers/revisionRoutes.js";
import personnalFlashCardRouter from "./routers/personnalFlashCardRouter.js";

const app = express();

// CORS - autorise les requetes depuis file:// (GUI locale) et localhost
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(logger);

// Healthcheck - utilise par Docker pour verifier que le container est vivant
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/users", userRoutes);
app.use("/auth", authRouter);
app.use("/flashcards", flashCardRouter);
app.use("/collections", collectionRouter);
app.use("/admin/users", adminUsersRouter);
app.use("/revision", revisionRouter);
app.use("/study", personnalFlashCardRouter);

export default app;
