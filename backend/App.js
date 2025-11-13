const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const cookieParser = require('cookie-parser');

const http = require('http');
const Chat = require('./models/Chat');

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  }).catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

app.use(cors({credentials: true, origin:process.env.CORS_URL}));
app.use(express.json());
app.use(cookieParser());  

app.get('/', (req,res)=>{
    res.send("backend..");
})

app.post('/register', async (req,res)=>{
    const {username, emailId, password} = req.body;
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    const userDoc = await User.create({
        username: username,
        emailId:emailId, password:bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
})

app.post('/login', async(req, res)=>{
  const {emailId, password} = req.body;
  const userDoc = await User.findOne({emailId});
  const passOk = await bcrypt.compareSync(password, userDoc.password);
  if(passOk){
      const token = jwt.sign({emailId, id:userDoc._id}, secret);
      res.cookie('token', token).json({
          id: userDoc._id,
          emailId,
      });
  }else{
      res.status(400).json('wrong credentials');
  }
})

app.get('/profile', (req,res)=>{
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info)=>{
      res.json(info);
  })
})

app.post('/logout', (req,res)=>{
  res.cookie('token', '').json('ok');
})

// chatbot
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
  cors: { origin: "*" }
});

// Rule-based bot responses (no API keys)
const responses = {
  sad: [
    `I know things feel tough right now, but every storm runs out of rain. Remember the challenges you’ve overcome before—you are stronger than you think. Take a deep breath, and know that brighter days are coming.`,
    `It's okay to feel down sometimes. Even in moments of sadness, remember your achievements and the small joys around you. You have the courage to move forward, step by step.`,
    `Life has its ups and downs, but sadness is only temporary. Focus on the things you can control, cherish the small victories, and allow yourself to feel hope again. You’re not alone in this.`
  ],
  anxious: [
    `Take a deep breath and remind yourself that you are capable of handling challenges. Worries may feel overwhelming, but your resilience and past successes prove that you can overcome them.`,
    `Anxiety can cloud your mind, but grounding yourself in the present moment helps. Remember, your feelings are valid, but they do not define you. You have strength within you to face today.`,
    `It's natural to feel anxious sometimes. Focus on one step at a time, and allow yourself moments of calm. Believe in your ability to navigate through this with courage and patience.`
  ],
  angry: [
    `Anger is natural, but letting it control you can weigh you down. Take a few moments to breathe, channel your energy positively, and remind yourself that calm decisions lead to better outcomes.`,
    `Feeling frustrated is okay. Try to step back, reflect, and release tension through healthy actions. You are in charge of how you react, and you have the power to choose peace.`,
    `Remember that anger is temporary. Take deep breaths, focus on solutions, and remind yourself of what truly matters. Your inner strength can guide you to a calmer state.`
  ],
  happy: [
    `It's wonderful to see you happy! Embrace this joyful energy, spread positivity to those around you, and cherish every moment of delight today.`,
    `Happiness is contagious—let your joy shine and inspire others. Take a moment to savor the little things that bring you this feeling and keep it growing.`,
    `Celebrate your happiness! Recognize your achievements and allow this feeling to motivate you further. You deserve these uplifting moments.`
  ],
  tired: [
    `You’ve been working hard, and it’s okay to feel tired. Give yourself permission to rest, recharge, and care for your body and mind. Tomorrow is a new opportunity.`,
    `Rest is essential for growth. Even short breaks can refresh your energy and perspective. Listen to your body and rejuvenate so you can face challenges with strength.`,
    `Feeling exhausted is natural, but remember to prioritize self-care. Gentle rest, relaxation, and small pleasures can lift your spirits and restore balance.`
  ],
  stressed: [
    `Stress can feel overwhelming, but remember to take things one step at a time. Focus on what you can control, breathe deeply, and remind yourself of your past successes.`,
    `It's okay to feel stressed; you’re doing your best. Break tasks into smaller pieces, find moments of calm, and know that this too shall pass. You have the inner strength to cope.`,
    `When stress builds up, pause and care for yourself. Reflect on what matters most, let go of unnecessary worries, and remember that you are capable of handling challenges with grace.`
  ],
  neutral: [
    `How are you feeling today? I'm here to chat and lift your mood if you need.`,
    `Take a moment to check in with yourself. Small steps toward positivity can make a big difference.`,
    `Even on a neutral day, a kind thought or a deep breath can brighten your mindset.`
  ]
};

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async ({ userId, message, mood }) => {
    try {
      if (!userId) {
        console.error("Missing userId in chat message");
        return;
      }

      // determine mood
      const moodKey = mood && responses[mood] ? mood : "neutral";
      const moodResponses = responses[moodKey];
      const botReply =
        moodResponses[Math.floor(Math.random() * moodResponses.length)];
      const moodAfter = ["sad", "anxious", "stressed", "angry", "tired"].includes(moodKey)
        ? "hopeful"
        : moodKey;

      // check if user chat already exists
      let userChat = await Chat.findOne({ userId });

      if (!userChat) {
        // create new user chat document
        userChat = await Chat.create({
          userId,
          messages: [{ userMessage: message, botReply, moodBefore: moodKey, moodAfter }],
        });
        console.log("New chat created for user:", userId);
      } else {
        // append new message to existing user's messages
        userChat.messages.push({ userMessage: message, botReply, moodBefore: moodKey, moodAfter });
        await userChat.save();
        console.log("Chat updated for user:", userId);
      }

      socket.emit("receiveMessage", { botReply, moodAfter });
    } catch (err) {
      console.error("Error saving chat:", err);
      socket.emit("receiveMessage", {
        botReply: "Sorry, something went wrong while saving your chat.",
        moodAfter: mood,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
const recommendationRoutes = require('./routes/recommendationRoutes');
app.use('/api/recommendations', recommendationRoutes);


server.listen(4000, () => console.log("Server running on port 4000"));



app.listen(4000, ()=>{
    console.log("app is listening on 4000");
})

// R8ph3WtbMtkRTWO2
// mongodb+srv://madhuharikac_db_user:R8ph3WtbMtkRTWO2@cluster0.jmd9qli.mongodb.net/?appName=Cluster0
// ZMBbQ4tHcvQsiz6X
