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

/**
 * Fetch trending movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Movies data
 */
export const fetchTrendingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get(`/trending/movie/week?page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    throw error
  }
}

/**
 * Fetch popular movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Movies data
 */
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get(`/movie/popular?page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    throw error
  }
}

/**
 * Fetch movies by genre
 * @param {number} genreId - Genre ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Movies data
 */
export const fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbApi.get(`/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`)
    return response.data
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
 * Mix movies from different sources for variety
 * @param {number} count - Number of movies to return
 * @returns {Promise} - Mixed movies array
 */
export const fetchMixedMovies = async (count = 20) => {
  try {
    const [trending, popular] = await Promise.all([
      fetchTrendingMovies(1),
      fetchPopularMovies(1)
    ])

    // Combine and shuffle movies
    const allMovies = [...trending.results, ...popular.results]
    const uniqueMovies = allMovies.filter((movie, index, self) => 
      index === self.findIndex(m => m.id === movie.id)
    )

    // Shuffle and return requested count
    const shuffled = uniqueMovies.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  } catch (error) {
    console.error('Error fetching mixed movies:', error)
    throw error
  }
}