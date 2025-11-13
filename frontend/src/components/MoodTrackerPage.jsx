import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MoodTrackerPage = () => {
  const { userInfo } = useContext(UserContext);
  const userId = userInfo?.id;

  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const moodOptions = [
    { emoji: "😄", label: "Happy" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😟", label: "Stressed" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😡", label: "Angry" },
    { emoji: "😴", label: "Tired" },
  ];

  const moodValueMap = {
    Happy: 5,
    Calm: 4,
    Stressed: 2,
    Sad: 1,
    Angry: 0,
    Tired: 3,
  };

  const moodColorMap = {
    Happy: "#FFD700",    // Yellow
    Sad: "#1E90FF",      // Blue
    Calm: "#32CD32",     // Green
    Stressed: "#808080", // Grey
    Angry: "#FF4500",    // Red-Orange
    Tired: "#800080",    // Purple
    default: "#A9A9A9",  // Dark Grey
  };

  const fetchMoodHistory = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(`http://localhost:4000/api/moodTracker/${userId}`);
      setMoodHistory(data);
    } catch (err) {
      console.error("Error fetching mood history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!mood || !userId) return;

    try {
      await axios.post("http://localhost:4000/api/moodTracker", {
        userId,
        mood,
        note,
      });

      await fetchMoodHistory();
      setSubmitted(true);
      setMood("");
      setNote("");
    } catch (err) {
      console.error("Error saving mood:", err);
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, [userId]);

  if (loading) return <p className="text-center mt-12">Loading...</p>;

  if (!userId) {
    return <p className="text-center mt-12 text-gray-700">Please log in to track your mood.</p>;
  }

  // Flatten all moods from all documents
  const flattenedMoods = moodHistory.flatMap(doc =>
    doc.moods.map(m => ({
      mood: m.mood,
      note: m.note,
      timestamp: m.timestamp,
      date: doc.date, // keep the document date
    }))
  );

  // Sort by timestamp
  flattenedMoods.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Prepare chart data
  const chartData = {
    labels: flattenedMoods.map(entry =>
      new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    ),
    datasets: [
      {
        label: "Mood",
        data: flattenedMoods.map(entry => moodValueMap[entry.mood] || 3),
        backgroundColor: flattenedMoods.map(entry => moodColorMap[entry.mood] || moodColorMap.default),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            return flattenedMoods[index].mood; // only show mood name
          },
        },
      },
      title: {
        display: true,
        text: flattenedMoods.length > 0 ? `Date: ${new Date(flattenedMoods[0].date).toLocaleDateString()}` : "",
        align: "start", // top-left
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      y: { min: 0, max: 5, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="bg-gradient-to-br from-[#FFECCB] via-[#FFD6A5] to-[#efcab6] h-[92.2vh] flex flex-col items-center justify-center px-6 py-12">
      {!submitted && (
        <>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Track Your Mood</h1>
          <p className="text-lg text-gray-800 text-center max-w-2xl mb-8">
            How are you feeling today? Select your mood and add a quick note about your day.
          </p>
        </>
      )}

      {!submitted ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <div className="flex justify-center flex-wrap gap-4 mb-6">
            {moodOptions.map(m => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                className={`px-6 py-3 rounded-lg shadow-md w-36 text-center transition ${
                  mood === m.label
                    ? "bg-gray-900 text-white scale-105"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Write a short note about your day..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full h-28 p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 mb-6 resize-none"
          ></textarea>

          <button
            onClick={handleSubmit}
            className="bg-black text-gray-100 font-bold px-8 py-3 rounded-lg shadow hover:bg-gray-800 transition"
          >
            Save Mood
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Your Mood Over Time</h2>
          {flattenedMoods.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p className="text-center text-gray-600">No mood data available.</p>
          )}

          <div className="flex justify-center">
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 bg-[#FFD6A5] text-black font-semibold px-8 py-3 rounded-xl hover:bg-gray-200 transition duration-300 shadow-md"
            >
              Track Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTrackerPage;
