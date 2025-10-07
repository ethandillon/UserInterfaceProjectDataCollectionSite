import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import LoadingSpinner from './LoadingSpinner'
import { fetchDiverseMovies, fetchFreshMovies, fetchRelatedGenreMovies, fetchMoviesByGenre, fetchGenres } from '../utils/tmdbApi'
import { logToSheet } from '../utils/dataLogger'

const MovieSelection = ({ userData }) => {
  const navigate = useNavigate()
  const { name, studentId, group } = userData

  // State management
  const [movies, setMovies] = useState([])
  const [initialMovies, setInitialMovies] = useState([]) // Store initial set for Group A
  const [genres, setGenres] = useState([])
  const [selectedMovies, setSelectedMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadingNewMovies, setLoadingNewMovies] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showGroupALoading, setShowGroupALoading] = useState(false)
  const [showGroupBLoading, setShowGroupBLoading] = useState(false)

  const MAX_SELECTIONS = 5

  // Initialize movies and genres
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        const [moviesData, genresData] = await Promise.all([
          fetchDiverseMovies(20),
          fetchGenres()
        ])
        
        setMovies(moviesData)
        setInitialMovies(moviesData) // Store initial set for Group A
        setGenres(genresData.genres)
        setError('')
      } catch (error) {
        console.error('Error loading initial data:', error)
        setError('Failed to load movies. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Handle movie selection
  const handleMovieSelect = async (movie) => {
    if (selectedMovies.length >= MAX_SELECTIONS) return
    if (selectedMovies.some(m => m.id === movie.id)) return

    const newSelectedMovies = [...selectedMovies, movie]
    setSelectedMovies(newSelectedMovies)

    // Log selection to Google Sheet
    try {
      const selectionData = {
        participant_id: studentId,
        name: name,
        group: group,
        timestamp: new Date().toISOString(),
        event_type: 'movie_selection',
        movie_id: movie.id.toString(),
        genre: movie.genre_ids && movie.genre_ids.length > 0 
          ? genres.find(g => g.id === movie.genre_ids[0])?.name || 'Unknown'
          : 'Unknown',
        survey_helpfulness: '',
        survey_satisfaction: '',
        survey_ease: '',
        survey_personalization: '',
        survey_trust: '',
        survey_reuse: '',
        survey_open_feedback: ''
      }

      await logToSheet(selectionData)
    } catch (error) {
      console.error('Error logging movie selection:', error)
    }

    // Enhanced adaptive behavior - Different for Group A vs Group B
    if (group === 'A') {
      // GROUP A (STATIC): Reshuffle the same initial set of movies
      setShowGroupALoading(true)
      
      setTimeout(() => {
        // Filter out selected movies from the initial set
        const availableMovies = initialMovies.filter(m => !newSelectedMovies.some(sm => sm.id === m.id))
        
        // If we need more movies to fill the grid, add back some selected ones (but they'll show as selected)
        let displayMovies = [...availableMovies]
        if (displayMovies.length < 15) { // Keep at least 15 unselected movies visible
          const selectedToShow = newSelectedMovies.slice(0, 20 - displayMovies.length)
          displayMovies = [...displayMovies, ...selectedToShow]
        }
        
        // Shuffle the display movies to make it look like the system is "working"
        const shuffledMovies = displayMovies.sort(() => 0.5 - Math.random())
        setMovies(shuffledMovies.slice(0, 20))
        
        setShowGroupALoading(false)
      }, 1000) // 1 second loading
      
    } else if (group === 'B') {
      // GROUP B (ADAPTIVE): Fetch new genre-related movies
      if (movie.genre_ids && movie.genre_ids.length > 0) {
        try {
          setShowGroupBLoading(true)
          setLoadingNewMovies(true)
          
          // Get all movie IDs that should be excluded (selected movies)
          const excludeMovieIds = newSelectedMovies.map(m => m.id)
          
          // Get top 3 genres from the selected movie
          const topGenres = movie.genre_ids.slice(0, 3)
          
          // Fetch highly genre-related movies (80% related, 20% diverse)
          const relatedMovieCount = 16
          const diverseMovieCount = 4
          
          // Fetch related genre movies
          const relatedMovies = await fetchRelatedGenreMovies(topGenres, excludeMovieIds, relatedMovieCount)
          
          // Get diverse movies to fill remaining slots
          const diverseMovies = await fetchDiverseMovies(diverseMovieCount * 2) // Fetch extra for filtering
          const filteredDiverse = diverseMovies
            .filter(m => !excludeMovieIds.includes(m.id) && !relatedMovies.some(rm => rm.id === m.id))
            .slice(0, diverseMovieCount)
          
          // Combine related and diverse movies
          const newMovieGrid = [...relatedMovies, ...filteredDiverse]
          
          // Shuffle the entire grid to mix related and diverse movies
          const shuffledGrid = newMovieGrid.sort(() => 0.5 - Math.random())
          
          // Replace the entire movie grid
          setMovies(shuffledGrid.slice(0, 20))
          
          setTimeout(() => {
            setShowGroupBLoading(false)
          }, 1000)
          
        } catch (error) {
          console.error('Error fetching adaptive movies:', error)
        } finally {
          setLoadingNewMovies(false)
        }
      }
    }

    // Check if we've reached the maximum selections
    if (newSelectedMovies.length === MAX_SELECTIONS) {
      setTimeout(() => {
        navigate('/survey')
      }, 1500) // Brief delay to show the final selection
    }
  }

  // Handle movie deselection
  const handleMovieDeselect = (movie) => {
    setSelectedMovies(prev => prev.filter(m => m.id !== movie.id))
  }

  // Handle refresh of movie options
  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      
      // Log refresh event
      const refreshData = {
        participant_id: studentId,
        name: name,
        group: group,
        timestamp: new Date().toISOString(),
        event_type: 'refresh',
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

      await logToSheet(refreshData)

      // Fetch fresh movies
      const freshMovies = await fetchFreshMovies(20)
      setMovies(freshMovies)
      
      // For Group A, also update the initial movies set
      if (group === 'A') {
        setInitialMovies(freshMovies)
      }
      
      setError('')
    } catch (error) {
      console.error('Error refreshing movies:', error)
      setError('Failed to refresh movies. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading movies..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Loading Movies</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Select Movies You Like
          </h1>
          <p className="text-gray-600 mb-4">
            Hi {name}! Please select {MAX_SELECTIONS} movies that interest you.
            Click on movie posters to select them.
          </p>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm px-4 py-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <span className="font-semibold text-blue-600 ml-2">
                {selectedMovies.length}/{MAX_SELECTIONS}
              </span>
            </div>
            <div className="bg-white rounded-lg shadow-sm px-4 py-2">
              <span className="text-sm text-gray-600">Group:</span>
              <span className="font-semibold text-purple-600 ml-2">
                {group} ({group === 'A' ? 'Static' : 'Adaptive'})
              </span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing || selectedMovies.length === MAX_SELECTIONS}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>New Options</span>
                </>
              )}
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedMovies.length / MAX_SELECTIONS) * 100}%` }}
            ></div>
          </div>

          {(loadingNewMovies || showGroupALoading) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-700 text-sm">
                  Updating recommendations based on your selection...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Selected movies preview */}
        {selectedMovies.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Selections:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedMovies.map(movie => (
                <div key={movie.id} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span>{movie.title}</span>
                  <button
                    onClick={() => handleMovieDeselect(movie)}
                    className="ml-2 hover:text-blue-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movies grid with overlay */}
        <div className="relative">
          {/* Movies grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                genres={genres}
                isSelected={selectedMovies.some(m => m.id === movie.id)}
                onSelect={handleMovieSelect}
                disabled={selectedMovies.length >= MAX_SELECTIONS && !selectedMovies.some(m => m.id === movie.id)}
              />
            ))}
          </div>

          {/* Group A Loading Overlay */}
          {showGroupALoading && group === 'A' && (
            <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-30 flex items-center justify-center rounded-lg min-h-[400px]">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center border-2 border-blue-100">
                <div className="text-blue-500 mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Updating Recommendations</h3>
                <p className="text-gray-600">
                  Processing your selection...
                </p>
              </div>
            </div>
          )}

          {/* Group B Loading Overlay */}
          {showGroupBLoading && group === 'B' && (
            <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-30 flex items-center justify-center rounded-lg min-h-[400px]">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center border-2 border-blue-100">
                <div className="text-blue-500 mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Updating Recommendations</h3>
                <p className="text-gray-600">
                  Processing your selection...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Completion message */}
        {selectedMovies.length === MAX_SELECTIONS && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
              <div className="text-green-500 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Great Job!</h2>
              <p className="text-gray-600 mb-6">
                You've selected {MAX_SELECTIONS} movies. Redirecting to the survey...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieSelection