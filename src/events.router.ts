import { Router } from "express";
import { DeleteEvent, batchUpdateEvents, createEvent, getEvents, putEvent } from "./events.controller";
const eventsRouter = Router();

eventsRouter.get("/", getEvents);
eventsRouter.post("/", createEvent);
eventsRouter.put("/:id", putEvent);
eventsRouter.delete("/:id", DeleteEvent);
eventsRouter.patch("/:id/:groupid", batchUpdateEvents);

export default eventsRouter