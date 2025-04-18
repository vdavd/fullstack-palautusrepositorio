import { Patient, NonSensitivePatient, NewPatient } from "../types";
import toNewPatient from "../utils";
import patientData from "../data/patients";
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientData.map((obj) => {
  const object = toNewPatient(obj) as Patient;
  object.id = obj.id;
  return object;
});

const getEntries = (): Patient[] => {
  return patients;
};

const getPatient = (id: string): Patient | null => {
  const patient = patients.filter((p) => p.id === id);

  if (patient.length > 0) {
    return patient[0];
  }
  return null;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const id = uuid();
  const newPatient = {
    id: id,
    entries: [],
    ...patient,
  };

  return newPatient;
};

export default {
  getEntries,
  getPatient,
  getNonSensitiveEntries,
  addPatient,
};
