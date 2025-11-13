const About = () => {
  return (
    <div className="bg-gradient-to-br from-[#FFECCB] via-[#FFD6A5] to-[#efcab6] h-[92.2vh] text-gray-900 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">About SerenityHub</h1>
      <p className="text-lg text-gray-900 max-w-3xl text-center mb-6">
        SerenityHub is your personal wellness companion designed to help you track your moods, reflect on your daily experiences, and receive personalized recommendations for a healthier and happier life.
      </p>
      <p className="text-lg text-gray-900 max-w-3xl text-center mb-8">
        Our app provides features like Mood Tracking, Insights, Journaling, and Recommendations, all tailored to help you understand yourself better and achieve a balanced lifestyle.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-gray-700 p-6 rounded-lg shadow-md w-64 text-center hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2 text-white">Mood Tracker</h2>
          <p className="text-gray-300">Log your daily moods and monitor patterns over time.</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md w-64 text-center hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2 text-white">Insights</h2>
          <p className="text-gray-300">Receive visual insights and reports about your emotional well-being.</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md w-64 text-center hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2 text-white">Journal</h2>
          <p className="text-gray-300">Reflect on your thoughts and record daily experiences.</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md w-64 text-center hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2 text-white">Recommendations</h2>
          <p className="text-gray-300">Get personalized tips to improve your mental and emotional well-being.</p>
        </div>
      </div>
    </div>
  )
}

export default About;
