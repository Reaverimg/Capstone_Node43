import express from "express";
import cors from "cors";
import rootRouter from "./routes/root.router.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(rootRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
