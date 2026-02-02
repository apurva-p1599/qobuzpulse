import { useState, useEffect, useMemo } from 'react'
import { loadTrackData, getUniqueArtists } from '../utils/csvLoader'
import InfoIcon from '../components/InfoIcon'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function Artists() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('tracks') // tracks, popularity

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

  const artists = useMemo(() => {
    try {
      const artistList = getUniqueArtists(tracks).filter(artist => artist && artist.name)
      
      // Filter by search term
      const filtered = searchTerm
        ? artistList.filter(artist =>
            artist.name && typeof artist.name === 'string' && 
            artist.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : artistList
      
      // Sort
      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'tracks') {
          return (b.trackCount || 0) - (a.trackCount || 0)
        } else {
          return (b.avgPopularity || 0) - (a.avgPopularity || 0)
        }
      })
      
      return sorted
    } catch (error) {
      console.error('Error processing artists:', error)
      return []
    }
  }, [tracks, searchTerm, sortBy])

  // Chart data for top artists
  const topArtistsChart = useMemo(() => {
    try {
      return artists.slice(0, 15)
        .filter(artist => artist && artist.name)
        .map(artist => ({
          name: artist.name && artist.name.length > 20 ? artist.name.substring(0, 20) + '...' : (artist.name || 'Unknown'),
          tracks: artist.trackCount || 0,
          popularity: artist.avgPopularity || 0,
        }))
    } catch (error) {
      console.error('Error creating chart data:', error)
      return []
    }
  }, [artists])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading artist data...</p>
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Artist Explorer</h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4">Discover and explore artists in your music collection</p>
        
        {/* Information Card */}
        <div className="card bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50 mb-6">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-3xl sm:text-4xl">🎤</div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Understanding Artist Data</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                This page helps you explore the artists in your collection. You can search for specific artists, 
                see how many tracks each artist has, and discover their average popularity scores.
              </p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• <strong className="text-white">Track Count:</strong> Number of songs by each artist</li>
                <li>• <strong className="text-white">Avg Popularity:</strong> Average popularity score across all their tracks</li>
                <li>• <strong className="text-white">Genres:</strong> Musical genres associated with each artist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setSortBy('tracks')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'tracks'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Sort by Tracks
            </button>
            <button
              onClick={() => setSortBy('popularity')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'popularity'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Sort by Popularity
            </button>
          </div>
        </div>
        <p className="mt-4 text-gray-400 text-sm">
          Showing {artists.length} of {getUniqueArtists(tracks).length} artists
        </p>
      </div>

      {/* Top Artists Chart */}
      {topArtistsChart.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Top 15 Artists</h2>
            <InfoIcon
              title="Top 15 Artists"
              content={
                <div>
                  <p className="mb-2"><strong>Purpose:</strong> Compare top artists by track count and popularity.</p>
                  <p className="mb-2"><strong>Y-axis:</strong> Artist names</p>
                  <p className="mb-2"><strong>X-axis:</strong> Count/Score values</p>
                  <p className="mb-2"><strong>Blue bars:</strong> Number of tracks by each artist in your collection</p>
                  <p className="mb-2"><strong>Purple bars:</strong> Average popularity score (0-100) of their tracks</p>
                  <p><strong>Insight:</strong> Find prolific artists (many tracks) vs. popular artists (high popularity scores). Sometimes they're the same, sometimes not!</p>
                </div>
              }
            />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Horizontal bar chart showing the top 15 artists by track count. Blue bars represent number of tracks, 
            purple bars show average popularity. Longer bars indicate more tracks or higher popularity.
          </p>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <BarChart data={topArtistsChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" width={200} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="tracks" fill="#0ea5e9" name="Number of Tracks" radius={[0, 8, 8, 0]} />
              <Bar dataKey="popularity" fill="#a855f7" name="Avg Popularity" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Artist List */}
      <div className="card">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">All Artists</h2>
        <p className="text-xs sm:text-sm text-gray-400 mb-4">
          Complete list of all artists in your collection. Use the search box above to filter by name, 
          or click the sort buttons to organize by track count or popularity.
        </p>
        
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {artists.length > 0 ? (
            artists.map((artist, index) => (
              <div key={artist.name || index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-white">{artist.name || 'Unknown Artist'}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-2">
                  <div>
                    <span className="text-gray-500">Tracks:</span> {artist.trackCount || 0}
                  </div>
                  <div>
                    <span className="text-gray-500">Popularity:</span> {artist.avgPopularity || 0}%
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {artist.genres && Array.isArray(artist.genres) && artist.genres.slice(0, 2).map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white"
                    >
                      {genre}
                    </span>
                  ))}
                  {artist.genres && Array.isArray(artist.genres) && artist.genres.length > 2 && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-600 text-white">
                      +{artist.genres.length - 2}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">No artists found</div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Artist
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tracks
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Avg Popularity
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Genres
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {artists.length > 0 ? (
                artists.map((artist, index) => (
                  <tr key={artist.name || index} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{artist.name || 'Unknown Artist'}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{artist.trackCount || 0}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{artist.avgPopularity || 0}%</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {artist.genres && Array.isArray(artist.genres) && artist.genres.slice(0, 3).map((genre, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white"
                          >
                            {genre}
                          </span>
                        ))}
                        {artist.genres && Array.isArray(artist.genres) && artist.genres.length > 3 && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-600 text-white">
                            +{artist.genres.length - 3}
                          </span>
                        )}
                        {(!artist.genres || !Array.isArray(artist.genres) || artist.genres.length === 0) && (
                          <span className="text-xs text-gray-500">No genres</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                    No artists found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Artists
