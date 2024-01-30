import express from "express";

const router = express.Router();

// Route function for current
router.get("/current", (req, res) => {
  const current = Math.random() * 100;
  const time = new Date();
  res.json({ time, data: current });
});

// Route function for voltage
router.get("/voltage", (req, res) => {
  const voltage = Math.random() * 100;
  res.json({ time, data: voltage });
});

router.get("/soc", (req, res) => {
  const soc = Math.random() * 100;
  const time = new Date();
  res.json({ time, data: soc });
});

router.get("/soh", (req, res) => {
  const soh = Math.random() * 100;
  const time = new Date();
  res.json({ time, data: soh });
});

router.get("/invertereff", (req, res) => {
  const inverterEfficeincy = Math.random() * 100;
  const time = new Date();
  res.json({ time, data: inverterEfficeincy });
});

router.get("/temperature", (req, res) => {
  const temperature = Math.random() * 100;
  const time = new Date();
  re;
  s.json({ time, data: temperature });
});

router.get("/highesttemp", (req, res) => {
  const highestTemperature = Math.random() * 100;
  const time = new Date();
  res.json({ time, data: highestTemperature });
});

router.get("/lowesttemp", (req, res) => {
  const lowestTemperature = Math.random() * 100;
  const time = new Date();
  res.json({ time, data: lowestTemperature });
});

router.get("/cellvoltage", (req, res) => {
  const cellVoltage = Math.random() * 100;
  const time = new Date();
  res.json({ time, data: cellVoltage });
});

router.get("/lowestcellvolage", (req, res) => {
  const lowestCellVoltage = Math.random() * 100;
  const time = new Date();
  res.json({ time, data: lowestCellVoltage });
});

router.get("/highestcellvoltage", (req, res) => {
  const highestCellVoltage = Math.random() * 100;
  const time = new Date();
  res.json({ time, data: highestCellVoltage });
});

export default router;
