import { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function Timetable() {
  const [timetables, setTimetables] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [selectedDay, setSelectedDay] = useState("Monday");

  const addTask = () => {
    setTimetables({
      ...timetables,
      [selectedDay]: [...timetables[selectedDay], { hh: "", mm: "", period: "AM", task: "" }],
    });
  };

  const deleteTask = (index) => {
    setTimetables({
      ...timetables,
      [selectedDay]: timetables[selectedDay].filter((_, i) => i !== index),
    });
  };

  const copyTimetable = (sourceDay) => {
    setTimetables((prev) => {
      const newTimetables = { ...prev };
      Object.keys(newTimetables).forEach((day) => {
        if (day !== sourceDay) {
          newTimetables[day] = [...prev[sourceDay]];
        }
      });
      return newTimetables;
    });
  };

  const saveAsPDF = () => {
    const doc = new jsPDF();
    doc.text(`Timetable for ${selectedDay}`, 10, 10);
    
    const tableData = timetables[selectedDay].map((task) => [
      `${task.hh}:${task.mm} ${task.period}`,
      task.task,
    ]);

    doc.autoTable({
      head: [["Time", "Task"]],
      body: tableData,
      startY: 20,
      styles: { cellPadding: 5, fontSize: 12 },
    });

    doc.save(`${selectedDay}_timetable.pdf`);
  };

  const saveAllTimetablesAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Weekly Timetable", 10, 10);
    let startY = 20;

    Object.keys(timetables).forEach((day) => {
      if (timetables[day].length > 0) {
        doc.text(day, 10, startY);
        const tableData = timetables[day].map((task) => [
          `${task.hh}:${task.mm} ${task.period}`,
          task.task,
        ]);
        doc.autoTable({
          head: [["Time", "Task"]],
          body: tableData,
          startY: startY + 5,
          styles: { cellPadding: 5, fontSize: 12 },
        });
        startY = doc.lastAutoTable.finalY + 10;
      }
    });

    doc.save("Weekly_Timetable.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-16">Daily Timetable</h1>
      <select
        className="mb-4 p-2 border rounded-lg"
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
      >
        {Object.keys(timetables).map((day) => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => copyTimetable(selectedDay)}
      >
        Copy Timetable to All Days
      </button>
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        {timetables[selectedDay].map((task, index) => (
          <div key={index} className="flex justify-between items-center mb-2 gap-4">
            <input
              type="number"
              className="border p-2 w-1/6 rounded "
              value={task.hh}
              placeholder="HH"
              onChange={(e) => {
                const newTasks = [...timetables[selectedDay]];
                newTasks[index].hh = e.target.value;
                setTimetables({ ...timetables, [selectedDay]: newTasks });
              }}
            />
            <input
              type="number"
              className="border p-2 w-1/6 rounded mr-2"
              value={task.mm}
              placeholder="MM"
              onChange={(e) => {
                const newTasks = [...timetables[selectedDay]];
                newTasks[index].mm = e.target.value;
                setTimetables({ ...timetables, [selectedDay]: newTasks });
              }}
            />
            <select
              className="border p-2 w-1/6 rounded"
              value={task.period}
              onChange={(e) => {
                const newTasks = [...timetables[selectedDay]];
                newTasks[index].period = e.target.value;
                setTimetables({ ...timetables, [selectedDay]: newTasks });
              }}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            <input
              type="text"
              className="border p-2 w-2/3 rounded"
              value={task.task}
              placeholder="Task"
              onChange={(e) => {
                const newTasks = [...timetables[selectedDay]];
                newTasks[index].task = e.target.value;
                setTimetables({ ...timetables, [selectedDay]: newTasks });
              }}
            />
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => deleteTask(index)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={addTask}
        >
          Add Task
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-2"
          onClick={saveAsPDF}
        >
          Save as PDF
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded mt-4 ml-2"
          onClick={saveAllTimetablesAsPDF}
        >
          Save Weekly Timetable as PDF
        </button>
      </div>
    </div>
  );
}
