import Papa from 'papaparse'

let cachedData = null

/**
 * Loads and parses the CSV file from the public directory
 * @returns {Promise<Array>} Array of track objects
 */
export async function loadTrackData() {
  // Return cached data if available
  if (cachedData) {
    return cachedData
  }

  try {
    const response = await fetch('/tracks_cleaned.csv')
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }
    
    const csvText = await response.text()
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          cachedData = results.data
          resolve(results.data)
        },
        error: (error) => {
          reject(error)
        },
      })
    })
  } catch (error) {
    console.error('Error loading track data:', error)
    throw error
  }
}

/**
 * Formats duration from milliseconds to MM:SS
 */
export function formatDuration(ms) {
  if (!ms || isNaN(ms)) return '0:00'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Formats popularity as a percentage
 */
export function formatPopularity(popularity) {
  return `${popularity || 0}%`
}

/**
 * Get unique artists from tracks
 */
export function getUniqueArtists(tracks) {
  const artistMap = new Map()
  tracks.forEach(track => {
    const artist = track.artist_clean || track.artists
    if (artist && !artistMap.has(artist)) {
      artistMap.set(artist, {
        name: artist,
        trackCount: 0,
        avgPopularity: 0,
        genres: new Set(),
      })
    }
    if (artist) {
      const artistData = artistMap.get(artist)
      artistData.trackCount++
      artistData.avgPopularity += (track.popularity || 0)
      if (track.track_genre_clean) {
        artistData.genres.add(track.track_genre_clean)
      }
    }
  })
  
  return Array.from(artistMap.values()).map(artist => ({
    ...artist,
    avgPopularity: Math.round(artist.avgPopularity / artist.trackCount),
    genres: Array.from(artist.genres),
  })).sort((a, b) => b.trackCount - a.trackCount)
}

/**
 * Get genre statistics
 */
export function getGenreStats(tracks) {
  const genreMap = new Map()
  tracks.forEach(track => {
    const genre = track.track_genre_clean || track.track_genre || 'Unknown'
    if (!genreMap.has(genre)) {
      genreMap.set(genre, {
        name: genre,
        count: 0,
        avgPopularity: 0,
        avgEnergy: 0,
        avgDanceability: 0,
        avgValence: 0,
      })
    }
    const genreData = genreMap.get(genre)
    genreData.count++
    genreData.avgPopularity += (track.popularity || 0)
    genreData.avgEnergy += (track.energy || 0)
    genreData.avgDanceability += (track.danceability || 0)
    genreData.avgValence += (track.valence || 0)
  })
  
  return Array.from(genreMap.values()).map(genre => ({
    ...genre,
    avgPopularity: Math.round(genre.avgPopularity / genre.count),
    avgEnergy: (genre.avgEnergy / genre.count).toFixed(3),
    avgDanceability: (genre.avgDanceability / genre.count).toFixed(3),
    avgValence: (genre.avgValence / genre.count).toFixed(3),
  })).sort((a, b) => b.count - a.count)
}

/**
 * Calculate artist momentum based on popularity and track performance
 * Momentum = (avgPopularity * trackCount) / 100 + (highPopularityTracks * 2)
 */
export function getArtistMomentum(tracks) {
  const artistMap = new Map()
  const overallAvgPopularity = tracks.reduce((sum, t) => sum + (t.popularity || 0), 0) / tracks.length
  
  tracks.forEach(track => {
    const artist = track.artist_clean || track.artists
    if (!artist) return
    
    if (!artistMap.has(artist)) {
      artistMap.set(artist, {
        name: artist,
        trackCount: 0,
        totalPopularity: 0,
        highPopularityTracks: 0, // tracks with popularity > 70
        veryHighPopularityTracks: 0, // tracks with popularity > 85
        avgPopularity: 0,
        momentum: 0,
      })
    }
    
    const artistData = artistMap.get(artist)
    artistData.trackCount++
    artistData.totalPopularity += (track.popularity || 0)
    
    if (track.popularity > 70) artistData.highPopularityTracks++
    if (track.popularity > 85) artistData.veryHighPopularityTracks++
  })
  
  return Array.from(artistMap.values())
    .filter(artist => artist.trackCount >= 3) // Only artists with 3+ tracks
    .map(artist => {
      artist.avgPopularity = Math.round(artist.totalPopularity / artist.trackCount)
      // Momentum score: combines popularity, track count, and high-performing tracks
      artist.momentum = Math.round(
        (artist.avgPopularity * artist.trackCount) / 100 + 
        (artist.highPopularityTracks * 2) + 
        (artist.veryHighPopularityTracks * 5) +
        (artist.avgPopularity > overallAvgPopularity ? 10 : 0)
      )
      return artist
    })
    .sort((a, b) => b.momentum - a.momentum)
}

/**
 * Get rising artists (high momentum relative to track count)
 */
export function getRisingArtists(tracks) {
  const momentum = getArtistMomentum(tracks)
  return momentum
    .filter(artist => artist.trackCount <= 20) // Focus on artists with fewer tracks
    .sort((a, b) => {
      // Sort by momentum per track (efficiency)
      const aEfficiency = a.momentum / a.trackCount
      const bEfficiency = b.momentum / b.trackCount
      return bEfficiency - aEfficiency
    })
    .slice(0, 20)
}

/**
 * Get genre growth trends (using popularity as proxy for growth)
 */
export function getGenreGrowthTrends(tracks) {
  const genreStats = getGenreStats(tracks)
  const overallAvgPopularity = tracks.reduce((sum, t) => sum + (t.popularity || 0), 0) / tracks.length
  
  return genreStats.map(genre => ({
    ...genre,
    growthScore: Math.round(
      (genre.avgPopularity - overallAvgPopularity) * (genre.count / 100)
    ),
    trend: genre.avgPopularity > overallAvgPopularity ? 'rising' : 'stable',
  })).sort((a, b) => b.growthScore - a.growthScore)
}
