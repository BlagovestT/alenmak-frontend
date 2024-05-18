/* eslint-disable no-unused-vars */
import { Scheduler as MUIScheduler } from "@aldabil/react-scheduler";
import { DAY, MONTH, WEEK } from "./schedulerData";
import { SchedulerLocale } from "./SchedulerLocale";
import { bg } from "date-fns/locale";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { View } from "@aldabil/react-scheduler/components/nav/Navigation";
import SchedulerVewerTitle from "./SchedulerVewerTitle";
import SchedulerEditor from "./SchedulerEditor";
import { Employee } from "@/services/Employees/apiEmployeesSnippets";
import { DragEvent } from "react";
import { Event } from "@/services/Event/apiEventsSnippets";

interface SchedulerProps {
  events: ProcessedEvent[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  loading?: boolean;
  view?: View;
  editable?: {
    employees: Employee[];
    onEventDrop?: (
      event: DragEvent<HTMLButtonElement>,
      droppedOn: Date,
      updatedEvent: ProcessedEvent,
      originalEvent: ProcessedEvent
    ) => Promise<ProcessedEvent | void>;
    onEventDelete: (deletedId: string) => Promise<string | number | void>;
  };
}

const Scheduler: React.FC<SchedulerProps> = ({
  events = [],
  view = "month",
  loading,
  editable,
  setEvents,
}) => {
  return (
    <MUIScheduler
      view={view}
      events={events}
      hourFormat="24"
      translations={SchedulerLocale}
      loading={loading}
      month={MONTH}
      week={WEEK}
      day={DAY}
      locale={bg}
      editable={editable && !loading ? true : false}
      onDelete={editable?.onEventDelete}
      onEventDrop={editable?.onEventDrop}
      customEditor={(scheduler) => (
        <SchedulerEditor
          scheduler={scheduler}
          employees={editable ? editable.employees : []}
          setEvents={setEvents}
        />
      )}
      viewerTitleComponent={(event) => <SchedulerVewerTitle event={event} />}
    />
  );
};

export default Scheduler;
