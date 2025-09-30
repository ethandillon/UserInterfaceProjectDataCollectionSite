const MovieSelection = ({ userData }) => {
  const { name, studentId, group } = userData

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {name}!
          </h1>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-green-700">
              ✅ Successfully registered for the study
            </p>
            <p className="text-green-600 text-sm mt-2">
              Student ID: {studentId} | Group: {group} | 
              Type: {group === 'A' ? 'Static Recommender' : 'Adaptive Recommender'}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              Coming in Sprint 3: Movie Selection
            </h2>
            <p className="text-blue-700 mb-4">
              This is where you'll browse and select movies. The interface will show:
            </p>
            <ul className="text-left text-blue-600 space-y-2 max-w-md mx-auto">
              <li>• Grid of movie posters with titles and genres</li>
              <li>• Click to select movies you like</li>
              <li>• {group === 'A' ? 'Static recommendations (movies stay the same)' : 'Adaptive recommendations (new movies appear based on your choices)'}</li>
              <li>• Progress indicator (select 5 movies total)</li>
            </ul>
          </div>

          <div className="mt-8">
            <button 
              className="bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
              disabled
            >
              Movie Selection - Available in Sprint 3
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieSelection