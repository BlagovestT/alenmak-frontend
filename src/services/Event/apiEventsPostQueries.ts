import { Query } from "../apiTypes";
import {
  PostQueryCreateEventInput,
  PostQueryUpdateEventInput,
} from "./apiEventsInputs";

export const postQueryCreateEvent = (
  input: PostQueryCreateEventInput
): Query => ({
  endpoint: "/events",
  method: "POST",
  variables: input,
});

export const postQueryUpdatedEvent = (
  eventID: string,
  input: PostQueryUpdateEventInput
): Query => ({
  endpoint: `/events/${eventID}`,
  method: "PUT",
  variables: input,
});

export const postQueryDeleteEvent = (eventID: string): Query => ({
  endpoint: `/events/${eventID}`,
  method: "DELETE",
});
