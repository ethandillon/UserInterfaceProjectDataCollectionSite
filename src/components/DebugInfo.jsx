import { useState, useEffect } from 'react'

const DebugInfo = () => {
  const [envVars, setEnvVars] = useState({})
  const [errors, setErrors] = useState([])

  useEffect(() => {
    // Check environment variables
    const vars = {
      VITE_TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY ? 'Set ✅' : 'Missing ❌',
      VITE_TMDB_BASE_URL: import.meta.env.VITE_TMDB_BASE_URL || 'Missing ❌',
      VITE_SHEET_BEST_ENDPOINT: import.meta.env.VITE_SHEET_BEST_ENDPOINT ? 'Set ✅' : 'Missing ❌',
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Missing ❌',
      NODE_ENV: import.meta.env.NODE_ENV || 'undefined',
      MODE: import.meta.env.MODE || 'undefined'
    }
    setEnvVars(vars)

    // Check for errors
    const errorList = []
    if (!import.meta.env.VITE_TMDB_API_KEY) {
      errorList.push('TMDB API Key is missing')
    }
    if (!import.meta.env.VITE_SHEET_BEST_ENDPOINT) {
      errorList.push('Sheet.best endpoint is missing')
    }
    setErrors(errorList)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔍 Debug Information
        </h1>
        
        <div className="grid gap-6">
          {/* Environment Variables */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Environment Variables
            </h2>
            <div className="space-y-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b">
                  <span className="font-mono text-sm">{key}:</span>
                  <span className={`font-mono text-sm ${value.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-900 mb-4">
                ❌ Configuration Errors
              </h2>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-700">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Message */}
          {errors.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                ✅ Configuration Looks Good
              </h2>
              <p className="text-green-700">
                All environment variables are set correctly. If you're seeing this page, 
                the React app is loading properly.
              </p>
            </div>
          )}

          {/* Browser Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Browser Information
            </h2>
            <div className="space-y-2 text-sm">
              <div>User Agent: {navigator.userAgent}</div>
              <div>URL: {window.location.href}</div>
              <div>Timestamp: {new Date().toISOString()}</div>
            </div>
          </div>

          {/* Test API Call */}
          <TestApiCall />
        </div>
      </div>
    </div>
  )
}

const TestApiCall = () => {
  const [apiTest, setApiTest] = useState({ status: 'pending', message: 'Testing...' })

  useEffect(() => {
    const testApi = async () => {
      try {
        if (!import.meta.env.VITE_TMDB_API_KEY) {
          setApiTest({ status: 'error', message: 'TMDB API Key missing' })
          return
        }

        const response = await fetch('https://api.themoviedb.org/3/movie/popular?page=1', {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setApiTest({ 
            status: 'success', 
            message: `API working! Found ${data.results?.length || 0} movies` 
          })
        } else {
          setApiTest({ 
            status: 'error', 
            message: `API Error: ${response.status} ${response.statusText}` 
          })
        }
      } catch (error) {
        setApiTest({ 
          status: 'error', 
          message: `Network Error: ${error.message}` 
        })
      }
    }

    testApi()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        API Test
      </h2>
      <div className={`p-4 rounded-lg ${
        apiTest.status === 'success' ? 'bg-green-50 text-green-700' :
        apiTest.status === 'error' ? 'bg-red-50 text-red-700' :
        'bg-yellow-50 text-yellow-700'
      }`}>
        {apiTest.message}
      </div>
    </div>
  )
}

export default DebugInfo