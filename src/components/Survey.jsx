import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logToSheet } from '../utils/dataLogger'
import LoadingSpinner from './LoadingSpinner'

const Survey = ({ userData }) => {
  const navigate = useNavigate()
  const { name, studentId, group } = userData

  // Survey state
  const [surveyData, setSurveyData] = useState({
    helpfulness: '',
    satisfaction: '',
    ease: '',
    personalization: '',
    trust: '',
    reuse: '',
    openFeedback: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Likert scale options
  const likertOptions = [
    { value: 1, label: '1 - Strongly Disagree' },
    { value: 2, label: '2 - Disagree' },
    { value: 3, label: '3 - Somewhat Disagree' },
    { value: 4, label: '4 - Neither Agree nor Disagree' },
    { value: 5, label: '5 - Somewhat Agree' },
    { value: 6, label: '6 - Agree' },
    { value: 7, label: '7 - Strongly Agree' }
  ]

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing/selecting
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!surveyData.helpfulness) newErrors.helpfulness = 'Please rate the helpfulness'
    if (!surveyData.satisfaction) newErrors.satisfaction = 'Please rate your satisfaction'
    if (!surveyData.ease) newErrors.ease = 'Please rate the ease of use'
    if (!surveyData.personalization) newErrors.personalization = 'Please rate the personalization'
    if (!surveyData.trust) newErrors.trust = 'Please rate your trust level'
    if (!surveyData.reuse) newErrors.reuse = 'Please indicate if you would use again'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Log survey response to Google Sheet
      const surveyRecord = {
        participant_id: studentId,
        name: name,
        group: group,
        timestamp: new Date().toISOString(),
        event_type: 'survey_response',
        movie_id: '',
        genre: '',
        survey_helpfulness: surveyData.helpfulness.toString(),
        survey_satisfaction: surveyData.satisfaction.toString(),
        survey_ease: surveyData.ease.toString(),
        survey_personalization: surveyData.personalization.toString(),
        survey_trust: surveyData.trust.toString(),
        survey_reuse: surveyData.reuse.toString(),
        survey_open_feedback: surveyData.openFeedback || ''
      }

      await logToSheet(surveyRecord)

      // Log completion event
      const completionRecord = {
        participant_id: studentId,
        name: name,
        group: group,
        timestamp: new Date().toISOString(),
        event_type: 'end',
        movie_id: '',
        genre: '',
        survey_helpfulness: '',
        survey_satisfaction: '',
        survey_ease: '',
        survey_personalization: '',
        survey_trust: '',
        survey_reuse: '',
        survey_open_feedback: ''
      }

      await logToSheet(completionRecord)

      // Navigate to debrief page (or show completion message)
      // For now, we'll show a completion message
      navigate('/debrief')

    } catch (error) {
      console.error('Error submitting survey:', error)
      alert('Error submitting survey. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return <LoadingSpinner message="Submitting your survey..." />
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Survey: Your Experience
            </h1>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <p className="text-green-700">
                ✅ Movie selection completed!
              </p>
              <p className="text-green-600 text-sm mt-2">
                {name} | Group: {group} | 5 movies selected
              </p>
            </div>
            <p className="text-gray-600">
              Please share your thoughts about the movie recommendation experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Helpfulness Question */}
            <div className="bg-gray-50 rounded-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                1. How helpful were the movie recommendations? (1-10 scale)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <label key={num} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="helpfulness"
                      value={num}
                      checked={surveyData.helpfulness === num}
                      onChange={(e) => handleInputChange('helpfulness', parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div className={`w-full text-center py-3 px-2 rounded-lg border-2 transition-all ${
                      surveyData.helpfulness === num 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      {num}
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Not helpful</span>
                <span>Very helpful</span>
              </div>
              {errors.helpfulness && <p className="text-red-500 text-sm mt-2">{errors.helpfulness}</p>}
            </div>

            {/* Satisfaction Question */}
            <div className="bg-gray-50 rounded-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                2. I was satisfied with the movie recommendations I received.
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-2">
                {likertOptions.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="satisfaction"
                      value={option.value}
                      checked={surveyData.satisfaction === option.value}
                      onChange={(e) => handleInputChange('satisfaction', parseInt(e.target.value))}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.satisfaction && <p className="text-red-500 text-sm mt-2">{errors.satisfaction}</p>}
            </div>

            {/* Ease of Use Question */}
            <div className="bg-gray-50 rounded-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                3. The movie selection system was easy to use.
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-2">
                {likertOptions.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="ease"
                      value={option.value}
                      checked={surveyData.ease === option.value}
                      onChange={(e) => handleInputChange('ease', parseInt(e.target.value))}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.ease && <p className="text-red-500 text-sm mt-2">{errors.ease}</p>}
            </div>

            {/* Personalization Question */}
            <div className="bg-gray-50 rounded-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                4. The recommendations felt personalized to my preferences.
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-2">
                {likertOptions.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="personalization"
                      value={option.value}
                      checked={surveyData.personalization === option.value}
                      onChange={(e) => handleInputChange('personalization', parseInt(e.target.value))}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.personalization && <p className="text-red-500 text-sm mt-2">{errors.personalization}</p>}
            </div>

            {/* Trust Question */}
            <div className="bg-gray-50 rounded-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                5. I trust the recommendation system to suggest movies I would enjoy.
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-2">
                {likertOptions.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="trust"
                      value={option.value}
                      checked={surveyData.trust === option.value}
                      onChange={(e) => handleInputChange('trust', parseInt(e.target.value))}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.trust && <p className="text-red-500 text-sm mt-2">{errors.trust}</p>}
            </div>

            {/* Would Use Again Question */}
            <div className="bg-gray-50 rounded-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                6. I would use this movie recommendation system again.
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-2">
                {likertOptions.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="reuse"
                      value={option.value}
                      checked={surveyData.reuse === option.value}
                      onChange={(e) => handleInputChange('reuse', parseInt(e.target.value))}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.reuse && <p className="text-red-500 text-sm mt-2">{errors.reuse}</p>}
            </div>

            {/* Open Feedback */}
            <div className="bg-gray-50 rounded-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                7. Additional feedback or comments (optional)
              </label>
              <textarea
                value={surveyData.openFeedback}
                onChange={(e) => handleInputChange('openFeedback', e.target.value)}
                placeholder="Please share any additional thoughts about your experience with the movie recommendation system..."
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Your feedback helps us improve the system. Feel free to share what worked well or what could be better.
              </p>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Thank you for participating in our study!
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Survey