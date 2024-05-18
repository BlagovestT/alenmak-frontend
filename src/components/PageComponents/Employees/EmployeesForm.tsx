import { useState } from "react";
import Alert, { AlertStatuses } from "@/components/MUIComponents/Alert";
import Button from "@/components/MUIComponents/Button";
import TextField from "@/components/MUIComponents/TextField";
import { CircularProgress, Stack } from "@mui/material";
import { Form, Formik } from "formik";
import { number, object, string } from "yup";
import { USER_ID } from "@/helpers/helpers";
import { callApi } from "@/services/callApi";
import Select from "@/components/MUIComponents/Select";
import {
  Employee,
  PostQueryCreateEmployeeSnippet,
  PostQueryUpdatedEmployeeSnippet,
} from "@/services/Employees/apiEmployeesSnippets";
import {
  PostQueryCreateEmployeeInput,
  PostQueryUpdateEmployeeInput,
} from "@/services/Employees/apiEmployeesInputs";
import {
  postQueryCreateEmployee,
  postQueryUpdatedEmployee,
} from "@/services/Employees/apiEmployeesPostQueries";

const GENDER_SELECT_VALUES = [
  { label: "Мъж", value: "male" },
  { label: "Жена", value: "female" },
];

const OCCUPATION_SELECT_VALUES = [
  { label: "Санитар", value: "Санитар" },
  { label: "Медицинска Сестра", value: "Медицинска Сестра" },
  { label: "Управител", value: "Управител" },
  { label: "Готвач", value: "Готвач" },
  { label: "Социален Работник", value: "Социален Работник" },
  { label: "Рехабилитатор", value: "Рехабилитатор" },
  { label: "Болногледач", value: "Болногледач" },
];

const fieldValidation = object({
  first_name: string().required("Полето е задължително"),
  last_name: string().required("Полето е задължително"),
  gender: string().required("Полето е задължително"),
  occupation: string().required("Полето е задължително"),
  salary: number().min(1).max(10000).required("Полето е задължително"),
});

type EmployeeFormValues = {
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
};

interface EmployeeFormProps {
  employeeModalData: Employee | null;
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  setOpenEmployeeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employeeModalData: employeeModalData,
  setEmployees: setEmployees,
  setOpenEmployeeModal: setOpenEmployeeModal,
}) => {
  const [formStatus, setFormStatus] = useState<AlertStatuses>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues: EmployeeFormValues = {
    first_name: employeeModalData?.first_name || "",
    last_name: employeeModalData?.last_name || "",
    gender: employeeModalData?.gender || "male",
    occupation: employeeModalData?.occupation || "Санитар",
    salary: employeeModalData?.salary || 0,
  };

  const handleFormSubmit = async (values: EmployeeFormValues) => {
    try {
      setLoading(true);
      setFormStatus(null);
      setAlertMessage(null);

      const owner = USER_ID;

      if (!owner) throw new Error("Моля влезте в профила си!");

      if (employeeModalData) {
        const body: PostQueryUpdateEmployeeInput = {
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender,
          occupation: values.occupation,
          salary: values.salary,
          status: "unpaid",
        };

        const updatedEmployee = await callApi<PostQueryUpdatedEmployeeSnippet>({
          query: postQueryUpdatedEmployee(employeeModalData._id, body),
        });

        if (updatedEmployee) {
          setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
              employee._id === updatedEmployee._id ? updatedEmployee : employee
            )
          );
          setFormStatus("success");
          setAlertMessage("Работникът е редактиран успешно!");
          setLoading(false);
          setOpenEmployeeModal(false);
        }
      } else if (!employeeModalData) {
        const body: PostQueryCreateEmployeeInput = {
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender,
          occupation: values.occupation,
          salary: values.salary,
          status: "unpaid",
        };

        const createdEmployee = await callApi<PostQueryCreateEmployeeSnippet>({
          query: postQueryCreateEmployee(body),
        });

        if (createdEmployee) {
          setEmployees((prevEmployees) => [...prevEmployees, createdEmployee]);
          setFormStatus("success");
          setAlertMessage("Работникът е създаден успешно!");
          setLoading(false);
          setOpenEmployeeModal(false);
        }
      }
    } catch (err) {
      console.log((err as Error).message);
      setFormStatus("error");
      setAlertMessage("Невалидни данни, моля опитайте отново!");
      setLoading(false);
    }
  };

  return !loading ? (
    <Formik
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      validationSchema={fieldValidation}
    >
      {({ handleSubmit, handleChange, touched, errors, values }) => (
        <Form onSubmit={handleSubmit}>
          <Stack spacing={3} mt={3}>
            <TextField
              name="first_name"
              label="Име"
              error={touched["first_name"] && !!errors["first_name"]}
              helperText={touched["first_name"] && errors["first_name"]}
              onChange={handleChange}
              value={values.first_name}
              type="text"
            />

            <TextField
              name="last_name"
              label="Фамилия"
              error={touched["last_name"] && !!errors["last_name"]}
              helperText={touched["last_name"] && errors["last_name"]}
              onChange={handleChange}
              value={values.last_name}
              type="text"
            />

            <Select
              name="gender"
              label="Пол"
              selectValues={GENDER_SELECT_VALUES}
              value={values.gender}
              helperText={touched["gender"] && errors["gender"]}
              error={touched["gender"] && !!errors["gender"]}
              onChange={handleChange}
            />

            <Select
              name="occupation"
              label="Длъжност"
              selectValues={OCCUPATION_SELECT_VALUES}
              value={values.occupation}
              helperText={touched["occupation"] && errors["occupation"]}
              error={touched["occupation"] && !!errors["occupation"]}
              onChange={handleChange}
            />

            <TextField
              name="salary"
              label="Заплата"
              error={touched["salary"] && !!errors["salary"]}
              helperText={touched["salary"] && errors["salary"]}
              onChange={handleChange}
              value={values.salary.toString()}
              type="number"
            />

            <Button
              message={employeeModalData ? "Промени" : "Добави"}
              type="submit"
            />

            <Alert
              message={alertMessage}
              showAlert={!!alertMessage}
              severity={formStatus}
            />
          </Stack>
        </Form>
      )}
    </Formik>
  ) : (
    <Stack justifyContent="center" alignItems="center" my={5}>
      <CircularProgress size="3rem" />
    </Stack>
  );
};

export default EmployeeForm;
