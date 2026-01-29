import { useState, useEffect, useMemo } from 'react'
import { loadTrackData, getArtistMomentum, getRisingArtists } from '../utils/csvLoader'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts'

function Momentum() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('all') // 'all', 'rising', 'top'

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

  const artistMomentum = useMemo(() => getArtistMomentum(tracks), [tracks])
  const risingArtists = useMemo(() => getRisingArtists(tracks), [tracks])
  const topMomentumArtists = artistMomentum.slice(0, 20)

  // Chart data for momentum trends
  const momentumChartData = topMomentumArtists.map(artist => ({
    name: artist.name.length > 20 ? artist.name.substring(0, 20) + '...' : artist.name,
    momentum: artist.momentum,
    popularity: artist.avgPopularity,
    tracks: artist.trackCount,
  }))

  // Popularity distribution by momentum tier
  const momentumTiers = useMemo(() => {
    const tiers = {
      'High Momentum (80+)': 0,
      'Medium Momentum (50-79)': 0,
      'Low Momentum (<50)': 0,
    }
    
    artistMomentum.forEach(artist => {
      if (artist.momentum >= 80) tiers['High Momentum (80+)']++
      else if (artist.momentum >= 50) tiers['Medium Momentum (50-79)']++
      else tiers['Low Momentum (<50)']++
    })
    
    return Object.entries(tiers).map(([name, value]) => ({ name, value }))
  }, [artistMomentum])

  // Popularity trend by track count (simulated)
  const popularityTrendData = useMemo(() => {
    const ranges = [
      { range: '1-5 tracks', artists: [], avgPopularity: 0 },
      { range: '6-10 tracks', artists: [], avgPopularity: 0 },
      { range: '11-20 tracks', artists: [], avgPopularity: 0 },
      { range: '21-50 tracks', artists: [], avgPopularity: 0 },
      { range: '50+ tracks', artists: [], avgPopularity: 0 },
    ]
    
    artistMomentum.forEach(artist => {
      if (artist.trackCount <= 5) ranges[0].artists.push(artist)
      else if (artist.trackCount <= 10) ranges[1].artists.push(artist)
      else if (artist.trackCount <= 20) ranges[2].artists.push(artist)
      else if (artist.trackCount <= 50) ranges[3].artists.push(artist)
      else ranges[4].artists.push(artist)
    })
    
    return ranges.map(range => ({
      range: range.range,
      avgPopularity: range.artists.length > 0
        ? Math.round(range.artists.reduce((sum, a) => sum + a.avgPopularity, 0) / range.artists.length)
        : 0,
      artistCount: range.artists.length,
    }))
  }, [artistMomentum])

  const displayedArtists = viewMode === 'rising' 
    ? risingArtists 
    : viewMode === 'top'
    ? topMomentumArtists
    : artistMomentum.slice(0, 50)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading momentum data...</p>
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Artist Momentum Tracker</h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4">Track artist performance trends and identify rising stars</p>
        
        {/* Information Card */}
        <div className="card bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50 mb-6">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-3xl sm:text-4xl">📈</div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Understanding Artist Momentum</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                Momentum scores combine multiple factors to identify artists with strong performance potential:
              </p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• <strong className="text-white">Momentum Score:</strong> Calculated from average popularity, track count, and high-performing tracks</li>
                <li>• <strong className="text-white">High-Performing Tracks:</strong> Shows count of tracks with popularity &gt; 70, with subset showing tracks &gt; 85</li>
                <li>• <strong className="text-white">Rising Artists:</strong> Artists with high momentum relative to their track count (emerging talent)</li>
                <li>• <strong className="text-white">Top Momentum:</strong> Established artists with consistently high performance</li>
                <li>• <strong className="text-white">Note:</strong> Without release date data, momentum is calculated using popularity metrics as a proxy for performance trends</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Total Artists</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {artistMomentum.length.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">Artists with 3+ tracks</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Rising Artists</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {risingArtists.length}
          </p>
          <p className="text-xs text-gray-500 mt-2">High momentum, emerging talent</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Avg Momentum</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {Math.round(artistMomentum.reduce((sum, a) => sum + a.momentum, 0) / artistMomentum.length)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Average momentum score</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Top Momentum</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {topMomentumArtists[0]?.momentum || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Highest momentum score</p>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Artists
          </button>
          <button
            onClick={() => setViewMode('rising')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'rising'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Rising Stars
          </button>
          <button
            onClick={() => setViewMode('top')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'top'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Top Momentum
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Momentum Chart */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-2 text-white">Top 20 Artists by Momentum</h2>
          <p className="text-sm text-gray-400 mb-4">
            Combined chart showing momentum scores (bars) and average popularity (line). Higher momentum indicates stronger overall performance.
          </p>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <ComposedChart data={momentumChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar yAxisId="left" dataKey="momentum" fill="#0ea5e9" name="Momentum Score" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="popularity" stroke="#a855f7" strokeWidth={2} name="Avg Popularity" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Momentum Tier Distribution */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-2 text-white">Momentum Tier Distribution</h2>
          <p className="text-sm text-gray-400 mb-4">
            Distribution of artists across momentum tiers. High momentum artists have consistently strong performance across multiple tracks.
          </p>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <BarChart data={momentumTiers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="value" fill="#3b82f6" name="Number of Artists" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popularity Trend by Track Count */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-2 text-white">Popularity Trends by Artist Size</h2>
        <p className="text-sm text-gray-400 mb-4">
          Average popularity across artists grouped by track count. This helps identify if larger catalogs correlate with higher popularity.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={popularityTrendData}>
            <defs>
              <linearGradient id="colorPopularity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Area type="monotone" dataKey="avgPopularity" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorPopularity)" name="Avg Popularity" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Artist List */}
      <div className="card">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
          {viewMode === 'rising' ? 'Rising Stars' : viewMode === 'top' ? 'Top Momentum Artists' : 'All Artists'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mb-4">
          {viewMode === 'rising' 
            ? 'Artists with high momentum relative to track count - emerging talent to watch'
            : viewMode === 'top'
            ? 'Artists with the highest overall momentum scores'
            : 'Complete list of artists sorted by momentum score'}
        </p>
        
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {displayedArtists.length > 0 ? (
            displayedArtists.map((artist, index) => (
              <div key={artist.name} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">#{index + 1}</div>
                    <h3 className="text-sm font-medium text-white">{artist.name}</h3>
                  </div>
                  {artist.momentum >= 80 && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                      High
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-2">
                  <div>
                    <span className="text-gray-500">Momentum:</span> <span className="text-blue-400 font-bold">{artist.momentum}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Popularity:</span> {artist.avgPopularity}%
                  </div>
                  <div>
                    <span className="text-gray-500">Tracks:</span> {artist.trackCount}
                  </div>
                </div>
                <div className="text-xs text-gray-300 mt-2">
                  <div>{artist.highPopularityTracks} tracks with popularity &gt; 70</div>
                  <div className="text-gray-500">
                    ({artist.veryHighPopularityTracks} with popularity &gt; 85)
                  </div>
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
                  Rank
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Artist
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Momentum
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Popularity
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tracks
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  High Performers
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {displayedArtists.length > 0 ? (
                displayedArtists.map((artist, index) => (
                  <tr key={artist.name} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">#{index + 1}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{artist.name}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-bold text-blue-400">{artist.momentum}</div>
                        {artist.momentum >= 80 && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                            High
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{artist.avgPopularity}%</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{artist.trackCount}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>{artist.highPopularityTracks} high</span>
                          {artist.highPopularityTracks > 0 && (
                            <span className="text-xs text-gray-500">
                              ({artist.veryHighPopularityTracks} very high)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 hidden lg:block">
                          Popularity &gt; 70 (&gt; 85 for very high)
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
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

export default Momentum

