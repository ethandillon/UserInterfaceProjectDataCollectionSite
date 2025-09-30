import axios from 'axios'

const SHEET_BEST_ENDPOINT = import.meta.env.VITE_SHEET_BEST_ENDPOINT

/**
 * Log data to Google Sheet via sheet.best API
 * @param {Object} data - Data to log to the sheet
 * @returns {Promise} - Axios promise
 */
export const logToSheet = async (data) => {
  try {
    const response = await axios.post(SHEET_BEST_ENDPOINT, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (error) {
    console.error('Error logging to sheet:', error)
    throw error
  }
}

/**
 * Create initial participant record
 * @param {string} name - Participant name
 * @param {string} studentId - Student ID
 * @param {string} group - A/B test group (A or B)
 * @returns {Object} - Participant data object
 */
export const createParticipantRecord = (name, studentId, group) => {
  return {
    participant_id: studentId,
    name: name,
    group: group,
    timestamp: new Date().toISOString(),
    event_type: 'init',
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
}

/**
 * Generate random A/B test group assignment
 * @returns {string} - 'A' for static or 'B' for adaptive
 */
export const generateRandomGroup = () => {
  return Math.random() < 0.5 ? 'A' : 'B'
}