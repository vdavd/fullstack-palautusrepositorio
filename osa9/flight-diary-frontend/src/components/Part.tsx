import { DiaryEntry } from "../types";

const Part = ({ diaryEntry }: { diaryEntry: DiaryEntry }) => {
  return (
    <div>
      <p>
        <b>{diaryEntry.date}</b>
      </p>
      <p>
        visibility: {diaryEntry.visibility} <br></br>
        weather: {diaryEntry.weather}
      </p>
    </div>
  );
};

export default Part;
