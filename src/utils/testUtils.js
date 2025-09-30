import { logToSheet, createParticipantRecord, generateRandomGroup } from './dataLogger'

/**
 * Test the Google Sheets integration
 * @returns {Promise<boolean>} - Success status
 */
export const testSheetIntegration = async () => {
  try {
    const testData = createParticipantRecord(
      'Test User',
      'TEST123',
      generateRandomGroup()
    )

    // Add test identifier
    testData.event_type = 'test'
    testData.participant_id = 'TEST_' + Date.now()

    const response = await logToSheet(testData)
    return response.status === 200
  } catch (error) {
    console.error('Sheet integration test failed:', error)
    return false
  }
}

/**
 * Validate environment variables
 * @returns {Object} - Validation results
 */
export const validateEnvironment = () => {
  const results = {
    isValid: true,
    errors: []
  }

  if (!import.meta.env.VITE_SHEET_BEST_ENDPOINT) {
    results.isValid = false
    results.errors.push('VITE_SHEET_BEST_ENDPOINT is not configured')
  }

  if (!import.meta.env.VITE_TMDB_API_KEY) {
    results.isValid = false
    results.errors.push('VITE_TMDB_API_KEY is not configured')
  }

  return results
}