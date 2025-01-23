import { useState } from "react";
import { NewDiaryEntry, Visibility, Weather } from "../types";

const DiaryForm = ({
  addDiary,
}: {
  addDiary: (diary: NewDiaryEntry) => void;
}) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState("");

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    addDiary({
      date: date,
      visibility: visibility,
      weather: weather,
      comment: comment,
    });
    setComment("");
  };

  return (
    <div>
      <form onSubmit={diaryCreation}>
        <div>
          date
          <input
            type="date"
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          visibility
          <input
            type="radio"
            name="visibility"
            value="great"
            onChange={() => setVisibility(Visibility.Great)}
          />
          great
          <input
            type="radio"
            name="visibility"
            value="good"
            onChange={() => setVisibility(Visibility.Good)}
          />
          good
          <input
            type="radio"
            name="visibility"
            value="ok"
            onChange={() => setVisibility(Visibility.Ok)}
          />
          ok
          <input
            type="radio"
            name="visibility"
            value="poor"
            onChange={() => setVisibility(Visibility.Poor)}
          />
          poor
        </div>
        <div>
          weather
          <input
            type="radio"
            name="weather"
            value="sunny"
            onChange={() => setWeather(Weather.Sunny)}
          />
          sunny
          <input
            type="radio"
            name="weather"
            value="rainy"
            onChange={() => setWeather(Weather.Rainy)}
          />
          rainy
          <input
            type="radio"
            name="weather"
            value="cloudy"
            onChange={() => setWeather(Weather.Cloudy)}
          />
          cloudy
          <input
            type="radio"
            name="weather"
            value="stormy"
            onChange={() => setWeather(Weather.Stormy)}
          />
          stormy
          <input
            type="radio"
            name="weather"
            value="windy"
            onChange={() => setWeather(Weather.Windy)}
          />
          windy
        </div>
        <div>
          comment
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default DiaryForm;
