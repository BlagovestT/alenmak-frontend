"use client";
import { useEffect, useState } from "react";
import { CircularProgress, Paper, Stack, Typography } from "@mui/material";
import Alert, { AlertStatuses } from "@/components/MUIComponents/Alert";
import Button from "@/components/MUIComponents/Button";
import TextField from "@/components/MUIComponents/TextField";
import { Form, Formik } from "formik";
import Link from "next/link";
import { object, string, ref } from "yup";
import { USER_ID } from "@/helpers/helpers";
import { signUp } from "@/services/Auth/auth";
import Image from "next/image";
import logo from "../../../../public/logo.png";

const fieldValidation = object({
  firstname: string().required("Полето е задължително"),
  lastname: string().required("Полето е задължително"),
  email: string()
    .email("Въведете валиден имейл")
    .required("Полето е задължително"),
  phone: string().required("Полето е задължително"),
  password: string()
    .trim()
    .min(8, "Дължитената трябва да е поне 8 символа")
    .required("Полето е задължително"),
  confirmPassword: string()
    .oneOf([ref("password")], "Паролите не са еднакви")
    .required("Полето е задължително"),
});

type RegisterFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const [formStatus, setFormStatus] = useState<AlertStatuses>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues: RegisterFormValues = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
    if (USER_ID) {
      window.location.href = "/";
    }
    setFormStatus("warning");
    setAlertMessage(
      "За да създадете акаунт, моля, свържете се с администратор на сайта!"
    );
  }, []);

  const handleFormSubmit = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      setFormStatus(null);
      setAlertMessage(null);

      const newUser = await signUp(
        values.firstname,
        values.lastname,
        values.email,
        values.password
      );
      if (newUser) {
        window.location.assign("/auth/login");
      } else {
        throw new Error("Неуспешна регистрация, моля опитайте отново!");
      }
    } catch (err) {
      console.log((err as Error).message);
      setFormStatus("error");
      setAlertMessage("Неуспешна регистрация, моля опитайте отново.");
      setLoading(false);
    }
  };

  return (
    <Stack
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      overflow="auto"
      p={1}
    >
      <Paper sx={{ width: "100%", maxWidth: "600px", p: 4 }}>
        <Stack justifyContent="center" alignItems="center" gap={2}>
          <Image src={logo} alt="logo" />
          <Typography component="h2" variant="h3">
            Регистрация
          </Typography>
        </Stack>

        {!loading ? (
          <Formik
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            validationSchema={fieldValidation}
          >
            {({ handleSubmit, handleChange, touched, errors, values }) => (
              <Form onSubmit={handleSubmit}>
                <Stack spacing={3} mt={3}>
                  <TextField
                    name="firstname"
                    label="Име"
                    error={touched["firstname"] && !!errors["firstname"]}
                    helperText={touched["firstname"] && errors["firstname"]}
                    onChange={handleChange}
                    value={values.firstname}
                    type="firstname"
                    disabled
                  />

                  <TextField
                    name="lastname"
                    label="Фамилия"
                    error={touched["lastname"] && !!errors["lastname"]}
                    helperText={touched["lastname"] && errors["lastname"]}
                    onChange={handleChange}
                    value={values.lastname}
                    type="lastname"
                    disabled
                  />

                  <TextField
                    name="email"
                    label="Имейл Адрес"
                    error={touched["email"] && !!errors["email"]}
                    helperText={touched["email"] && errors["email"]}
                    onChange={handleChange}
                    value={values.email}
                    type="email"
                    disabled
                  />

                  <TextField
                    name="password"
                    label="Парола"
                    error={touched["password"] && !!errors["password"]}
                    helperText={touched["password"] && errors["password"]}
                    onChange={handleChange}
                    value={values.password}
                    type="password"
                    disabled
                  />

                  <TextField
                    name="confirmPassword"
                    label="Потвърди Парола"
                    error={
                      touched["confirmPassword"] && !!errors["confirmPassword"]
                    }
                    helperText={
                      touched["confirmPassword"] && errors["confirmPassword"]
                    }
                    onChange={handleChange}
                    value={values.confirmPassword}
                    type="password"
                    disabled
                  />

                  <Button message="Регистрация" type="submit" disabled />

                  <Alert
                    message={alertMessage}
                    showAlert={!!alertMessage}
                    severity={formStatus}
                  />

                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                  >
                    <Typography component="p" variant="body1">
                      Имате акаунт?
                    </Typography>
                    <Link href="/auth/login" style={{ color: "#0E86D4" }}>
                      Влезте от тук
                    </Link>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        ) : (
          <Stack justifyContent="center" alignItems="center" my={5}>
            <CircularProgress size="3rem" />
          </Stack>
        )}
      </Paper>
    </Stack>
  );
};

export default RegisterPage;
