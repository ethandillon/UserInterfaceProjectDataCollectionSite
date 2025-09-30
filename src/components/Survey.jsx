const Survey = ({ userData }) => {
  const { name, group } = userData

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Survey
          </h1>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-green-700">
              ✅ Movie selection completed!
            </p>
            <p className="text-green-600 text-sm mt-2">
              {name} | Group: {group} | 5 movies selected
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              Coming in Sprint 4: Survey Form
            </h2>
            <p className="text-blue-700 mb-4">
              This is where you'll answer questions about your experience:
            </p>
            <ul className="text-left text-blue-600 space-y-2 max-w-md mx-auto">
              <li>• Helpfulness rating (1-10)</li>
              <li>• Satisfaction with recommendations</li>
              <li>• Ease of use</li>
              <li>• Personalization perception</li>
              <li>• Trust in the system</li>
              <li>• Open-ended feedback</li>
            </ul>
          </div>

          <div className="mt-8">
            <button 
              className="bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
              disabled
            >
              Survey Form - Available in Sprint 4
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Survey