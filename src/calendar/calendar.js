import React from "react";
import { format, setDate, getDay, addMonths } from "date-fns";
import { db } from "../utils/firebase";

const FAKEDATA = [
  { id: "abc", subject: "hello", txt: "blahblahbalbha", date: 9 },
  { id: "abc", subject: "yo", txt: "lorem", date: 11 }
];

function AddForm({ addEvent }) {
  let [subject, setSubject] = React.useState("");
  const onsubmit = event => {
    event.preventDefault();
    addEvent(subject);
  };
  return (
    <div className="AddForm" onSubmit={onsubmit}>
      <form>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <button>ADD</button>
      </form>
    </div>
  );
}

function Calendar() {
  let [today, setToday] = React.useState(new Date());
  let [selectedDate, setSelectedDate] = React.useState(undefined);
  let [events, setEvents] = React.useState([]);

  async function loadEvents() {
    console.log("loading events");
    let firstOfMonth = setDate(today, 1).getTime();
    let lastOfMonth = addMonths(setDate(today, 1), 1).getTime();
    let snapshot = await db
      .collection("calendar-todos")
      .where("date", ">=", firstOfMonth)
      .where("date", "<=", lastOfMonth)
      .get();
    setEvents(snapshot.docs);
    console.log("new events");
  }
  React.useEffect(() => {
    console.log("use effect");
    loadEvents();
  }, [today]);

  const dayOfFirst = getDay(setDate(today, 1));

  const addEvent = subject => {
    let obj = { id: new Date().getTime(), subject, date: selectedDate };
    setEvents([...events, obj]);
    setSelectedDate(undefined);
  };

  return (
    <div className="Calendar">
      <h1>
        <button onClick={() => setToday(addMonths(today, -1))}>&lt;</button>
        {format(today, "YYYY MMM")}
        <button onClick={() => setToday(addMonths(today, 1))}>&gt;</button>
      </h1>
      <div className="cells">
        {["su", "mo", "tu", "w", "th", "f", "sa"].map(v => (
          <div key={v} className="header">
            {v}
          </div>
        ))}
        {new Array(dayOfFirst).fill(0).map((_, i) => (
          <div key={i} />
        ))}
        {new Array(30).fill(0).map((_, i) => (
          <div key={i} onClick={() => setSelectedDate(i + 1)}>
            <div className="dateNum">{i + 1}</div>
            {events
              .filter(v => {
                return new Date(v.data().date).getDate() == i + 1;
              })
              .map(v => (
                <div key={v.id} className="event">
                  {v.data().subject}
                  {}
                </div>
              ))}
          </div>
        ))}
      </div>

      {selectedDate && <AddForm addEvent={addEvent} />}
    </div>
  );
}

export default Calendar;
