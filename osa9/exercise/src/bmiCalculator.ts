interface BmiValues {
  height: number;
  weight: number;
}

const parseBmiArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  if (height === 0) throw new Error("Height cannot be 0");

  const bmi = weight / (height / 100) ** 2;

  if (bmi < 18.5) {
    return "Underweight range";
  } else if (bmi < 24.9) {
    return "Normal range";
  } else if (bmi < 29.9) {
    return "Overweight range";
  } else if (bmi < 34.9) {
    return "Obese range";
  } else if (bmi >= 35.0) {
    return "Extremely obese range";
  }

  return "Something went wrong";
};

if (require.main === module) {
  try {
    const { height, weight } = parseBmiArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
