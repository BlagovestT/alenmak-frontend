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
  Patient,
  PostQueryCreatePatientSnippet,
  PostQueryUpdatedPatientSnippet,
} from "@/services/Patients/apiPatientsSnippets";
import {
  PostQueryCreatePatientInput,
  PostQueryUpdatePatientInput,
} from "@/services/Patients/apiPatientsInputs";
import {
  postQueryCreatePatient,
  postQueryUpdatedPatient,
} from "@/services/Patients/apiPatientsPostQueries";

const GENDER_SELECT_VALUES = [
  { label: "Мъж", value: "male" },
  { label: "Жена", value: "female" },
];

const GROUP_SELECT_VALUES = [
  { label: "Група 1", value: "група 1" },
  { label: "Група 2", value: "група 2" },
  { label: "Група 3", value: "група 3" },
  { label: "Група 4", value: "група 4" },
];

const PAID_SELECT_VALUES = [
  { label: "Платено", value: "paid" },
  { label: "Неплатено", value: "unpaid" },
];

const STATUS_SELECT_VALUES = [
  { label: "Активен", value: "active" },
  { label: "Неактивен", value: "inactive" },
  { label: "Починал", value: "deceased" },
  { label: "Изписан", value: "released" },
];

const fieldValidation = object({
  first_name: string().required("Полето е задължително"),
  last_name: string().required("Полето е задължително"),
  gender: string().required("Полето е задължително"),
  age: number().min(1).max(120).required("Полето е задължително"),
  group: string().required("Полето е задължително"),
  paid: string().required("Полето е задължително"),
  status: string().required("Полето е задължително"),
});

type PatientFormValues = {
  first_name: string;
  last_name: string;
  gender: "male" | "female";
  age: number;
  group: "група 1" | "група 2" | "група 3" | "група 4";
  paid: "paid" | "unpaid";
  status: "active" | "inactive" | "released" | "deceased";
};

interface PatientFormProps {
  patientsModalData: Patient | null;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setOpenPatientsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PatientsForm: React.FC<PatientFormProps> = ({
  patientsModalData: patientsModalData,
  setPatients: setPatients,
  setOpenPatientsModal: setOpenPatientModal,
}) => {
  const [formStatus, setFormStatus] = useState<AlertStatuses>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues: PatientFormValues = {
    first_name: patientsModalData?.first_name || "",
    last_name: patientsModalData?.last_name || "",
    gender: patientsModalData?.gender || "male",
    age: patientsModalData?.age || 0,
    group: patientsModalData?.group || "група 1",
    paid: patientsModalData?.paid || "unpaid",
    status: patientsModalData?.status || "active",
  };

  const handleFormSubmit = async (values: PatientFormValues) => {
    try {
      setLoading(true);
      setFormStatus(null);
      setAlertMessage(null);

      const owner = USER_ID;

      if (!owner) throw new Error("Моля влезте в профила си!");

      if (patientsModalData) {
        const body: PostQueryUpdatePatientInput = {
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender,
          age: values.age,
          group: values.group,
          paid: values.paid,
          status: values.status,
        };

        const updatedPatient = await callApi<PostQueryUpdatedPatientSnippet>({
          query: postQueryUpdatedPatient(patientsModalData._id, body),
        });

        if (updatedPatient) {
          setPatients((prevPatients) =>
            prevPatients.map((patient) =>
              patient._id === updatedPatient._id ? updatedPatient : patient
            )
          );
          setFormStatus("success");
          setAlertMessage("Пациентът е редактиран успешно!");
          setLoading(false);
          setOpenPatientModal(false);
        }
      } else if (!patientsModalData) {
        const body: PostQueryCreatePatientInput = {
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender,
          age: values.age,
          group: values.group,
          paid: "unpaid",
          status: "active",
        };

        const createdPatient = await callApi<PostQueryCreatePatientSnippet>({
          query: postQueryCreatePatient(body),
        });

        if (createdPatient) {
          setPatients((prevPatients) => [...prevPatients, createdPatient]);
          setFormStatus("success");
          setAlertMessage("Пациентът е създаден успешно!");
          setLoading(false);
          setOpenPatientModal(false);
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

            <TextField
              name="age"
              label="Години"
              error={touched["age"] && !!errors["age"]}
              helperText={touched["age"] && errors["age"]}
              onChange={handleChange}
              value={values.age.toString()}
              type="number"
            />

            <Select
              name="group"
              label="Група"
              selectValues={GROUP_SELECT_VALUES}
              value={values.group}
              helperText={touched["group"] && errors["group"]}
              error={touched["group"] && !!errors["group"]}
              onChange={handleChange}
            />

            {patientsModalData?.paid ? (
              <Select
                name="status"
                label="Статус"
                selectValues={STATUS_SELECT_VALUES}
                value={values.status}
                helperText={touched["status"] && errors["status"]}
                error={touched["status"] && !!errors["status"]}
                onChange={handleChange}
              />
            ) : null}

            {patientsModalData?.status ? (
              <Select
                name="paid"
                label="Платено"
                selectValues={PAID_SELECT_VALUES}
                value={values.paid}
                helperText={touched["paid"] && errors["paid"]}
                error={touched["paid"] && !!errors["paid"]}
                onChange={handleChange}
              />
            ) : null}

            <Button
              message={patientsModalData ? "Промени" : "Добави"}
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

export default PatientsForm;
