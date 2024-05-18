export type PostQueryCreateEventInput = {
  title: string;
  start: Date;
  end: Date;
  staff_id: string;
};

export type PostQueryUpdateEventInput = {
  event_id: string;
  title: string;
  start: Date;
  end: Date;
  staff_id: string;
};
