import { useState } from 'react'
import { getPosterUrl } from '../utils/tmdbApi'

const MovieCard = ({ movie, genres, isSelected, onSelect, disabled = false }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleClick = () => {
    if (!disabled) {
      onSelect(movie)
    }
  }

  // Get primary genre
  const primaryGenre = movie.genre_ids && movie.genre_ids.length > 0 
    ? genres.find(g => g.id === movie.genre_ids[0])?.name || 'Unknown'
    : 'Unknown'

  return (
    <div 
      className={`
        relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105
        ${isSelected ? 'ring-4 ring-blue-500 shadow-xl' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Movie poster */}
      <div className="relative aspect-[2/3] bg-gray-200">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {!imageError ? (
          <img
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <div className="text-center text-gray-500 p-4">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 6h6V4H9v2zm0 3v8h6V9H9z" />
              </svg>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Movie info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-xs text-gray-600 mb-1">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year'}
        </p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {primaryGenre}
        </span>
        {movie.vote_average > 0 && (
          <div className="flex items-center mt-2">
            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-gray-600">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieCard