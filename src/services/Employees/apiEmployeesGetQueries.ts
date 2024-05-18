import { Query } from "../apiTypes";

export const getQueryEmployees: Query = {
  endpoint: `/employees`,
  method: "GET",
};

export const getQueryEmployeeById = (employeeID: string): Query => ({
  endpoint: `/employees/${employeeID}`,
  method: "GET",
});
