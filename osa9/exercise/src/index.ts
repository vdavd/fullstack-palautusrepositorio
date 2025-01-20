import express from "express";
import { calculateBmi } from "./bmiCalculator";
const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  if (
    !isNaN(Number(height)) &&
    !isNaN(Number(weight)) &&
    height !== undefined &&
    weight !== undefined
  ) {
    const bmiRange = calculateBmi(Number(height), Number(weight));
    const responseObject = {
      weight: weight,
      height: height,
      bmi: bmiRange,
    };
    res.send(JSON.stringify(responseObject));
  } else {
    res.send(JSON.stringify({ error: "malformatted parameters" }));
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
