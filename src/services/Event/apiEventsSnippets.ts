export type Event = {
  _id: string;
  event_id: string;
  title: string;
  start: Date;
  end: Date;
  staff_id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GetQueryEventsSnippet = Event[];

export type GetQueryEventByIdSnippet = Event;

export type PostQueryCreateEventSnippet = Event;

export type PostQueryUpdatedEventSnippet = Event;

export type PostQueryDeleteEventSnippet = { message: "Event deleted" };
