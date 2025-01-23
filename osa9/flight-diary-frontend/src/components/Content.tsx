import Part from "./Part";
import { DiaryEntry } from "../types";

interface ContentProps {
  diaries: DiaryEntry[];
}

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.diaries.map((diaryEntry) => (
        <Part key={diaryEntry.id} diaryEntry={diaryEntry} />
      ))}
    </div>
  );
};

export default Content;
