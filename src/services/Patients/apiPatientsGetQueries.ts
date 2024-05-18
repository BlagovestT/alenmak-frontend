import { Query } from "../apiTypes";

export const getQueryPatients: Query = {
  endpoint: `/patients`,
  method: "GET",
};

export const getQueryPatientById = (patientID: string): Query => ({
  endpoint: `/patients/${patientID}`,
  method: "GET",
});
