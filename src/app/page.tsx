"use client";
import { useEffect, useState } from "react";
import { GetQueryPatientsSnippet } from "@/services/Patients/apiPatientsSnippets";
import { Grid, Skeleton, Stack } from "@mui/material";
import { getQueryPatients } from "@/services/Patients/apiPatientsGetQueries";
import { callApi } from "@/services/callApi";
import Widget from "@/components/SmallComponents/Widget/Widget";
import GroupIcon from "@mui/icons-material/Group";
import {
  Event,
  GetQueryEventsSnippet,
} from "@/services/Event/apiEventsSnippets";
import { getQueryEvents } from "@/services/Event/apiEventsGetQueries";
import { getWeekData } from "@/helpers/helpers";
import HomeUpcommingEvents from "@/components/PageComponents/Home/HomeUpcommingEvents";

type TypeOfPatient = {
  status: string;
  count: number;
};

const HomePage = () => {
  const [typesOfPatientsCount, setTypesOfPatientsCount] = useState<
    TypeOfPatient[]
  >([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const patients = await callApi<GetQueryPatientsSnippet>({
          query: getQueryPatients,
        });

        const events = await callApi<GetQueryEventsSnippet>({
          query: getQueryEvents,
        });

        if (patients && events) {
          const typesOfPatientsCount = [
            {
              status: "Активни Пациенти",
              count: patients.filter((p) => p.status === "active").length,
            },
            {
              status: "Неактивни Пациенти",
              count: patients.filter((p) => p.status === "inactive").length,
            },
            {
              status: "Изписани Пациенти",
              count: patients.filter((p) => p.status === "released").length,
            },
            {
              status: "Починали Пациенти",
              count: patients.filter((p) => p.status === "deceased").length,
            },
          ];

          const filteredEvents = events.filter((event) => {
            const eventDate = new Date(event.start).getDate();
            return getWeekData().some((item) => +item.date === eventDate);
          });

          setEvents(filteredEvents);
          setTypesOfPatientsCount(typesOfPatientsCount);
          setLoading(false);
        } else {
          throw new Error("Има проблем със зареждането на данните.");
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Stack
      width="100%"
      minHeight="85vh"
      bgcolor="#fff"
      mt={8}
      p="1rem"
      borderRadius="5px"
    >
      <Grid container spacing={{ xs: 4, sm: 4, md: 2 }}>
        <Grid item xs={12} sm={12} md={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            {loading ? (
              <>
                {[...Array(4)].map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    animation="wave"
                    sx={{
                      width: "100%",
                      maxWidth: "350px",
                      height: "200px",
                      borderRadius: "5px",
                    }}
                  />
                ))}
              </>
            ) : (
              typesOfPatientsCount.map((type, index) => (
                <Widget
                  key={index}
                  icon={<GroupIcon sx={{ color: "common.white" }} />}
                  title={type.status}
                  value={type.count}
                />
              ))
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <HomeUpcommingEvents eventsData={events} weekData={getWeekData()} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default HomePage;
