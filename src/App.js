import { useEffect, useState } from "react";
import "./App.css";
import myData from "./events.json";

function App() {
  const [formatTimeStamphead, setFormatTime] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimeZone, setSelectedTimezone] = useState("Asia/Kolkata");

  useEffect(() => {
    const formatHead = () => {
      const options = {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: selectedTimeZone,
      };
      const timestamp = new Intl.DateTimeFormat("en-US", options).format(
        new Date()
      );
      setFormatTime(timestamp);
    };

    formatHead();
    const intervalId = setInterval(formatHead, 1000);

    return () => clearInterval(intervalId);
  }, [selectedTimeZone]);

  const getWeekDays = (date) => {
    const options = {
      weekday: "short",
      day: "numeric",
      month: "numeric",
    };
    const days = [];
    date = new Date(date);

    const firstDayOfWeek =
      date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    date.setDate(firstDayOfWeek);

    for (let i = 0; i < 5; i++) {
      days.push(
        new Intl.DateTimeFormat("en-US", options).format(new Date(date))
      );
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleTimeZoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const weekDays = getWeekDays(currentDate);

  const generateTimeSlots = () => {
    const timeSlots = [];
    const startDate = new Date();
    startDate.setHours(8, 0, 0, 0);

    for (let i = 0; i <= 30; i++) {
      const time = new Date(startDate.getTime() + i * 30 * 60 * 1000);
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      timeSlots.push(formattedTime);
    }

    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  function isDatePassed(dateToCheck) {
    const day = dateToCheck.split(" ")[1].split("/")[1];
    const month = dateToCheck.split(" ")[1].split("/")[0];
    const year = new Date().getFullYear();
    const hour = new Date().getHours();
    const minute = new Date().getMinutes() + 2;
    const second = new Date().getSeconds();

    const formattedTime = `${formatDigit(hour)}:${formatDigit(
      minute
    )}:${formatDigit(second)}`;

    function formatDigit(digit) {
      return digit < 10 ? `0${digit}` : digit;
    }
    const dateToCheckObj = new Date(`${year}-${month}-${day} ${formattedTime}`);
    const current = new Date();

    return current < dateToCheckObj;
  }

  function isDateEqual(jday, day, jtime, time) {
    const month1 = jday.split("-")[1];
    const day1 = jday.split("-")[2];
    const month2 = day.split(" ")[1].split("/")[0];
    const day2 = day.split(" ")[1].split("/")[1];

    const twelveHourTime = new Date(
      `2022-01-01T${jtime}:00`
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    if (month1 === month2 && day1 === day2 && twelveHourTime === time) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <nav className="m-4">
        <div className="flex text-xl  shadow-2xl ">
          <div className="flex p-4 w-4/5">
            <div className="w-1/2 text-start">
              <button
                onClick={handlePreviousWeek}
                className="p-2 hover:p-3 bg-cyan-500 text-white shadow shadow-blue-500/40 hover:shadow-indigo-500/40 rounded-lg"
              >
                Previous Week
              </button>
            </div>
            <p className="w-1/2 p-2">{formatTimeStamphead}</p>
          </div>
          <div className="p-4 w-1/5 text-end">
            <button
              onClick={handleNextWeek}
              className="text-left p-2 hover:p-3 bg-cyan-500 text-white shadow shadow-blue-500/40 hover:shadow-indigo-500/40 rounded-lg"
            >
              Next Week
            </button>
          </div>
        </div>
      </nav>
      <section>
        <div className="mx-4">
          <label htmlFor="timezone">
            Timezone :
            <select
              className="w-full p-2 text-lg shadow-lg"
              value={selectedTimeZone}
              onChange={handleTimeZoneChange}
            >
              <option value="Asia/Kolkata">Indian Standard Time</option>
              <option value="America/New_York">Eastern Standard Time</option>
            </select>
          </label>
        </div>
        <div>
          {weekDays.map((day, index) => {
            return (
              <div className="flex m-4" key={index}>
                <div className="text-center p-2 text-xl border-2 border-slate-500 w-28">
                  {day}
                </div>
                <div className="w-full border-2 border-slate-500">
                  {isDatePassed(day) ? (
                    <ul className="flex gap-2 flex-wrap">
                      {timeSlots.map((time, index) => {
                        const hasData = myData?.some((data) =>
                          isDateEqual(data.Date, day, data.Time, time)
                        );
                        return hasData ? (
                          <li key={index} className="flex gap-1 text-cyan-400">
                            <p>Booked</p>
                            <label htmlFor="time">{time}</label>
                          </li>
                        ) : (
                          <li key={index}>
                            <input
                              type="checkbox"
                              className="mx-1 h-3"
                              name="time"
                            />
                            <label htmlFor="time">{time}</label>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-center">Past</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default App;
