import { Patient, NonSensitivePatient, NewPatient } from "../types";
import patientData from "../data/patients";
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientData;

const getEntries = (): Patient[] => {
  return patients;
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
    ...patient,
  };

  return newPatient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
};
