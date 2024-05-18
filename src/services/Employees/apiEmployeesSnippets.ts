export type Employee = {
  _id: string;
  first_name: string;
  last_name: string;
  gender: "male" | "female";
  occupation:
    | "Санитар"
    | "Медицинска Сестра"
    | "Управител"
    | "Готвач"
    | "Социален Работник"
    | "Рехабилитатор"
    | "Болногледач";
  salary: number;
  status: "paid" | "unpaid";
  createdAt: Date;
  updatedAt: Date;
};

export type GetQueryEmployeesSnippet = Employee[];

export type GetQueryEmployeeByIdSnippet = Employee;

export type PostQueryCreateEmployeeSnippet = Employee;

export type PostQueryUpdatedEmployeeSnippet = Employee;

export type PostQueryDeleteEmployeeSnippet = { message: "Employee deleted" };
