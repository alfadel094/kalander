type TFormDataEvent = {
  ename: string;
  edate: string;
  edesc: string;
  edoneBy: string;
  estate: "pending" | "done" | "cancelled";
  "erepeat-behavior"?: "on";
  "erepeat-type": "custom";
  "number-of-intervals": string;
  eperiod: "daily" | "weekly" | "monthly" | "yearly";
  ecolor:
    | "fc-bg-default"
    | "fc-bg-blue"
    | "fc-bg-lightgreen"
    | "fc-bg-pinkred"
    | "fc-bg-deepskyblue";
  eicon: "circle" | "cog" | "group" | "suitcase" | "calendar";
  comments: string[];
};
type TFormDataEventUpdate = {
  eid: string;
  egroupId: string;
  ename: string;
  edate: string;
  edesc: string;
  edoneBy: string;
  estate: "pending" | "done" | "cancelled";
  "erepeat-behavior"?: "on";
  "erepeat-type": "custom";
  "number-of-intervals": string;
  eperiod: "daily" | "weekly" | "monthly" | "yearly";
  ecolor:
    | "fc-bg-default"
    | "fc-bg-blue"
    | "fc-bg-lightgreen"
    | "fc-bg-pinkred"
    | "fc-bg-deepskyblue";
  eicon: "circle" | "cog" | "group" | "suitcase" | "calendar";
  comments: string[];
};

interface TEvent {
    id: number;
    groupId: string | null;
    title: string;
    start: Date;
    end: Date;
    description: string;
    icon: string;
    color: string;
    className: string;
    doneBy: string;
    state: string;
    interval: string | null;
    repeatIntervalFor: number | null;
    comments?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

type TNewEvent = {
  title: "Dentist";
  description: string;
  start: string;
  end: string;
  className: string;
  icon: string;
} & (
  | {
      repeat: true;
      repeatInterval: "daily" | "weekly" | "monthly" | "yearly";
      repeatCount: number;
    }
  | {
      repeat: false;
    }
);
type TApiParams = {
  action: "create-event";
  options: TFormDataEvent;
} | {
    action: "put-event";
    options: TFormDataEventUpdate;
} | {
  action: "delete";
  options: {id:string|number}
};
