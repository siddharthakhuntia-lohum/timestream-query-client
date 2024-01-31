import Express, { json } from "express";
import { runQuery1 } from "./query.js";

const PORT = process.env.PORT || 3035;

const app = Express();
app.use(json());
import batteryRoutes from "./routes.js";

app.use("/battery", batteryRoutes);

app.get("/", (req, res) => {
  res.send("working..");
});

app.get("/query1", async (req, res) => {
  try {
    const result = await runQuery1();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
