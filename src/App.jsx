import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎬 Movie Recommender Study
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome to our movie recommendation research study! 
            This application will help us understand how different recommendation systems affect user experience.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-blue-700 text-sm">
              ✅ Vite + React application successfully initialized<br/>
              ✅ Tailwind CSS configured<br/>
              ✅ Environment variables set up<br/>
              ✅ Ready for development
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
            Coming Soon - Sprint 2
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
