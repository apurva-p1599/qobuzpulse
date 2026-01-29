import { useState, useEffect, useMemo } from 'react'
import { loadTrackData, formatDuration } from '../utils/csvLoader'

function Tracks() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGenre, setFilterGenre] = useState('')
  const [filterArtist, setFilterArtist] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await loadTrackData()
        setTracks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Get unique genres and artists for filters
  const uniqueGenres = useMemo(() => {
    const genres = new Set()
    tracks.forEach(track => {
      const genre = track.track_genre_clean || track.track_genre
      if (genre) genres.add(genre)
    })
    return Array.from(genres).sort()
  }, [tracks])

  const uniqueArtists = useMemo(() => {
    const artists = new Set()
    tracks.forEach(track => {
      const artist = track.artist_clean || track.artists
      if (artist) artists.add(artist)
    })
    return Array.from(artists).sort()
  }, [tracks])

  // Filter and sort tracks
  const filteredTracks = useMemo(() => {
    try {
      const trimmedSearch = searchTerm.trim().toLowerCase()
      
      let filtered = tracks.filter(track => {
        if (!track) return false
        
        // Search filter
        const matchesSearch = !trimmedSearch || 
          (track.track_name && typeof track.track_name === 'string' && track.track_name.toLowerCase().includes(trimmedSearch)) ||
          (track.artist_clean && typeof track.artist_clean === 'string' && track.artist_clean.toLowerCase().includes(trimmedSearch)) ||
          (track.artists && typeof track.artists === 'string' && track.artists.toLowerCase().includes(trimmedSearch)) ||
          (track.album_clean && typeof track.album_clean === 'string' && track.album_clean.toLowerCase().includes(trimmedSearch)) ||
          (track.album_name && typeof track.album_name === 'string' && track.album_name.toLowerCase().includes(trimmedSearch))
        
        // Genre filter (case-insensitive)
        const matchesGenre = !filterGenre || 
          (track.track_genre_clean && String(track.track_genre_clean).toLowerCase() === String(filterGenre).toLowerCase()) ||
          (track.track_genre && String(track.track_genre).toLowerCase() === String(filterGenre).toLowerCase())
        
        // Artist filter (case-insensitive)
        const matchesArtist = !filterArtist || 
          (track.artist_clean && String(track.artist_clean).toLowerCase() === String(filterArtist).toLowerCase()) ||
          (track.artists && String(track.artists).toLowerCase() === String(filterArtist).toLowerCase())
        
        return matchesSearch && matchesGenre && matchesArtist
      })

      // Sort
      filtered.sort((a, b) => {
        if (!a || !b) return 0
        
        let aVal, bVal
        
        switch (sortBy) {
          case 'popularity':
            aVal = a.popularity || 0
            bVal = b.popularity || 0
            break
          case 'duration':
            aVal = a.duration_ms || 0
            bVal = b.duration_ms || 0
            break
          case 'danceability':
            aVal = a.danceability || 0
            bVal = b.danceability || 0
            break
          case 'energy':
            aVal = a.energy || 0
            bVal = b.energy || 0
            break
          case 'name':
            aVal = (a.track_name && typeof a.track_name === 'string') ? a.track_name.toLowerCase() : ''
            bVal = (b.track_name && typeof b.track_name === 'string') ? b.track_name.toLowerCase() : ''
            break
          default:
            return 0
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
        }
      })

      return filtered
    } catch (error) {
      console.error('Error filtering tracks:', error)
      return []
    }
  }, [tracks, searchTerm, filterGenre, filterArtist, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredTracks.length / itemsPerPage) || 1
  const paginatedTracks = useMemo(() => {
    return filteredTracks.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }, [filteredTracks, currentPage, itemsPerPage])

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchTerm, filterGenre, filterArtist, sortBy, sortOrder])

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading track data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-red-400">
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Track Explorer</h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4">Browse, search, and filter your music collection</p>
        
        {/* Information Card */}
        <div className="card bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50 mb-6">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-3xl sm:text-4xl">🎧</div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">How to Use Track Explorer</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                This page provides a comprehensive view of all tracks in your collection. Use the powerful search and filter 
                tools to find exactly what you're looking for.
              </p>
              <ul className="text-gray-300 space-y-1 text-sm mb-3">
                <li>• <strong className="text-white">Search:</strong> Type track name, artist, or album to filter results</li>
                <li>• <strong className="text-white">Genre Filter:</strong> Select a genre from the dropdown to see only tracks in that genre</li>
                <li>• <strong className="text-white">Artist Filter:</strong> Choose a specific artist to view their tracks</li>
                <li>• <strong className="text-white">Sort:</strong> Click column headers or use the sort dropdown to organize tracks</li>
              </ul>
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Audio Features:</strong> D = Danceability, E = Energy, V = Valence (mood). 
                All values range from 0.0 to 1.0.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
            <input
              type="text"
              placeholder="Track, artist, or album..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="input-field w-full"
            >
              <option value="">All Genres</option>
              {uniqueGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Artist</label>
            <select
              value={filterArtist}
              onChange={(e) => setFilterArtist(e.target.value)}
              className="input-field w-full"
            >
              <option value="">All Artists</option>
              {uniqueArtists.slice(0, 100).map(artist => (
                <option key={artist} value={artist}>{artist}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
              }}
              className="input-field w-full"
            >
              <option value="popularity-desc">Popularity (High to Low)</option>
              <option value="popularity-asc">Popularity (Low to High)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="duration-desc">Duration (Longest)</option>
              <option value="duration-asc">Duration (Shortest)</option>
              <option value="danceability-desc">Danceability (High to Low)</option>
              <option value="energy-desc">Energy (High to Low)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-xs sm:text-sm text-gray-400">
          <div className="mb-1">Showing {filteredTracks.length.toLocaleString()} of {tracks.length.toLocaleString()} tracks</div>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="text-blue-400">Searching: "{searchTerm}"</span>
            )}
            {filterGenre && (
              <span className="text-purple-400">Genre: {filterGenre}</span>
            )}
            {filterArtist && (
              <span className="text-purple-400">Artist: {filterArtist}</span>
            )}
          </div>
        </div>
      </div>

      {/* Track Table */}
      <div className="card">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white hidden md:block">Track List</h2>
        
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {paginatedTracks.length > 0 ? (
            paginatedTracks.map((track, index) => {
              if (!track) return null
              return (
                <div key={track.track_id || index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-white mb-2">{track.track_name || 'N/A'}</h3>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div><span className="text-gray-500">Artist:</span> {track.artist_clean || track.artists || 'N/A'}</div>
                    <div><span className="text-gray-500">Album:</span> {(track.album_clean || track.album_name || 'N/A').substring(0, 40)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white">
                        {track.track_genre_clean || track.track_genre || 'N/A'}
                      </span>
                      <span className="text-gray-400">Pop: {track.popularity || 0}%</span>
                      <span className="text-gray-400">{formatDuration(track.duration_ms || 0)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center text-gray-400 py-8">No tracks found</div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('name')}
                >
                  Track {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Artist
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Album
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Genre
                </th>
                <th 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('popularity')}
                >
                  Pop {sortBy === 'popularity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white hidden xl:table-cell"
                  onClick={() => handleSort('duration')}
                >
                  Duration {sortBy === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                  Features
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {paginatedTracks.length > 0 ? (
                paginatedTracks.map((track, index) => {
                  if (!track) return null
                  const globalIndex = (currentPage - 1) * itemsPerPage + index
                  return (
                    <tr key={`${track.track_id || 'track'}-${globalIndex}-${filterGenre}-${filterArtist}-${searchTerm}`} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{track.track_name || 'N/A'}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{track.artist_clean || track.artists || 'N/A'}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-300 max-w-xs truncate">
                        {track.album_clean || track.album_name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white">
                        {track.track_genre_clean || track.track_genre || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{track.popularity || 0}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden xl:table-cell">
                      {formatDuration(track.duration_ms || 0)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 hidden xl:table-cell">
                      <div className="flex space-x-2 text-xs">
                        <span className="text-gray-400">D: {(track.danceability || 0).toFixed(2)}</span>
                        <span className="text-gray-400">E: {(track.energy || 0).toFixed(2)}</span>
                        <span className="text-gray-400">V: {(track.valence || 0).toFixed(2)}</span>
                      </div>
                    </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                    No tracks found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 text-sm bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 text-sm bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tracks
