const Debrief = ({ userData }) => {
  const { name, group } = userData

  const handleStartOver = () => {
    // Reload the page to start fresh
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-green-500 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Study Complete - Thank You!
            </h1>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <p className="text-green-700 font-semibold">
                ✅ Your participation has been recorded successfully
              </p>
              <p className="text-green-600 text-sm mt-2">
                Participant: {name} | Group: {group}
              </p>
            </div>
          </div>

          {/* Study Explanation */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                🎬 What This Study Was About
              </h2>
              <p className="text-blue-700 mb-4">
                You just participated in a research study comparing two different types of movie recommendation systems:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Group A: Static Recommender</h3>
                  <p className="text-blue-600 text-sm">
                    Movies remained the same throughout your selections. The system reshuffled the same 
                    set of movies after each selection, removing your chosen movies from view but not 
                    adding any new recommendations based on your preferences.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Group B: Adaptive Recommender</h3>
                  <p className="text-blue-600 text-sm">
                    Movies changed after each selection to better match your preferences. About 80% of 
                    new recommendations matched the genres of movies you selected, with 20% diverse options 
                    to maintain variety.
                  </p>
                </div>
              </div>
              <p className="text-blue-700 mt-4">
                <strong>You were in Group {group}</strong> ({group === 'A' ? 'Static' : 'Adaptive'} Recommender)
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                🔬 Research Goals
              </h2>
              <p className="text-yellow-700 mb-4">
                Our goal was to measure and compare:
              </p>
              <ul className="text-yellow-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span><strong>Perceived helpfulness</strong> of each recommendation approach</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span><strong>User satisfaction</strong> with the movie selection experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span><strong>Trust and personalization</strong> perceptions between static vs. adaptive systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span><strong>Ease of use</strong> and likelihood to use such systems again</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                📊 Your Data & Privacy
              </h2>
              <p className="text-purple-700 mb-4">
                The following information was collected during your session:
              </p>
              <ul className="text-purple-700 space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Your name and student ID (for research tracking only)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Which experimental group you were assigned to</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Movies you selected and their genres</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Timestamps of your interactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Your survey responses about the experience</span>
                </li>
              </ul>
              <p className="text-purple-700 text-sm">
                <strong>Privacy Note:</strong> All data is collected for research purposes only and will be 
                anonymized for analysis. Your personal information will not be shared or used for any 
                commercial purposes.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📧 Questions or Concerns?
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this study, your participation, or would like to know 
                about the results when they're available, please feel free to contact:
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-300">
                <p className="text-gray-700">
                  <strong>Research Team Contact:</strong><br />
                  edillon7@students.kennesaw.edu<br />
                  mkenne56@students.kennesaw.edu<br />
                  nwatki16@students.kennesaw.edu<br />
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thank you for contributing to our research!
              </h3>
              <p className="text-gray-600">
                Your participation helps us understand how people interact with recommendation systems 
                and will contribute to better design in the future.
              </p>
              <button
                onClick={handleStartOver}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Start New Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debrief