import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";  // adjust path if needed

const RecommendationPage = () => {
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const { userInfo } = useContext(UserContext);

  const moods = ["happy", "sad", "anxious", "angry", "stressed", "tired"];
  const categories = ["movie", "book", "music"];

  const handleGetRecommendation = async (cat) => {
    try {
      setLoading(true);
      setCategory(cat);

      const userId = userInfo?.id;
      if (!userId) {
        alert("Please log in first.");
        setLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:4000/api/recommendations/getRecommendation", {
        userId,
        mood,
        category: cat,
      });

      setRecommendation(res.data.data?.recommendation || res.data.recommendation);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setRecommendation("Sorry, could not fetch recommendation right now.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get the prefix text for recommendation
  const getRecommendationPrefix = () => {
    if (category === "movie") return "Watch this movie :"
    if (category === "book") return "Read this book :";
    if (category === "music") return "Listen to this music :";
    return "";
  };

  return (
    <div className="bg-gradient-to-br from-[#FFECCB] via-[#FFD6A5] to-[#efcab6] h-[92.2vh] text-gray-900 flex flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl text-center">

        {/* Step 1: Mood Selection */}
        {!mood && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              How are you feeling today?
            </h2>

            <div className="grid grid-cols-3 gap-3 w-full">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className="bg-[#FFD6A5] hover:bg-[#FFC085] text-gray-800 font-medium py-2 px-4 rounded-xl shadow-md transition"
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Category Selection */}
        {mood && !category && (
          <div className="flex flex-col items-center mt-3 space-y-8">
            <h3 className="text-xl font-bold text-gray-700">
              You’re feeling <span className="text-[#FF8A65] font-bold">{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>! What would you like to do?
            </h3>

            <div className="flex gap-5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleGetRecommendation(cat)}
                  className="bg-[#FFD6A5] hover:bg-[#FFB085] text-gray-800 font-medium py-2 px-4 rounded-xl shadow-md transition"
                >
                  {cat === "movie" ? "Watch a Movie" :
                    cat === "book" ? "Read a Book" :
                      "Listen to Music"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Display Recommendation */}
        {loading && <p className="mt-6 text-gray-700">Loading recommendation...</p>}

        {!loading && recommendation && (
          <div className="mt-4 bg-[#FFF4E1] rounded-2xl shadow p-6 w-full">
            {/* Static text above recommendation */}
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Here’s something for you based on your mood and choice:
            </p>

            <h3 className="text-xl font-bold text-gray-700 mb-2">Recommended for you:</h3>
            <h3 className="text-xl font-semibold text-[#FF7043]">
              {getRecommendationPrefix()} {recommendation}
            </h3>

            <button
              className="mt-6 bg-[#FFD6A5] hover:bg-[#FFC085] text-gray-800 py-2 px-4 rounded-xl shadow-md transition"
              onClick={() => {
                setMood("");
                setCategory("");
                setRecommendation("");
              }}
            >
              Get Another Suggestion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPage;
