import { useState, useEffect, useMemo } from 'react'
import { loadTrackData, formatDuration } from '../utils/csvLoader'
import { getArtistMomentum } from '../utils/csvLoader'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'

function Insights() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  // Audio features correlation
  const featureCorrelation = useMemo(() => {
    const samples = tracks.slice(0, 1000).map(track => ({
      danceability: (track.danceability || 0) * 100,
      energy: (track.energy || 0) * 100,
      valence: (track.valence || 0) * 100,
      popularity: track.popularity || 0,
    }))
    return samples
  }, [tracks])

  // Popularity trends by genre
  const popularityByGenre = useMemo(() => {
    const genreMap = new Map()
    tracks.forEach(track => {
      const genre = track.track_genre_clean || track.track_genre || 'Unknown'
      if (!genreMap.has(genre)) {
        genreMap.set(genre, { count: 0, totalPopularity: 0 })
      }
      const data = genreMap.get(genre)
      data.count++
      data.totalPopularity += (track.popularity || 0)
    })
    
    return Array.from(genreMap.entries())
      .map(([name, data]) => ({
        name,
        avgPopularity: Math.round(data.totalPopularity / data.count),
        count: data.count,
      }))
      .sort((a, b) => b.avgPopularity - a.avgPopularity)
      .slice(0, 15)
  }, [tracks])

  // Duration distribution
  const durationDistribution = useMemo(() => {
    const ranges = {
      '0-2min': 0,
      '2-3min': 0,
      '3-4min': 0,
      '4-5min': 0,
      '5-6min': 0,
      '6+min': 0,
    }
    
    tracks.forEach(track => {
      const minutes = (track.duration_ms || 0) / 60000
      if (minutes < 2) ranges['0-2min']++
      else if (minutes < 3) ranges['2-3min']++
      else if (minutes < 4) ranges['3-4min']++
      else if (minutes < 5) ranges['4-5min']++
      else if (minutes < 6) ranges['5-6min']++
      else ranges['6+min']++
    })
    
    return Object.entries(ranges).map(([name, value]) => ({ name, value }))
  }, [tracks])

  // Energy vs Valence scatter
  const energyValenceData = useMemo(() => {
    return tracks.slice(0, 500).map(track => ({
      energy: (track.energy || 0) * 100,
      valence: (track.valence || 0) * 100,
      popularity: track.popularity || 0,
    }))
  }, [tracks])

  // Explicit content analysis
  const explicitAnalysis = useMemo(() => {
    const explicit = tracks.filter(t => t.explicit === true || t.explicit === 'TRUE').length
    const nonExplicit = tracks.length - explicit
    return [
      { name: 'Explicit', value: explicit },
      { name: 'Non-Explicit', value: nonExplicit },
    ]
  }, [tracks])

  // Key distribution
  const keyDistribution = useMemo(() => {
    const keyMap = new Map()
    const keyNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    
    tracks.forEach(track => {
      const key = track.key
      if (key !== null && key !== undefined) {
        const keyName = keyNames[key] || `Key ${key}`
        keyMap.set(keyName, (keyMap.get(keyName) || 0) + 1)
      }
    })
    
    return Array.from(keyMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [tracks])

  // Release Impact Board - High performing tracks (using popularity as proxy)
  const releaseImpactData = useMemo(() => {
    // Top tracks by popularity (simulating "new releases" impact)
    const topTracks = [...tracks]
      .filter(t => t.popularity > 70)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 20)
      .map(track => ({
        track: track.track_name || 'Unknown',
        artist: track.artist_clean || track.artists || 'Unknown',
        popularity: track.popularity || 0,
        energy: (track.energy || 0) * 100,
        danceability: (track.danceability || 0) * 100,
        impactScore: Math.round(
          (track.popularity || 0) * 0.6 + 
          ((track.energy || 0) * 100) * 0.2 + 
          ((track.danceability || 0) * 100) * 0.2
        ),
      }))

    // Performance indicators by popularity tier
    const performanceTiers = {
      'High Impact (80-100)': 0,
      'Medium Impact (60-79)': 0,
      'Low Impact (<60)': 0,
    }
    
    tracks.forEach(track => {
      const pop = track.popularity || 0
      if (pop >= 80) performanceTiers['High Impact (80-100)']++
      else if (pop >= 60) performanceTiers['Medium Impact (60-79)']++
      else performanceTiers['Low Impact (<60)']++
    })

    return {
      topTracks,
      performanceTiers: Object.entries(performanceTiers).map(([name, value]) => ({ name, value })),
      avgImpactScore: topTracks.length > 0
        ? Math.round(topTracks.reduce((sum, t) => sum + t.impactScore, 0) / topTracks.length)
        : 0,
    }
  }, [tracks])

  // Tempo analysis
  const tempoAnalysis = useMemo(() => {
    const tempos = tracks
      .map(t => t.tempo)
      .filter(t => t && t > 0 && t < 300) // Filter out invalid tempos
    
    if (tempos.length === 0) return null
    
    const avg = tempos.reduce((a, b) => a + b, 0) / tempos.length
    const min = Math.min(...tempos)
    const max = Math.max(...tempos)
    
    // Group into ranges
    const ranges = {
      'Slow (0-80)': 0,
      'Moderate (80-120)': 0,
      'Fast (120-160)': 0,
      'Very Fast (160+)': 0,
    }
    
    tempos.forEach(tempo => {
      if (tempo < 80) ranges['Slow (0-80)']++
      else if (tempo < 120) ranges['Moderate (80-120)']++
      else if (tempo < 160) ranges['Fast (120-160)']++
      else ranges['Very Fast (160+)']++
    })
    
    return {
      avg: Math.round(avg),
      min: Math.round(min),
      max: Math.round(max),
      ranges: Object.entries(ranges).map(([name, value]) => ({ name, value })),
    }
  }, [tracks])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading insights...</p>
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Analytics Insights</h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4">Deep dive into your music data patterns and trends</p>
        
        {/* Information Card */}
        <div className="card bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50 mb-6">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-3xl sm:text-4xl">📊</div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Understanding Music Analytics</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                This page reveals hidden patterns and correlations in your music collection. Discover how audio features 
                relate to popularity, how genres differ in characteristics, and explore the distribution of musical elements.
              </p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• <strong className="text-white">Release Impact Board:</strong> Track high-performing releases and impact scores</li>
                <li>• <strong className="text-white">Popularity Trends:</strong> See which genres have higher average popularity</li>
                <li>• <strong className="text-white">Duration Analysis:</strong> Understand track length distribution</li>
                <li>• <strong className="text-white">Energy vs Valence:</strong> Explore the relationship between intensity and mood</li>
                <li>• <strong className="text-white">Tempo & Key:</strong> Discover musical patterns in BPM and key signatures</li>
                <li>• <strong className="text-white">Feature Correlations:</strong> See how danceability, energy, and valence relate to popularity</li>
              </ul>
              <p className="text-gray-400 text-xs mt-3 italic">
                Note: Geographic/region insights are not available as the dataset doesn't include location data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Total Tracks</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {tracks.length.toLocaleString()}
          </p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Avg Popularity</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {Math.round(tracks.reduce((sum, t) => sum + (t.popularity || 0), 0) / tracks.length)}%
          </p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Explicit Tracks</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {explicitAnalysis[0].value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {((explicitAnalysis[0].value / tracks.length) * 100).toFixed(1)}% of total
          </p>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Avg Tempo</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {tempoAnalysis ? `${tempoAnalysis.avg} BPM` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Popularity by Genre */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-2 text-white">Popularity by Genre (Top 15)</h2>
          <p className="text-sm text-gray-400 mb-4">
            Horizontal bar chart showing average popularity scores for each genre. Longer bars indicate genres 
            with higher average popularity. This helps identify which genres tend to have more mainstream appeal.
          </p>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <BarChart data={popularityByGenre} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" width={150} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="avgPopularity" fill="#0ea5e9" name="Avg Popularity" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Duration Distribution */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-2 text-white">Track Duration Distribution</h2>
          <p className="text-sm text-gray-400 mb-4">
            Area chart showing how tracks are distributed across different duration ranges. Most songs typically 
            fall between 2-5 minutes. This visualization helps understand the typical length of tracks in your collection.
          </p>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <AreaChart data={durationDistribution}>
              <defs>
                <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorDuration)" name="Number of Tracks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Energy vs Valence Scatter */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-2 text-white">Energy vs Valence Analysis</h2>
        <p className="text-gray-400 text-sm mb-4">
          Scatter plot exploring the relationship between energy (intensity) and valence (mood) in tracks. 
          Each point represents a track. Points in the upper-right are high-energy and happy, while lower-left 
          points are calm and melancholic. Bubble size represents popularity.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number" 
              dataKey="energy" 
              name="Energy" 
              unit="%" 
              stroke="#9ca3af"
              label={{ value: 'Energy (%)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
            />
            <YAxis 
              type="number" 
              dataKey="valence" 
              name="Valence" 
              unit="%" 
              stroke="#9ca3af"
              label={{ value: 'Valence (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <ZAxis type="number" dataKey="popularity" range={[50, 500]} name="Popularity" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Scatter name="Tracks" data={energyValenceData} fill="#a855f7" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Tempo and Key Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tempo Distribution */}
        {tempoAnalysis && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-2 text-white">Tempo Distribution</h2>
            <p className="text-sm text-gray-400 mb-4">
              Tempo (BPM - Beats Per Minute) distribution across your collection. Most popular music ranges 
              from 80-160 BPM. This chart shows how tracks are distributed across tempo ranges.
            </p>
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-medium">{tempoAnalysis.avg} BPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Range:</span>
                <span className="text-white font-medium">{tempoAnalysis.min} - {tempoAnalysis.max} BPM</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tempoAnalysis.ranges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="value" fill="#3b82f6" name="Tracks" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Key Distribution */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-2 text-white">Musical Key Distribution</h2>
          <p className="text-sm text-gray-400 mb-4">
            Bar chart showing the distribution of musical keys (C, C#, D, etc.) in your collection. 
            Some keys are more commonly used in popular music than others. This reveals the harmonic 
            preferences in your music library.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={keyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="value" fill="#a855f7" name="Tracks" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Correlation */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-2 text-white">Audio Features Correlation</h2>
        <p className="text-gray-400 text-sm mb-4">
          Line chart showing how audio features (danceability, energy, valence) relate to popularity. 
          This helps identify which musical characteristics tend to correlate with higher popularity scores. 
          Tracks are sampled and plotted against their popularity to reveal trends.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={featureCorrelation.slice(0, 100)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="popularity" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
            <Line type="monotone" dataKey="danceability" stroke="#0ea5e9" name="Danceability (%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="energy" stroke="#3b82f6" name="Energy (%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="valence" stroke="#a855f7" name="Valence (%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Release Impact Board */}
      <div className="mb-8">
        <div className="card bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/50 mb-6">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Release Impact Board</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                Track performance indicators and high-impact releases. Impact scores combine popularity, energy, 
                and danceability to identify tracks with strong performance potential.
              </p>
              <p className="text-gray-400 text-sm italic">
                Note: Without release date data, impact is calculated using popularity and audio features as performance indicators.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="stat-card">
            <h3 className="text-sm font-medium text-gray-400 mb-1">High Impact Tracks</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {releaseImpactData.topTracks.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Tracks with 70+ popularity</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Avg Impact Score</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {releaseImpactData.avgImpactScore}
            </p>
            <p className="text-xs text-gray-500 mt-2">Combined performance metric</p>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-medium text-gray-400 mb-1">High Performers</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {releaseImpactData.performanceTiers.find(t => t.name.includes('High'))?.value || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Tracks with 80+ popularity</p>
          </div>
        </div>

        {/* Performance Tiers Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-2 text-white">Performance Tier Distribution</h2>
            <p className="text-sm text-gray-400 mb-4">
              Distribution of tracks across performance tiers based on popularity scores. 
              High impact tracks (80+) represent top-performing releases.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={releaseImpactData.performanceTiers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="value" fill="#10b981" name="Number of Tracks" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Impact Tracks */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-2 text-white">Top 10 Impact Tracks</h2>
            <p className="text-sm text-gray-400 mb-4">
              Highest performing tracks ranked by impact score (popularity + energy + danceability).
            </p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {releaseImpactData.topTracks.slice(0, 10).map((track, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{track.track}</div>
                      <div className="text-xs text-gray-400">{track.artist}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-400">{track.impactScore}</div>
                      <div className="text-xs text-gray-500">Impact</div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span>Pop: {track.popularity}%</span>
                    <span>Energy: {track.energy.toFixed(0)}%</span>
                    <span>Dance: {track.danceability.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights
