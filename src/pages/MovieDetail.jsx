import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import MovieCard from '../components/MovieCard'
import API from '../api'

const POSTER = "https://image.tmdb.org/t/p/w500"
const BACKDROP = "https://image.tmdb.org/t/p/original"

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [recs, setRecs] = useState([])
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    axios.get(`${API}/movie/${id}`).then(r => {
      setMovie(r.data)
      if (r.data.title) {
        axios.get(`${API}/recommend/${encodeURIComponent(r.data.title)}?n=8`)
          .then(rr => setRecs(rr.data.results || []))
      }
    })
    window.scrollTo(0, 0)
  }, [id])

  if (!movie) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh] overflow-hidden">
        {movie.backdrop_path && <img src={`${BACKDROP}${movie.backdrop_path}`} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 flex gap-8 items-end max-w-4xl">
          {movie.poster_path && <img src={`${POSTER}${movie.poster_path}`} alt={movie.title} className="w-40 rounded-xl shadow-2xl border border-white/10 hidden md:block flex-shrink-0" />}
          <div>
            <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-300 italic mt-1">{movie.tagline}</p>}
            <div className="flex flex-wrap gap-3 mt-3 items-center">
              <span className="text-yellow-400 font-bold">⭐ {movie.rating}/10</span>
              <span className="text-gray-400">{movie.release_year}</span>
              {movie.runtime > 0 && <span className="text-gray-400">{movie.runtime} min</span>}
              {Array.isArray(movie.genres) && movie.genres.map(g => (
                <span key={g} className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">{g}</span>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-300 space-y-1">
              <div><span className="text-white font-medium">Director:</span> {movie.director}</div>
              {Array.isArray(movie.cast) && movie.cast.length > 0 && (
                <div><span className="text-white font-medium">Cast:</span> {movie.cast.slice(0,4).join(', ')}</div>
              )}
            </div>
            {movie.trailer_key && (
              <button onClick={() => setShowTrailer(true)} className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-full transition-colors">
                ▶ Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {showTrailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
          <div className="w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
            <iframe src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`} className="w-full h-full" allowFullScreen title={movie.title} />
          </div>
          <button onClick={() => setShowTrailer(false)} className="absolute top-4 right-4 text-white text-2xl bg-white/10 w-10 h-10 rounded-full">×</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold mb-2">Story</h2>
        <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

        {movie.id && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Watch Full Movie</h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
              <iframe src={`https://vidsrc.me/embed/movie?tmdb=${movie.id}`} className="w-full h-full" allowFullScreen title={movie.title} />
            </div>
          </div>
        )}

        {recs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recs.map(r => <MovieCard key={r.id} movie={r} similarity={r.similarity} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}