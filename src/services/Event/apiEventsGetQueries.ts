import { Query } from "../apiTypes";

export const getQueryEvents: Query = {
  endpoint: `/events`,
  method: "GET",
};

export const getQueryEventById = (eventID: string): Query => ({
  endpoint: `/events/${eventID}`,
  method: "GET",
});
