"use client";
import { DragEvent, useEffect, useRef, useState } from "react";
import Scheduler from "@/components/SmallComponents/Scheduler/Scheduler";
import { Box, Stack, Typography } from "@mui/material";
import {
  Event,
  GetQueryEventsSnippet,
  PostQueryDeleteEventSnippet,
  PostQueryUpdatedEventSnippet,
} from "@/services/Event/apiEventsSnippets";
import { getQueryEvents } from "@/services/Event/apiEventsGetQueries";
import { callApi } from "@/services/callApi";
import {
  postQueryDeleteEvent,
  postQueryUpdatedEvent,
} from "@/services/Event/apiEventsPostQueries";
import Button from "@/components/MUIComponents/Button";
import { useReactToPrint } from "react-to-print";
import {
  Employee,
  GetQueryEmployeesSnippet,
} from "@/services/Employees/apiEmployeesSnippets";
import { getQueryEmployees } from "@/services/Employees/apiEmployeesGetQueries";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { PostQueryUpdateEventInput } from "@/services/Event/apiEventsInputs";

const SchedulePage = () => {
  const componentRef = useRef();
  const [events, setEvents] = useState<Event[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current ?? null,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const events = await callApi<GetQueryEventsSnippet>({
          query: getQueryEvents,
        });

        const employees = await callApi<GetQueryEmployeesSnippet>({
          query: getQueryEmployees,
        });

        if (events) {
          const filteredEventsData = {
            ...events,
            data: events.map((event) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            })),
          };

          setEvents(filteredEventsData.data);
        }

        if (employees) {
          setEmployees(employees);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    })();
  }, []);

  const handleEventDragged = async (
    event: DragEvent<HTMLButtonElement>,
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent
  ): Promise<void | ProcessedEvent> => {
    try {
      const staffMember = employees.find(
        (staff) => staff._id === updatedEvent.staff_id
      );

      if (!staffMember) return;

      const body: PostQueryUpdateEventInput = {
        event_id: originalEvent.event_id.toString(),
        title: staffMember.first_name + " " + staffMember.last_name,
        start: updatedEvent.start,
        end: updatedEvent.end,
        staff_id: updatedEvent.staff_id,
      };

      const newEvent = await callApi<PostQueryUpdatedEventSnippet>({
        query: postQueryUpdatedEvent(originalEvent.event_id.toString(), body),
      });

      if (newEvent) {
        setEvents((prevEvents) => {
          const updatedEvents = prevEvents.map((event) => {
            if (event.event_id === originalEvent.event_id) {
              return {
                ...event,
                start: updatedEvent.start,
                end: updatedEvent.end,
              };
            }
            return event;
          });

          return updatedEvents;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEventDelete = async (deletedId: string): Promise<string> => {
    return new Promise(async (res: any) => {
      try {
        const deletedEvent = await callApi<PostQueryDeleteEventSnippet>({
          query: postQueryDeleteEvent(deletedId),
        });

        if (deletedEvent.message === "Event deleted") {
          res(deletedId);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  return (
    <Stack
      width="100%"
      minHeight="85vh"
      bgcolor="#fff"
      mt={8}
      p="1rem"
      borderRadius="5px"
    >
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography component="h2" variant="h3">
          График
        </Typography>

        <Button message="Принтирай" onClick={handlePrint} disabled={loading} />
      </Stack>

      <Box ref={componentRef}>
        <Scheduler
          events={events}
          setEvents={setEvents}
          loading={loading}
          editable={{
            employees: employees,
            onEventDelete: handleEventDelete,
            onEventDrop: handleEventDragged,
          }}
        />
      </Box>
    </Stack>
  );
};

export default SchedulePage;
