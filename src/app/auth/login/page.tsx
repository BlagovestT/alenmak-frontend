"use client";
import { useEffect, useState } from "react";
import Alert, { AlertStatuses } from "@/components/MUIComponents/Alert";
import Button from "@/components/MUIComponents/Button";
import TextField from "@/components/MUIComponents/TextField";
import { CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import Link from "next/link";
import { object, string } from "yup";
import { USER_ID } from "@/helpers/helpers";
import { signIn } from "@/services/Auth/auth";
import logo from "../../../../public/logo.png";
import Image from "next/image";

const fieldValidation = object({
  email: string()
    .email("Въведете валиден имейл")
    .required("Полето е задължително"),
  password: string()
    .trim()
    .min(8, "Дължитената трябва да е поне 8 символа")
    .required("Полето е задължително"),
});

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [formStatus, setFormStatus] = useState<AlertStatuses>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    if (USER_ID) {
      window.location.href = "/";
    }
  }, []);

  const handleFormSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      setFormStatus(null);
      setAlertMessage(null);

      const user: any = await signIn(values.email, values.password);

      if (!user.success) {
        setTimeout(() => {
          throw new Error("Невалидни данни, моля опитайте отново!");
        }, 500);
      }
    } catch (err) {
      console.log((err as Error).message);
      setFormStatus("error");
      setAlertMessage("Невалидни данни, моля опитайте отново!");
      setLoading(false);
    }
  };

  return (
    <Stack
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Paper sx={{ width: "100%", maxWidth: "600px", p: 4 }}>
        <Stack justifyContent="center" alignItems="center" gap={2}>
          <Image src={logo} alt="logo" />
          <Typography component="h2" variant="h3">
            Вход
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
                    name="email"
                    label="Имейл Адрес"
                    error={touched["email"] && !!errors["email"]}
                    helperText={touched["email"] && errors["email"]}
                    onChange={handleChange}
                    value={values.email}
                    type="email"
                  />

                  <TextField
                    name="password"
                    label="Парола"
                    error={touched["password"] && !!errors["password"]}
                    helperText={touched["password"] && errors["password"]}
                    onChange={handleChange}
                    value={values.password}
                    type="password"
                  />

                  <Button message="Вход" type="submit" />

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
                      Нямате акаунт?
                    </Typography>
                    <Link href="/auth/register" style={{ color: "#0E86D4" }}>
                      Регистрирайте се тук
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

export default LoginPage;
