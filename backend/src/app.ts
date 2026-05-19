import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  }),
);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Online Admission Backend Running",
  });
});

export default app;
