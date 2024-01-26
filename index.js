import { runQuery1 } from "./query.js";

(async () => {
  try {
    await runQuery1();
  } catch (err) {
    console.log("Error: ", err);
  }
})();
