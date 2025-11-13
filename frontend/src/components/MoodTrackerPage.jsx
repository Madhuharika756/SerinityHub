import React, { useState } from "react";

const MoodTrackerPage = () => {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (mood) {
      setSubmitted(true);
    }
  };

  const moodOptions = [
    { emoji: "😄", label: "Happy" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😟", label: "Stressed" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😡", label: "Angry" },
  ];

  return (
    <>
      <div className="bg-[#FFD6A5] h-[92.2vh] text-gray-900 flex flex-col items-center justify-center px-6 py-12">
        {!submitted && (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
              Track Your Mood
            </h1>
            <p className="text-lg text-gray-800 text-center max-w-2xl mb-8">
              How are you feeling today? Select your mood and add a quick note about your day.
            </p>
          </>
        )}

        {!submitted ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
            <div className="flex justify-center flex-wrap gap-4 mb-6">
              {moodOptions.map((m) => (
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
              onChange={(e) => setNote(e.target.value)}
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
          <div className="bg-black p-10 rounded-2xl shadow-lg text-center max-w-md text-gray-200">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Thank you for sharing✨
            </h2>

            <p className="text-lg mb-2">
              Your mood for today:{" "}
              <b className="text-white text-xl">{mood}</b>
            </p>

            <p className="italic text-gray-300 mb-6">
              “{note || "No note added"}”
            </p>

            <button
              onClick={() => {
                setMood("");
                setNote("");
                setSubmitted(false);
              }}
              className="bg-[#FFD6A5] text-black font-semibold px-8 py-3 rounded-xl hover:bg-gray-200 transition duration-300 shadow-md"
            >
              Track Again
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MoodTrackerPage;
