import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Stack, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PersonIcon from "@mui/icons-material/Person";
import { formatDate } from "@/helpers/helpers";

interface SchedulerVewerTitleProps {
  event: ProcessedEvent;
}

const SchedulerVewerTitle: React.FC<SchedulerVewerTitleProps> = ({ event }) => {
  return (
    <Stack style={{ fontSize: "1.2rem" }} py={1} gap={1}>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        gap={1}
      >
        <PersonIcon sx={{ color: "common.white" }} />
        <Typography component="p" variant="body1">
          Служител: {event.title}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        gap={1}
      >
        <EventAvailableIcon sx={{ color: "common.white" }} />
        <Typography component="p" variant="body1">
          Начало: {formatDate(event.start)}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        gap={1}
      >
        <EventBusyIcon sx={{ color: "common.white" }} />
        <Typography component="p" variant="body1">
          Край: {formatDate(event.end)}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default SchedulerVewerTitle;
