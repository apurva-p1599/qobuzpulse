import { useState, useEffect } from 'react'
import { loadTrackData, formatDuration } from '../utils/csvLoader'
import InfoIcon from '../components/InfoIcon'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function Home() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalTracks: 0,
    totalArtists: 0,
    totalGenres: 0,
    avgPopularity: 0,
    totalDuration: 0,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await loadTrackData()
        setTracks(data)
        
        // Calculate statistics
        const uniqueArtists = new Set(data.map(t => t.artist_clean).filter(Boolean))
        const uniqueGenres = new Set(data.map(t => t.track_genre_clean).filter(Boolean))
        const avgPopularity = data.reduce((sum, t) => sum + (t.popularity || 0), 0) / data.length
        const totalDuration = data.reduce((sum, t) => sum + (t.duration_ms || 0), 0)
        
        setStats({
          totalTracks: data.length,
          totalArtists: uniqueArtists.size,
          totalGenres: uniqueGenres.size,
          avgPopularity: Math.round(avgPopularity),
          totalDuration: totalDuration,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Prepare chart data
  const genreCount = {}
  tracks.forEach(track => {
    const genre = track.track_genre_clean || track.track_genre || 'Unknown'
    genreCount[genre] = (genreCount[genre] || 0) + 1
  })
  
  const topGenres = Object.entries(genreCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  const popularityRanges = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0,
  }
  
  tracks.forEach(track => {
    const pop = track.popularity || 0
    if (pop <= 20) popularityRanges['0-20']++
    else if (pop <= 40) popularityRanges['21-40']++
    else if (pop <= 60) popularityRanges['41-60']++
    else if (pop <= 80) popularityRanges['61-80']++
    else popularityRanges['81-100']++
  })
  
  const popularityData = Object.entries(popularityRanges).map(([name, value]) => ({
    name,
    value,
  }))

  const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316']

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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Welcome to QobuzPulse</h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4">
          Your comprehensive music analytics dashboard for exploring track metadata, artist insights, and genre analysis
        </p>
        <div className="card bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-3xl sm:text-4xl">🎵</div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">What is QobuzPulse?</h3>
              <p className="text-gray-300 leading-relaxed">
                QobuzPulse is an interactive music analytics platform that analyzes over <strong className="text-white">{stats.totalTracks.toLocaleString()}</strong> tracks 
                from your music collection. Explore detailed insights about artists, genres, audio features, and track characteristics. 
                Use the navigation above to dive into specific analyses or browse the overview below.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Explanation */}
      <div className="card mb-6 bg-gray-800/50">
        <h2 className="text-xl font-semibold text-white mb-3">📊 Key Metrics Explained</h2>
        <p className="text-gray-300 mb-4">
          These metrics provide a quick overview of your music collection. Each number represents important characteristics 
          that help understand the scope and diversity of your tracks.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="stat-card group">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Total Tracks</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {stats.totalTracks.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">Total number of songs in your collection</p>
        </div>
        <div className="stat-card group">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Unique Artists</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {stats.totalArtists.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">Distinct artists represented</p>
        </div>
        <div className="stat-card group">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Genres</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {stats.totalGenres.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">Different musical genres covered</p>
        </div>
        <div className="stat-card group">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Avg Popularity</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {stats.avgPopularity}%
          </p>
          <p className="text-xs text-gray-500 mt-2">Average popularity score (0-100)</p>
        </div>
        <div className="stat-card group">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Total Duration</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {formatDuration(stats.totalDuration)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Combined playtime of all tracks</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Genres Bar Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Top 10 Genres</h2>
            <InfoIcon
              title="Top 10 Genres"
              content={
                <div>
                  <p className="mb-2"><strong>Purpose:</strong> Shows the most common genres in your music collection.</p>
                  <p className="mb-2"><strong>Y-axis:</strong> Genre names</p>
                  <p className="mb-2"><strong>X-axis:</strong> Number of tracks</p>
                  <p><strong>Insight:</strong> Longer bars = more tracks in that genre. This helps you understand which musical styles dominate your collection.</p>
                </div>
              }
            />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Shows which genres dominate your collection. Higher bars indicate more tracks in that genre.
          </p>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={topGenres}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="value" fill="#0ea5e9" name="Number of Tracks" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Popularity Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Popularity Distribution</h2>
            <InfoIcon
              title="Popularity Distribution"
              content={
                <div>
                  <p className="mb-2"><strong>Purpose:</strong> Shows how tracks are spread across different popularity levels.</p>
                  <p className="mb-2"><strong>X-axis:</strong> Popularity ranges (e.g., 0-20, 21-40, etc.)</p>
                  <p className="mb-2"><strong>Y-axis:</strong> Number of tracks</p>
                  <p className="mb-2"><strong>Popularity Score:</strong> 0 = least popular, 100 = most popular (based on streaming data)</p>
                  <p><strong>Insight:</strong> Helps identify if your collection leans toward mainstream hits or underground tracks.</p>
                </div>
              }
            />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            How tracks are distributed across popularity ranges. Popularity scores range from 0 (least popular) to 100 (most popular).
          </p>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={popularityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="value" fill="#a855f7" name="Number of Tracks" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Genre Pie Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">Genre Distribution (Top 8)</h2>
          <InfoIcon
            title="Genre Distribution"
            content={
              <div>
                <p className="mb-2"><strong>Purpose:</strong> Visual representation of genre proportions in your collection.</p>
                <p className="mb-2"><strong>Pie Slices:</strong> Each colored slice represents a genre</p>
                <p className="mb-2"><strong>Size:</strong> Larger slice = more tracks in that genre</p>
                <p className="mb-2"><strong>Legend:</strong> Shows genre names and their corresponding colors</p>
                <p><strong>Insight:</strong> Quickly see which genres make up the majority of your collection at a glance.</p>
              </div>
            }
          />
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Visual representation of genre proportions. Each slice shows the percentage of tracks belonging to that genre. 
          Hover over slices to see exact numbers.
        </p>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
          <PieChart>
            <Pie
              data={topGenres}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {topGenres.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Home
