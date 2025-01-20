interface ExerciseArguments {
  exerciseHours: number[];
  target: number;
}

interface ExerciseValues {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseExerciseArguments = (args: string[]): ExerciseArguments => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  const exerciseHours = args.slice(3).map(Number);

  if (!exerciseHours.some(isNaN) && !isNaN(target)) {
    return {
      target: target,
      exerciseHours: exerciseHours,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const calculateExercises = (
  exerciseHours: number[],
  target: number
): ExerciseValues => {
  const periodLength = exerciseHours.length;
  if (periodLength === 0)
    throw new Error("Exercise period length cannot be 0!");
  const trainingDays = exerciseHours.filter((hour) => hour !== 0).length;
  const average = exerciseHours.reduce((a, b) => a + b, 0) / periodLength;

  interface SuccessValues {
    success: boolean;
    rating: number;
    ratingDescription: string;
  }
  const successMetric = (average: number, target: number): SuccessValues => {
    if (average < target / 2) {
      return {
        success: false,
        rating: 1,
        ratingDescription: "did you even try?",
      };
    } else if (average < target) {
      return {
        success: false,
        rating: 2,
        ratingDescription: "not too bad but could be better",
      };
    } else if (average >= target) {
      return {
        success: true,
        rating: 3,
        ratingDescription: "great job!",
      };
    } else {
      return {
        success: false,
        rating: 0,
        ratingDescription: "something went wrong",
      };
    }
  };

  const successObject = successMetric(average, target);

  return {
    periodLength: periodLength,
    trainingDays: trainingDays,
    success: successObject.success,
    rating: successObject.rating,
    ratingDescription: successObject.ratingDescription,
    target: target,
    average: average,
  };
};

try {
  const { target, exerciseHours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(exerciseHours, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
