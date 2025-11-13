import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../UserContext"

// Connect to Socket.IO backend
const socket = io(import.meta.env.VITE_API_URL); // adjust if backend runs on a different port

const Chat = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const userId = userInfo?.id;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [mood, setMood] = useState("neutral");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for bot replies
  useEffect(() => {
    socket.on("receiveMessage", ({ botReply, moodAfter }) => {
      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
      setMood(moodAfter || mood);
    });

    return () => socket.off("receiveMessage");
  }, [mood]);

  // Simple keyword-based mood detection
  const detectMood = (text) => {
    const lower = text.toLowerCase();
    if (/(sad|unhappy|low|depressed)/.test(lower)) return "sad";
    if (/(happy|glad|joy|excited)/.test(lower)) return "happy";
    if (/(angry|mad|frustrated)/.test(lower)) return "angry";
    if (/(anxious|nervous|worried)/.test(lower)) return "anxious";
    if (/(tired|sleepy|exhausted)/.test(lower)) return "tired";
    if (/(stressed|overwhelmed)/.test(lower)) return "stressed";
    return "neutral";
  };

  // Send message to backend
  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input;
    const detectedMood = detectMood(userMessage); // detect mood from message

    // Add user message locally
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    // Emit message with detected mood
    socket.emit("sendMessage", { userId, message: userMessage, mood: detectedMood });
  };

  return (

    <>

       <div className="bg-gradient-to-br from-[#FFECCB] via-[#FFD6A5] to-[#efcab6] h-[92.2vh] text-gray-900 flex flex-col items-center justify-center px-6 py-12">

      <div className="flex flex-col w-full max-w-2xl mx-auto h-[80vh] bg-gray-700 border rounded-2xl shadow-md p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 border-b pb-2">
          <h2 className="text-xl font-semibold text-white">Chatbot</h2>
         <span
  className={`px-3 py-1 rounded-full text-sm font-medium ${
    mood === "happy"
      ? "bg-blue-800 text-white"
      : mood === "sad"
      ? "bg-gray-800 text-white"
      : mood === "angry"
      ? "bg-red-800 text-white"
      : mood === "anxious"
      ? "bg-purple-800 text-white"
      : mood === "tired"
      ? "bg-gray-900 text-white"
      : mood === "stressed"
      ? "bg-pink-800 text-white"
      : "bg-gray-200 text-gray-800"
  }`}
>
  {mood.charAt(0).toUpperCase() + mood.slice(1)}
</span>

        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-3 space-y-2 px-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-2xl max-w-[75%] break-words ${msg.sender === "user"
                  ? "bg-amber-200 text-black rounded-br-none"
                  : "bg-amber-50 text-gray-900 rounded-bl-none"
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your mood..."
            className="flex-1 border bg-gray-300 border-amber-100 rounded-xl p-2 focus:outline-none  resize-none h-12"
          />
          <button
            onClick={handleSend}
            className="bg-[#FFD6A5] text-black px-4 py-2 rounded-xl hover:bg-amber-100 transition"
          >
            Send
          </button>
        </div>
      </div>
       </div>
    </>
  );
};

export default Chat;