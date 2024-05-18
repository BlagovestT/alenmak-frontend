import { useState } from "react";
import Alert, { AlertStatuses } from "@/components/MUIComponents/Alert";
import { SchedulerHelpers } from "@aldabil/react-scheduler/types";
import { date, object, string } from "yup";
import {
  CircularProgress,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import Button from "@/components/MUIComponents/Button";
import CloseIcon from "@mui/icons-material/Close";
import DateAndTimePicker from "@/components/MUIComponents/DateAndTimePicker";
import { getShiftStartEndDate } from "@/helpers/helpers";
import Select from "@/components/MUIComponents/Select";
import { Employee } from "@/services/Employees/apiEmployeesSnippets";
import { callApi } from "@/services/callApi";
import {
  PostQueryCreateEventInput,
  PostQueryUpdateEventInput,
} from "@/services/Event/apiEventsInputs";
import {
  Event,
  PostQueryCreateEventSnippet,
  PostQueryUpdatedEventSnippet,
} from "@/services/Event/apiEventsSnippets";
import {
  postQueryCreateEvent,
  postQueryUpdatedEvent,
} from "@/services/Event/apiEventsPostQueries";

export type Shift = "firstShift" | "secondShift" | "fullDay";

type ShiftsDataType = {
  description: string;
  value: Shift;
};

const SHIFTS_DATA: ShiftsDataType[] = [
  { description: "I смяна", value: "firstShift" },
  { description: "II смяна", value: "secondShift" },
  { description: "24 часа", value: "fullDay" },
];

const fieldValidation = object({
  start: date().required("Полето е задължително"),
  end: date().required("Полето е задължително"),
  staff_id: string().required("Полето е задължително"),
});

type SchedulerFormValues = {
  start: Date;
  end: Date;
  staff_id: string;
};

interface SchedulerEditorProps {
  scheduler: SchedulerHelpers;
  employees: Employee[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const SchedulerEditor = ({
  scheduler,
  employees,
  setEvents,
}: SchedulerEditorProps) => {
  const event = scheduler.edited;
  const eventState = scheduler.state;
  const [formStatus, setFormStatus] = useState<AlertStatuses>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [shift, setShift] = useState<Shift | null>(null);
  const initialValues: SchedulerFormValues = {
    start: event?.start || eventState.start.value || new Date(),
    end: event?.end || eventState.end.value || new Date(),
    staff_id: (event?.staff_id as string) || "",
  };

  const handleButtonGroupChange = (
    shift: Shift,
    values: SchedulerFormValues
  ) => {
    setShift(shift);

    const shiftStartEndDate = getShiftStartEndDate(
      eventState.start.value,
      shift
    );

    if (shiftStartEndDate) {
      values.start = shiftStartEndDate?.start;
      values.end = shiftStartEndDate?.end;
    }
  };

  const handleFormSubmit = async (values: SchedulerFormValues) => {
    try {
      setLoading(true);
      setFormStatus(null);
      setAlertMessage(null);

      const staffMember = employees.find(
        (employee) => employee._id === values.staff_id
      );

      if (!staffMember) return;

      if (event) {
        const body: PostQueryUpdateEventInput = {
          event_id: event.event_id.toString(),
          title: staffMember.first_name + " " + staffMember.last_name,
          start: values.start,
          end: values.end,
          staff_id: values.staff_id,
        };

        const updatedEvent = await callApi<PostQueryUpdatedEventSnippet>({
          query: postQueryUpdatedEvent(event._id, body),
        });

        if (updatedEvent) {
          setEvents((prevEvents) => {
            const updatedEvents = prevEvents.map((event) => {
              if (event._id === updatedEvent._id) {
                return {
                  ...event,
                  title: staffMember.first_name + " " + staffMember.last_name,
                  start: values.start,
                  end: values.end,
                  staff_id: values.staff_id,
                };
              }
              return event;
            });

            return updatedEvents;
          });
          scheduler.close();
        }
      } else {
        const body: PostQueryCreateEventInput = {
          title: staffMember.first_name + " " + staffMember.last_name,
          start: values.start,
          end: values.end,
          staff_id: values.staff_id,
        };

        const newEvent = await callApi<PostQueryCreateEventSnippet>({
          query: postQueryCreateEvent(body),
        });

        if (newEvent) {
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              ...newEvent,
              title: staffMember.first_name + " " + staffMember.last_name,
              start: new Date(values.start),
              end: new Date(values.end),
              staff_id: values.staff_id,
            },
          ]);
          scheduler.close();
        }
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setFormStatus("error");
      setAlertMessage("Възникна грешка, моля опитайте отново!");
      setLoading(false);
    }
  };

  return (
    <Stack width="35rem" p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography component="h4" variant="h3">
          {scheduler.edited ? `Промени ${event?.title}` : "Добави Смяна"}
        </Typography>

        <IconButton onClick={() => scheduler.close()}>
          <CloseIcon />
        </IconButton>
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
                <Select
                  name="staff_id"
                  label="Служител"
                  selectValues={employees.map((employee) => {
                    return {
                      label: employee.first_name + " " + employee.last_name,
                      value: employee._id,
                    };
                  })}
                  value={values.staff_id}
                  helperText={touched["staff_id"] && errors["staff_id"]}
                  error={touched["staff_id"] && !!errors["staff_id"]}
                  onChange={handleChange}
                />

                <ToggleButtonGroup
                  color="primary"
                  value={shift}
                  exclusive
                  onChange={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
                    handleButtonGroupChange((e as any).target.value, values)
                  }
                  fullWidth
                >
                  {SHIFTS_DATA.map((shiftItem) => (
                    <ToggleButton
                      key={shiftItem.value}
                      value={shiftItem.value}
                      sx={{ fontSize: "1rem", textTransform: "none" }}
                    >
                      {shiftItem.description}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                <DateAndTimePicker
                  name="start"
                  label="Начална дата"
                  onChange={(e) => (values.start = e as Date)}
                  error={touched["start"] && !!errors["start"]}
                  helperText={touched["start"] && errors["start"]}
                  value={values.start}
                  type="datetime"
                />

                <DateAndTimePicker
                  name="end"
                  label="Крайна дата"
                  onChange={(e) => (values.end = e as Date)}
                  error={touched["end"] && !!errors["end"]}
                  helperText={touched["end"] && errors["end"]}
                  value={values.end}
                  type="datetime"
                />

                <Button
                  message={scheduler.edited ? "Запази" : "Създай"}
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
      )}
    </Stack>
  );
};

export default SchedulerEditor;
