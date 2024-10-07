import { PrismaClient, Event } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createEvent = async (req: Request, res: Response) => {
  try {
    const eventPayload: Event = req.body;
    
    if (eventPayload.interval) {
      const oldestEvent = (await prisma.event.findFirst({
        orderBy: { id: "desc" },
      })) || { id: 0 };
      const groupId = `group_${oldestEvent.id + 1}`;
      eventPayload.groupId = groupId;

      const events: Event[] = [];
      const datesToCreate = calculateDates(
        eventPayload.start,
        eventPayload.end,
        (eventPayload.interval || "daily") as
          | "daily"
          | "weekly"
          | "monthly"
          | "yearly",
        eventPayload.repeatIntervalFor || 1
      );
      for (let i = 0; i < datesToCreate.length; i++) {
        const date = datesToCreate[i];
        events.push(
          await prisma.event.create({
            data: {
              ...eventPayload,
              start: date,
              end: date,
            },
          })
        );
      }
      res.status(200).json({
        success: true,
        status: 201,
        data: events,
      });
      return;
    }

    const event = await prisma.event.create({ data: eventPayload });

    res.status(200).json({
      success: true,
      status: 201,
      data: event,
    });
  } catch (error) {
    console.log(error);

    res.status(200).json({
      success: false,
      status: 500,
      error: "Could not create event",
    });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  const start = new Date(req.query.start as string);
  const end = new Date(req.query.end as string);
  const state = req.query.state as string;
  // const { page = 1, pageSize = 10, startDate, endDate, type, state } = req.query;
  // const offset = ((page as number) - 1) * (pageSize as number);
  // let where = {};
  // if (state) {
  //   where = {
  //       ...where,
  //       state: Array.isArray(state) ? {in: state} : state,
  //     };
  // }
  // if (startDate && endDate) {
  //   where = {
  //     ...where,
  //     startsAt: {
  //       gte: new Date(startDate as string),
  //       lte: new Date(endDate as string),
  //     },
  //   };
  // }
  // if (type) {
  //   where = {
  //     ...where,
  //     type: type.toString(), // Assuming type is a string
  //   };
  // }
  try {
    const events = await prisma.event.findMany({
      where: {
        ...(state ? {state: state}:{}),
        OR: [
          {
            start: {
              gte: start,
              lte: end,
            },
          },
          {
            start: {
              lte: end,
            },
            end: {
              gte: end,
            },
          },
        ],
      },
    });
    // where,
    // orderBy: {
    //   start: "desc", // or 'desc' based on your preference
    // },
    // take: +pageSize as number,
    // skip: +offset,
    res.json(
      events.map((event) => {
        // if (event.state == "done") {
          
          // console.log({event});
        // }
        
        return {
        ...event,
        backgroundColor: 
          event.state === "done"
            ? "green"
            : event.state === "cancelled"
            ? "red"
            : "",
            end: event.end || event.start
      }
      //   return {
      //   ...event,
      //   className: (event.className || "") + 
      //     event.state === "done"
      //       ? " done"
      //       : event.state === "cancelled"
      //       ? " cancelled"
      //       : "",
      // }
    })
    );
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      status: 500,
      error: "Could not retrieve events",
    });
  }
};

export const putEvent = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id as number;
    const eventPayload: Event = req.body;
    const event = await prisma.event.update({
      where: { id },
      data: eventPayload,
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: event,
    });
  } catch (error) {
    console.log({error});
    res.status(200).json({
      success: false,
      status: 500,
      error: "Could not update event",
    });
  }
};

function calculateDates(
  start: string | Date,
  end: string | Date,
  interval: "daily" | "weekly" | "monthly" | "yearly",
  numberOfPeriodsBetweenIntervals: number
) {
  
  const datesToCreate = [];
  let endDate = new Date(end);
  let currentDate = new Date(start);

  while (currentDate <= endDate) {
    datesToCreate.push(new Date(currentDate));
    switch (interval) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + numberOfPeriodsBetweenIntervals);
        break;
      case "weekly":
        currentDate.setDate(currentDate.getDate() + numberOfPeriodsBetweenIntervals * 7);
           
        break;
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + numberOfPeriodsBetweenIntervals);
        break;
      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + numberOfPeriodsBetweenIntervals);
        break;
      default:
        throw new Error(`Invalid interval: ${interval}`);
    }
  }

 return datesToCreate;
}                         

export const DeleteEvent = async (req: Request, res: Response) =>{

  try {
    const id = req.params.id;
    if (id.startsWith("group_")) {
      await prisma.event.deleteMany({
        where: { groupId: id.trim() }
      })
    }else {
      await prisma.event.delete({
        where: { id: +id }
      })
    }
    res.status(200).json({
      success: true,
      status: 200
    });
    return
  } catch (error) {
    console.log({error});
    
    res.status(200).json({
      success:false,
      status: 500,
      error: "Couldn't delete"
    })
  }
}

export const batchUpdateEvents = async (req: Request, res: Response) =>{
  try {
    const id = +req.params.id as number;
    const groupId = req.params.groupid as string;
    const eventPayload: Event = req.body;
    console.log(eventPayload);
    
    if (typeof eventPayload.comments ==="undefined") {
      res.status(200).json({
        success: false,
        status: 400,
        error: "Invalid input for comments",
      });
      return;
    }
    const events = await prisma.event.updateMany({
      where: { groupId },
      data: {
        comments: eventPayload.comments
      },
    });
    
    res.status(200).json({
      success: true,
      status: 200,
      data: events,
    });
  } catch (error) {
    console.log({error});
    res.status(200).json({
      success: false,
      status: 500,
      error: "Could not batch update the events",
    });
  }
}