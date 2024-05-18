export type PostQueryCreatePatientInput = {
  first_name: string;
  last_name: string;
  gender: "male" | "female";
  age: number;
  paid: "paid" | "unpaid";
  status: "active" | "inactive" | "released" | "deceased";
  group: "група 1" | "група 2" | "група 3" | "група 4";
};

export type PostQueryUpdatePatientInput = {
  first_name: string;
  last_name: string;
  gender: "male" | "female";
  age: number;
  paid: "paid" | "unpaid";
  status: "active" | "inactive" | "released" | "deceased";
  group: "група 1" | "група 2" | "група 3" | "група 4";
};
