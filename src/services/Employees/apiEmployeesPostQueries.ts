import { Query } from "../apiTypes";
import {
  PostQueryCreateEmployeeInput,
  PostQueryUpdateEmployeeInput,
} from "./apiEmployeesInputs";

export const postQueryCreateEmployee = (
  input: PostQueryCreateEmployeeInput
): Query => ({
  endpoint: "/employees",
  method: "POST",
  variables: input,
});

export const postQueryUpdatedEmployee = (
  employeeID: string,
  input: PostQueryUpdateEmployeeInput
): Query => ({
  endpoint: `/employees/${employeeID}`,
  method: "PUT",
  variables: input,
});

export const postQueryDeleteEmployee = (employeeID: string): Query => ({
  endpoint: `/employees/${employeeID}`,
  method: "DELETE",
});
