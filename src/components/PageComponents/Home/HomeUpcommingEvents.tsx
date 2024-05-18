import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Event } from "@/services/Event/apiEventsSnippets";

interface HomeUpcommingEventsProps {
  eventsData: Event[] | undefined;
  weekData: {
    day: string;
    date: string;
  }[];
}

const HomeUpcommingEvents: React.FC<HomeUpcommingEventsProps> = ({
  eventsData,
  weekData,
}) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<string>(weekData[0].date);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (eventsData) {
      const filtered = eventsData.filter(
        (event) => new Date(event.start).getDate() === parseInt(selectedDate)
      );
      setFilteredEvents(filtered);
    }
  }, [eventsData, selectedDate]);

  const sortedEvents = filteredEvents.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <Stack justifyContent="flex-start" alignItems="center" gap={2}>
      <Typography component="h4" variant="h2" textAlign="center">
        Предстоящи Смени
      </Typography>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        gap={1}
      >
        <DateRangeIcon />
        <Typography component="h4" variant="h3">
          {new Date()
            .toLocaleString("bg-BG", {
              month: "long",
              year: "numeric",
            })
            .charAt(0)
            .toUpperCase() +
            new Date()
              .toLocaleString("bg-BG", {
                month: "long",
                year: "numeric",
              })
              .slice(1)}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
      >
        {weekData.map((day) => (
          <Stack
            key={day.date}
            width="4rem"
            justifyContent="center"
            alignItems="center"
            bgcolor={theme.palette.primary.main}
            p={1}
            borderRadius="10px"
            sx={{
              cursor: "pointer",
              border: "3px solid",
              borderColor:
                selectedDate === day.date
                  ? theme.palette.primary.dark
                  : "transparent",
              transition: "250ms ease-in-out",
            }}
            gap={0.5}
            onClick={() => setSelectedDate(day.date)}
          >
            <Typography component="p" variant="h4" color="common.white">
              {day.day}
            </Typography>
            <Typography component="p" variant="h4" color="common.white">
              {day.date}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Stack
        width="100%"
        maxWidth="34rem"
        bgcolor={theme.palette.background.default}
        borderRadius="10px"
        p={2}
        gap={4}
      >
        {eventsData ? (
          sortedEvents.length === 0 ? (
            <Stack justifyContent="center" alignItems="center">
              <Typography component="p" variant="body1">
                Няма предстоящи смени
              </Typography>
            </Stack>
          ) : (
            sortedEvents.map((event, index) => (
              <Box key={event.event_id}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={1}
                  flexWrap="wrap"
                >
                  <WatchLaterIcon
                    sx={{ fontSize: "3rem", color: theme.palette.primary.main }}
                  />

                  <Typography component="p" variant="h3" color="primary.main">
                    {event.title}
                  </Typography>
                  <Box width="100%" maxWidth="14rem">
                    <Typography component="p" variant="body1">
                      {event.title}
                    </Typography>
                    <Typography component="p" variant="body1">
                      {new Date(event.start).toLocaleTimeString("bg-BG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                        " - " +
                        new Date(event.end).toLocaleTimeString("bg-BG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </Typography>
                  </Box>
                </Stack>
                {index !== sortedEvents.length - 1 && <Divider />}
              </Box>
            ))
          )
        ) : (
          <Stack justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default HomeUpcommingEvents;
