const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");
const Router = require("./routes/route.js");
const errorMiddleware = require("./middlewares/error.middleware");
const AuthMiddleware = require("./middlewares/auth.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

dotenv.config();

const requiredEnvVars = ["NODE_ENV", "DATABASE_URL"];
if (process.env.NODE_ENV === "production") {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
}

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["*"],
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV !== "test") {
  app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Service is healthy",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use(AuthMiddleware);
app.use("/api", Router);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  if (NODE_ENV === "development") {
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("SIGTERM", () => {
  console.info("SIGTERM received. Closing server gracefully");
});
