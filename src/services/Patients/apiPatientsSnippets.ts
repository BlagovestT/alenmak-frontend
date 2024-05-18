export type Patient = {
  _id: string;
  first_name: string;
  last_name: string;
  gender: "male" | "female";
  age: number;
  paid: "paid" | "unpaid";
  status: "active" | "inactive" | "released" | "deceased";
  group: "група 1" | "група 2" | "група 3" | "група 4";
  createdAt: Date;
  updatedAt: Date;
};

export type GetQueryPatientsSnippet = Patient[];

export type GetQueryPatientByIdSnippet = Patient;

export type PostQueryCreatePatientSnippet = Patient;

export type PostQueryUpdatedPatientSnippet = Patient;

export type PostQueryDeletePatientSnippet = { message: "Patient removed" };
