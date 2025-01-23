import axios from "axios";
import { useState, useEffect } from "react";
import { DiaryEntry, NewDiaryEntry } from "./types";
import Content from "./components/Content";
import DiaryForm from "./components/Diaryform";
import { createDiary, getAllDiaries } from "./services/diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getDiaries = async () => {
      const data = await getAllDiaries();
      setDiaries(data);
    };
    getDiaries();
  }, []);

  const addDiary = async (diary: NewDiaryEntry) => {
    try {
      const newDiary = await createDiary(diary);
      setDiaries(diaries.concat(newDiary));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response);
        setErrorMessage(error.response?.data);
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <p style={{ color: "red" }}>{errorMessage}</p>
      <DiaryForm addDiary={addDiary} />
      <h2>Diary Entries</h2>
      <Content diaries={diaries} />
    </div>
  );
};

export default App;
