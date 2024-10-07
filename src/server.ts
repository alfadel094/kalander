import express from "express";
import eventsRouter from "./events.router";

const app = express();

// Static assets
app.use(express.static('static'));
app.use(express.json())
app.use("/api/v1/event", eventsRouter);

app.get("/", (req, res)=>{
    res.redirect("/calender.html")
})

const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`Server started http://localhost:${port}`);
    console.log(`http://localhost:${port}/calender.html`);
})