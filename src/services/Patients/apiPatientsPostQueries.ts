import { Query } from "../apiTypes";
import {
  PostQueryCreatePatientInput,
  PostQueryUpdatePatientInput,
} from "./apiPatientsInputs";

export const postQueryCreatePatient = (
  input: PostQueryCreatePatientInput
): Query => ({
  endpoint: "/patients",
  method: "POST",
  variables: input,
});

export const postQueryUpdatedPatient = (
  patientID: string,
  input: PostQueryUpdatePatientInput
): Query => ({
  endpoint: `/patients/${patientID}`,
  method: "PUT",
  variables: input,
});

export const postQueryDeletePatient = (projectID: string): Query => ({
  endpoint: `/patients/${projectID}`,
  method: "DELETE",
});
