import { useState } from 'react'
import { logToSheet, createParticipantRecord, generateRandomGroup } from '../utils/dataLogger'

const UserInputForm = ({ onUserSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim() || !formData.studentId.trim()) {
      setError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const group = generateRandomGroup()
      const timestamp = new Date().toISOString()
      
      const participantData = createParticipantRecord(
        formData.name,
        formData.studentId,
        group
      )

      // Log to Google Sheet via sheet.best
      const response = await logToSheet(participantData)

      if (response.status === 200) {
        // Pass data to parent component to continue the flow
        onUserSubmit({
          name: formData.name,
          studentId: formData.studentId,
          group: group,
          timestamp: timestamp
        })
      }
    } catch (error) {
      console.error('Error submitting user data:', error)
      setError('Failed to submit data. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎬 Movie Recommender Study
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome! We're conducting research on movie recommendation systems. 
            Your participation will help us understand how different approaches affect user experience.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-800 mb-2">What to expect:</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Browse and select 5 movies you like</li>
              <li>• Answer a brief survey about your experience</li>
              <li>• Learn about the study afterwards</li>
              <li>• Takes about 5-10 minutes</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
              Student ID *
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your student ID"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting Study...
              </span>
            ) : (
              'Begin Movie Selection'
            )}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>By proceeding, you consent to participate in this research study.</p>
          <p>Your data will be used for academic research purposes only.</p>
        </div>
      </div>
    </div>
  )
}

export default UserInputForm