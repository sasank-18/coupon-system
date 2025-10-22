import express, { Express } from "express";
import adminRoutes from "./routes/adminRoutes";
import customerRoutes from "./routes/customerRoutes";
import cors from "cors";

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:3000", // allow frontend
  })
);

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api", customerRoutes);

// Error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    res.status(500).json({ success: false, message: err.message });
  }
);

export default app;
