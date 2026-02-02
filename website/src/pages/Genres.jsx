import { useState, useEffect } from 'react'
import { loadTrackData, getGenreStats, getGenreGrowthTrends } from '../utils/csvLoader'
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

function Genres() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState(null)

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

  const genreStats = getGenreStats(tracks)
  const topGenres = genreStats.slice(0, 20)
  const genreGrowthTrends = getGenreGrowthTrends(tracks)

  // Chart data
  const genreCountData = topGenres.map(g => ({
    name: g.name,
    tracks: g.count,
    popularity: g.avgPopularity,
  }))

  const genreFeaturesData = topGenres.slice(0, 10).map(g => ({
    name: g.name,
    energy: parseFloat(g.avgEnergy),
    danceability: parseFloat(g.avgDanceability),
    valence: parseFloat(g.avgValence),
  }))

  // Radar chart data for selected genre
  const selectedGenreData = selectedGenre
    ? [
        {
          feature: 'Energy',
          value: parseFloat(genreStats.find(g => g.name === selectedGenre)?.avgEnergy || 0),
          fullMark: 1,
        },
        {
          feature: 'Danceability',
          value: parseFloat(genreStats.find(g => g.name === selectedGenre)?.avgDanceability || 0),
          fullMark: 1,
        },
        {
          feature: 'Valence',
          value: parseFloat(genreStats.find(g => g.name === selectedGenre)?.avgValence || 0),
          fullMark: 1,
        },
        {
          feature: 'Popularity',
          value: (genreStats.find(g => g.name === selectedGenre)?.avgPopularity || 0) / 100,
          fullMark: 1,
        },
      ]
    : []

  const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading genre data...</p>
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Genre Analysis</h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4">Explore music genres and their characteristics</p>
        
        {/* Information Card */}
        <div className="card bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50 mb-6">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-3xl sm:text-4xl">🎵</div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Understanding Genre Analytics</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                This page provides deep insights into musical genres. Analyze track counts, popularity trends, 
                and audio characteristics (energy, danceability, valence) across different genres.
              </p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• <strong className="text-white">Energy:</strong> Intensity and power of the track (0-1 scale)</li>
                <li>• <strong className="text-white">Danceability:</strong> How suitable a track is for dancing (0-1 scale)</li>
                <li>• <strong className="text-white">Valence:</strong> Musical positiveness (0 = sad, 1 = happy)</li>
                <li>• <strong className="text-white">Click any genre card</strong> below to see a detailed radar chart analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Genre Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Total Genres</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {genreStats.length}
          </p>
          <p className="text-xs text-gray-500 mt-2">Unique genres in collection</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Most Popular Genre</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {genreStats[0]?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-400 mt-1">{genreStats[0]?.count || 0} tracks</p>
          <p className="text-xs text-gray-500 mt-2">Genre with most tracks</p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Avg Tracks per Genre</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {Math.round(tracks.length / genreStats.length)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Average distribution</p>
        </div>
      </div>

      {/* Genre Growth Trends */}
      <div className="card mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/50">
        <h2 className="text-2xl font-bold mb-2 text-white">Genre Discovery Trends</h2>
        <p className="text-sm text-gray-400 mb-4">
          Growth scores indicate genres with rising popularity relative to collection average. 
          Higher scores suggest genres that are gaining momentum. Without temporal data, growth is calculated 
          using popularity metrics as a proxy for trend indicators.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genreGrowthTrends.slice(0, 12).map((genre, index) => (
            <div
              key={genre.name}
              className={`bg-gray-800 p-4 rounded-lg border ${
                genre.trend === 'rising' ? 'border-green-500' : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold text-white">{genre.name}</h3>
                {genre.trend === 'rising' && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                    Rising
                  </span>
                )}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Growth Score:</span>
                  <span className="text-white font-medium">{genre.growthScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tracks:</span>
                  <span className="text-white font-medium">{genre.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Popularity:</span>
                  <span className="text-white font-medium">{genre.avgPopularity}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Genre Count Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Top 20 Genres by Track Count</h2>
            <InfoIcon
              title="Top 20 Genres by Track Count"
              content={
                <div>
                  <p className="mb-2"><strong>Purpose:</strong> Compare genres by volume and popularity.</p>
                  <p className="mb-2"><strong>Blue bars:</strong> Number of tracks in each genre</p>
                  <p className="mb-2"><strong>Purple bars:</strong> Average popularity score (0-100) for tracks in that genre</p>
                  <p className="mb-2"><strong>X-axis:</strong> Genre names (rotated for readability)</p>
                  <p className="mb-2"><strong>Y-axis:</strong> Count/Score values</p>
                  <p><strong>Insight:</strong> Find which genres have the most tracks AND which genres contain the most popular tracks.</p>
                </div>
              }
            />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Compare genres by the number of tracks (blue bars) and average popularity (purple bars). 
            This helps identify which genres dominate your collection.
          </p>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <BarChart data={genreCountData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="tracks" fill="#0ea5e9" name="Tracks" radius={[8, 8, 0, 0]} />
              <Bar dataKey="popularity" fill="#a855f7" name="Avg Popularity" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Features */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Audio Features by Genre (Top 10)</h2>
            <InfoIcon
              title="Audio Features by Genre"
              content={
                <div>
                  <p className="mb-2"><strong>Purpose:</strong> Compare audio characteristics across genres.</p>
                  <p className="mb-2"><strong>Blue line (Energy):</strong> Intensity and power (0-1 scale). Higher = more energetic</p>
                  <p className="mb-2"><strong>Purple line (Danceability):</strong> How suitable for dancing (0-1 scale). Higher = more danceable</p>
                  <p className="mb-2"><strong>Pink line (Valence):</strong> Musical positiveness (0-1 scale). Higher = more positive/happy</p>
                  <p className="mb-2"><strong>X-axis:</strong> Genre names</p>
                  <p className="mb-2"><strong>Y-axis:</strong> Feature values (0.0 to 1.0)</p>
                  <p><strong>Insight:</strong> Understand the "feel" of each genre - is it energetic, danceable, happy, or mellow?</p>
                </div>
              }
            />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Line chart comparing audio characteristics across genres. Higher values indicate more energy, 
            danceability, or positive mood (valence). Use this to understand the musical "feel" of each genre.
          </p>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <LineChart data={genreFeaturesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Line type="monotone" dataKey="energy" stroke="#0ea5e9" name="Energy" strokeWidth={2} />
              <Line type="monotone" dataKey="danceability" stroke="#3b82f6" name="Danceability" strokeWidth={2} />
              <Line type="monotone" dataKey="valence" stroke="#a855f7" name="Valence" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Genre Pie Chart and Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Genre Distribution (Top 10)</h2>
            <InfoIcon
              title="Genre Distribution"
              content={
                <div>
                  <p className="mb-2"><strong>Purpose:</strong> Visual breakdown of genre proportions.</p>
                  <p className="mb-2"><strong>Pie Slices:</strong> Each colored segment represents a genre</p>
                  <p className="mb-2"><strong>Size:</strong> Larger slices = more tracks in that genre</p>
                  <p className="mb-2"><strong>Labels:</strong> Show genre name and percentage of total</p>
                  <p><strong>Insight:</strong> Quickly see which genres dominate your collection and their relative proportions.</p>
                </div>
              }
            />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Pie chart showing the proportional distribution of the top 10 genres. Larger slices represent 
            genres with more tracks in your collection.
          </p>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <PieChart>
              <Pie
                data={genreCountData.slice(0, 10)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="tracks"
              >
                {genreCountData.slice(0, 10).map((entry, index) => (
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

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Genre Feature Analysis</h2>
            <InfoIcon
              title="Genre Feature Analysis (Radar Chart)"
              content={
                <div>
                  <p className="mb-2"><strong>Purpose:</strong> Visualize all audio characteristics of a genre at once.</p>
                  <p className="mb-2"><strong>How to use:</strong> Click any genre card below to display its audio profile</p>
                  <p className="mb-2"><strong>Axes:</strong> Each spoke represents a different feature (Energy, Danceability, Valence, Popularity)</p>
                  <p className="mb-2"><strong>Shape:</strong> The blue shaded area shows the genre's "signature" - larger area = higher values across features</p>
                  <p className="mb-2"><strong>Scale:</strong> All values normalized to 0-1 (popularity divided by 100)</p>
                  <p><strong>Insight:</strong> Compare the "character" of different genres by their unique radar shapes.</p>
                </div>
              }
            />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Interactive radar chart showing detailed audio characteristics for a selected genre. 
            Click any genre card below to see its unique musical profile.
          </p>
          {selectedGenre ? (
            <>
              <div className="mb-4">
                <button
                  onClick={() => setSelectedGenre(null)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  ← Back to all genres
                </button>
                <h3 className="text-xl font-semibold text-white mt-2">{selectedGenre}</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={selectedGenreData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="feature" stroke="#9ca3af" />
                  <PolarRadiusAxis angle={90} domain={[0, 1]} stroke="#9ca3af" />
                  <Radar
                    name="Value"
                    dataKey="value"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.6}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <p>Select a genre from the list below to see detailed analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Genre List */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-2 text-white">All Genres</h2>
        <p className="text-sm text-gray-400 mb-4">
          Browse all genres in your collection. Each card shows track count, average popularity, and audio features. 
          Click any card to see detailed analysis in the radar chart above.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genreStats.map((genre) => (
            <div
              key={genre.name}
              onClick={() => setSelectedGenre(genre.name)}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{genre.name}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tracks:</span>
                  <span className="text-white font-medium">{genre.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Popularity:</span>
                  <span className="text-white font-medium">{genre.avgPopularity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Energy:</span>
                  <span className="text-white font-medium">{(parseFloat(genre.avgEnergy) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Danceability:</span>
                  <span className="text-white font-medium">{(parseFloat(genre.avgDanceability) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Genres
