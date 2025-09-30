import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

// Create axios instance for TMDB API
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

// Content filtering configuration
const CONTENT_FILTERS = {
  // Genres to exclude (inappropriate content)
  excludedGenres: [
    27, // Horror
    53, // Thriller (some may be inappropriate)
    // Note: We're being conservative - can adjust based on needs
  ],
  
  // Certifications to exclude (R-rated and above)
  excludedCertifications: ['R', 'NC-17', 'X', 'Unrated'],
  
  // Minimum vote average for quality
  minVoteAverage: 5.0,
  
  // Minimum vote count for reliability
  minVoteCount: 100
}

/**
 * Filter movies based on content appropriateness
 * @param {Array} movies - Array of movie objects
 * @returns {Array} - Filtered movies
 */
const filterMovies = (movies) => {
  return movies.filter(movie => {
    // Filter out movies with excluded genres
    if (movie.genre_ids && movie.genre_ids.some(genreId => 
      CONTENT_FILTERS.excludedGenres.includes(genreId))) {
      return false
    }
    
    // Filter by rating/quality
    if (movie.vote_average < CONTENT_FILTERS.minVoteAverage) {
      return false
    }
    
    if (movie.vote_count < CONTENT_FILTERS.minVoteCount) {
      return false
    }
    
    // Filter out adult content
    if (movie.adult === true) {
      return false
    }
    
    // Ensure movie has a poster
    if (!movie.poster_path) {
      return false
    }
    
    return true
  })
}

/**
 * Fetch trending movies with content filtering
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Movies data
 */
export const fetchTrendingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get(`/trending/movie/week?page=${page}&include_adult=false`)
    const filteredResults = filterMovies(response.data.results)
    return { ...response.data, results: filteredResults }
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    throw error
  }
}

/**
 * Fetch popular movies with content filtering
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Movies data
 */
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get(`/movie/popular?page=${page}&include_adult=false`)
    const filteredResults = filterMovies(response.data.results)
    return { ...response.data, results: filteredResults }
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    throw error
  }
}

/**
 * Fetch family-friendly movies specifically
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Movies data
 */
export const fetchFamilyMovies = async (page = 1) => {
  try {
    // Use discover endpoint with family-friendly genres
    const familyGenres = [
      16, // Animation
      35, // Comedy
      10751, // Family
      14, // Fantasy
      10402, // Music
      10749, // Romance (generally appropriate)
      878, // Science Fiction
      12, // Adventure
    ].join(',')
    
    const response = await tmdbApi.get(`/discover/movie?with_genres=${familyGenres}&page=${page}&include_adult=false&vote_average.gte=6&vote_count.gte=200&certification_country=US&certification.lte=PG-13`)
    const filteredResults = filterMovies(response.data.results)
    return { ...response.data, results: filteredResults }
  } catch (error) {
    console.error('Error fetching family movies:', error)
    throw error
  }
}

/**
 * Fetch movies by genre with content filtering
 * @param {number} genreId - Genre ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Movies data
 */
export const fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    // Skip if it's an excluded genre
    if (CONTENT_FILTERS.excludedGenres.includes(genreId)) {
      console.log(`Skipping excluded genre: ${genreId}`)
      return { results: [] }
    }
    
    const response = await tmdbApi.get(`/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc&include_adult=false&vote_average.gte=5&vote_count.gte=100`)
    const filteredResults = filterMovies(response.data.results)
    return { ...response.data, results: filteredResults }
  } catch (error) {
    console.error('Error fetching movies by genre:', error)
    throw error
  }
}

/**
 * Fetch movie genres
 * @returns {Promise} - Genres data
 */
export const fetchGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list')
    return response.data
  } catch (error) {
    console.error('Error fetching genres:', error)
    throw error
  }
}

/**
 * Get full poster URL
 * @param {string} posterPath - Poster path from TMDB
 * @param {string} size - Image size (default: 'w500')
 * @returns {string} - Full poster URL
 */
export const getPosterUrl = (posterPath, size = 'w500') => {
  if (!posterPath) return '/placeholder-movie.jpg' // fallback image
  return `https://image.tmdb.org/t/p/${size}${posterPath}`
}

/**
 * Get genre name by ID
 * @param {number} genreId - Genre ID
 * @param {Array} genres - Array of genre objects
 * @returns {string} - Genre name
 */
export const getGenreName = (genreId, genres) => {
  const genre = genres.find(g => g.id === genreId)
  return genre ? genre.name : 'Unknown'
}

/**
 * Mix movies from different family-friendly sources
 * @param {number} count - Number of movies to return
 * @returns {Promise} - Mixed movies array
 */
export const fetchMixedMovies = async (count = 20) => {
  try {
    const [trending, popular, family] = await Promise.all([
      fetchTrendingMovies(1),
      fetchPopularMovies(1),
      fetchFamilyMovies(1)
    ])

    // Combine and prioritize family-friendly content
    const allMovies = [
      ...family.results,      // Prioritize family movies
      ...trending.results,    // Add trending (already filtered)
      ...popular.results      // Add popular (already filtered)
    ]
    
    // Remove duplicates
    const uniqueMovies = allMovies.filter((movie, index, self) => 
      index === self.findIndex(m => m.id === movie.id)
    )

    // Additional filtering for extra safety
    const safeMovies = uniqueMovies.filter(movie => {
      // Extra content safety checks
      const title = movie.title?.toLowerCase() || ''
      const overview = movie.overview?.toLowerCase() || ''
      
      // Filter out movies with potentially inappropriate keywords in title/overview
      const inappropriateKeywords = [
        'kill', 'murder', 'blood', 'death', 'violent', 'terror', 
        'horror', 'nightmare', 'demon', 'evil', 'hell'
      ]
      
      const hasInappropriateContent = inappropriateKeywords.some(keyword => 
        title.includes(keyword) || overview.includes(keyword)
      )
      
      return !hasInappropriateContent
    })

    // Shuffle and return requested count
    const shuffled = safeMovies.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  } catch (error) {
    console.error('Error fetching mixed movies:', error)
    throw error
  }
}