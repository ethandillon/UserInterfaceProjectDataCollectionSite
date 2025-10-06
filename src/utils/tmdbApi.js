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
  // Genres to exclude (keeping minimal exclusions)
  excludedGenres: [
    // Removed Horror (27) and Thriller (53) - now allowing these genres
    // Only excluding if there are specific genres that are truly inappropriate
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
    
    // Ensure movie is in English
    if (movie.original_language !== 'en') {
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
    const response = await tmdbApi.get(`/trending/movie/week?page=${page}&include_adult=false&with_original_language=en`)
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
    const response = await tmdbApi.get(`/movie/popular?page=${page}&include_adult=false&with_original_language=en`)
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
    
    const response = await tmdbApi.get(`/discover/movie?with_genres=${familyGenres}&page=${page}&include_adult=false&vote_average.gte=6&vote_count.gte=200&certification_country=US&certification.lte=PG-13&with_original_language=en`)
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
    
    const response = await tmdbApi.get(`/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc&include_adult=false&vote_average.gte=5&vote_count.gte=100&with_original_language=en`)
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
 * Fetch movies with diverse genre representation
 * @param {number} count - Total number of movies to return
 * @param {number} pageOffset - Page offset for getting different results
 * @returns {Promise} - Diverse movies array
 */
export const fetchDiverseMovies = async (count = 20, pageOffset = 0) => {
  try {
    // Define diverse genres with good representation
    const diverseGenres = [
      16,    // Animation
      35,    // Comedy
      10751, // Family
      14,    // Fantasy
      10402, // Music
      10749, // Romance
      878,   // Science Fiction
      12,    // Adventure
      27,    // Horror (now allowed)
      53,    // Thriller (now allowed)
      28,    // Action
      18,    // Drama
      99,    // Documentary
      36,    // History
      9648,  // Mystery
      10752, // War (if appropriate)
    ]

    const moviesPerGenre = Math.max(2, Math.floor(count / diverseGenres.length))
    const allMovies = []

    // Fetch movies from each genre
    for (const genreId of diverseGenres) {
      try {
        const page = 1 + pageOffset
        const genreMovies = await fetchMoviesByGenre(genreId, page)
        
        if (genreMovies.results && genreMovies.results.length > 0) {
          // Take 2-3 movies from each genre
          const selectedFromGenre = genreMovies.results.slice(0, moviesPerGenre)
          allMovies.push(...selectedFromGenre)
        }
      } catch (error) {
        console.warn(`Error fetching movies for genre ${genreId}:`, error)
        // Continue with other genres if one fails
      }
    }

    // Remove duplicates
    const uniqueMovies = allMovies.filter((movie, index, self) => 
      index === self.findIndex(m => m.id === movie.id)
    )

    // Additional content filtering
    const safeMovies = uniqueMovies.filter(movie => {
      const title = movie.title?.toLowerCase() || ''
      const overview = movie.overview?.toLowerCase() || ''
      
      // Minimal keyword filtering - only extremely inappropriate content
      const inappropriateKeywords = [
        // Keep this very minimal to allow genre diversity
      ]
      
      const hasInappropriateContent = inappropriateKeywords.some(keyword => 
        title.includes(keyword) || overview.includes(keyword)
      )
      
      return !hasInappropriateContent
    })

    // Shuffle to mix genres and return requested count
    const shuffled = safeMovies.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
    
  } catch (error) {
    console.error('Error fetching diverse movies:', error)
    // Fallback to original mixed movies if diverse fetch fails
    return await fetchMixedMovies(count, pageOffset)
  }
}

/**
 * Mix movies from different family-friendly sources
 * @param {number} count - Number of movies to return
 * @param {number} pageOffset - Page offset for getting different results
 * @returns {Promise} - Mixed movies array
 */
export const fetchMixedMovies = async (count = 20, pageOffset = 0) => {
  try {
    const page1 = 1 + pageOffset
    const page2 = 2 + pageOffset
    const page3 = 3 + pageOffset
    
    const [trending, popular, family] = await Promise.all([
      fetchTrendingMovies(page1),
      fetchPopularMovies(page2),
      fetchFamilyMovies(page3)
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
      // Extra content safety checks - less restrictive now
      const title = movie.title?.toLowerCase() || ''
      const overview = movie.overview?.toLowerCase() || ''
      
      // Filter out movies with extremely inappropriate keywords (keeping minimal)
      const inappropriateKeywords = [
        // Removed most horror/thriller keywords to allow the genres
        // Only keeping extremely inappropriate content
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

/**
 * Fetch movies based on multiple related genres with distribution
 * @param {Array} genreIds - Array of genre IDs from selected movie (in priority order)
 * @param {Array} excludeMovieIds - Array of movie IDs to exclude
 * @param {number} totalCount - Total number of movies to fetch
 * @returns {Promise} - Array of genre-related movies
 */
export const fetchRelatedGenreMovies = async (genreIds, excludeMovieIds = [], totalCount = 16) => {
  try {
    if (!genreIds || genreIds.length === 0) {
      throw new Error('No genre IDs provided')
    }

    // Distribution: 50% from primary genre, 30% from secondary, 20% from tertiary
    const primaryCount = Math.ceil(totalCount * 0.5)
    const secondaryCount = Math.ceil(totalCount * 0.3)
    const tertiaryCount = totalCount - primaryCount - secondaryCount

    const allMovies = []
    const usedMovieIds = new Set(excludeMovieIds)

    // Fetch from primary genre (top priority)
    if (genreIds[0]) {
      try {
        const primaryMovies = await fetchMoviesByGenre(genreIds[0], 1)
        const filteredPrimary = primaryMovies.results
          .filter(movie => !usedMovieIds.has(movie.id))
          .slice(0, primaryCount)
        
        filteredPrimary.forEach(movie => {
          allMovies.push(movie)
          usedMovieIds.add(movie.id)
        })
      } catch (error) {
        console.warn(`Error fetching primary genre ${genreIds[0]}:`, error)
      }
    }

    // Fetch from secondary genre
    if (genreIds[1] && allMovies.length < totalCount) {
      try {
        const secondaryMovies = await fetchMoviesByGenre(genreIds[1], 1)
        const filteredSecondary = secondaryMovies.results
          .filter(movie => !usedMovieIds.has(movie.id))
          .slice(0, secondaryCount)
        
        filteredSecondary.forEach(movie => {
          allMovies.push(movie)
          usedMovieIds.add(movie.id)
        })
      } catch (error) {
        console.warn(`Error fetching secondary genre ${genreIds[1]}:`, error)
      }
    }

    // Fetch from tertiary genre
    if (genreIds[2] && allMovies.length < totalCount) {
      try {
        const tertiaryMovies = await fetchMoviesByGenre(genreIds[2], 1)
        const filteredTertiary = tertiaryMovies.results
          .filter(movie => !usedMovieIds.has(movie.id))
          .slice(0, tertiaryCount)
        
        filteredTertiary.forEach(movie => {
          allMovies.push(movie)
          usedMovieIds.add(movie.id)
        })
      } catch (error) {
        console.warn(`Error fetching tertiary genre ${genreIds[2]}:`, error)
      }
    }

    // If we still need more movies, fetch from diverse genres to fill the gap
    if (allMovies.length < totalCount) {
      try {
        const additionalNeeded = totalCount - allMovies.length
        const diverseMovies = await fetchDiverseMovies(additionalNeeded * 2) // Fetch extra for filtering
        const filteredDiverse = diverseMovies
          .filter(movie => !usedMovieIds.has(movie.id))
          .slice(0, additionalNeeded)
        
        allMovies.push(...filteredDiverse)
      } catch (error) {
        console.warn('Error fetching additional diverse movies:', error)
      }
    }

    // Shuffle the final array to mix the genre-based movies
    return allMovies.sort(() => 0.5 - Math.random())

  } catch (error) {
    console.error('Error fetching related genre movies:', error)
    // Fallback to diverse movies
    return await fetchDiverseMovies(totalCount)
  }
}

/**
 * Fetch a fresh set of movies (for refresh functionality)
 * @param {number} count - Number of movies to return
 * @returns {Promise} - Fresh movies array
 */
export const fetchFreshMovies = async (count = 20) => {
  try {
    // Get movies from different pages to ensure variety
    const randomPageOffset = Math.floor(Math.random() * 3) // Random offset 0-2
    return await fetchDiverseMovies(count, randomPageOffset)
  } catch (error) {
    console.error('Error fetching fresh movies:', error)
    throw error
  }
}