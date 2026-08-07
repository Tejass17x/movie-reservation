const STORAGE_KEY = 'movies_mock_v2'

const seed = [
  {
    id: 'm1',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    title: 'RRR',
    description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting back against the British Raj.',
    genre: 'Action',
    language: 'Telugu',
    duration: 187,
    rating: 7.8,
    releaseDate: '2022-03-25',
    certificate: 'UA',
    format: 'IMAX',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm2',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: 'Sci-Fi',
    language: 'English',
    duration: 169,
    rating: 8.4,
    releaseDate: '2014-11-07',
    certificate: 'PG-13',
    format: 'IMAX',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm3',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest psychological tests of his ability to fight injustice.',
    genre: 'Action',
    language: 'English',
    duration: 152,
    rating: 9.0,
    releaseDate: '2008-07-18',
    certificate: 'PG-13',
    format: '2D',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm4',
    poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    title: 'John Wick: Chapter 4',
    description: 'John Wick uncovers a path to defeating The High Table, but he must first face a new enemy with powerful alliances across the globe.',
    genre: 'Action',
    language: 'English',
    duration: 169,
    rating: 7.7,
    releaseDate: '2023-03-24',
    certificate: 'R',
    format: 'IMAX',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm5',
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genre: 'Sci-Fi',
    language: 'English',
    duration: 166,
    rating: 8.3,
    releaseDate: '2024-03-01',
    certificate: 'PG-13',
    format: 'IMAX',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm6',
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    title: 'Oppenheimer',
    description: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    genre: 'Drama',
    language: 'English',
    duration: 180,
    rating: 8.0,
    releaseDate: '2023-07-21',
    certificate: 'R',
    format: 'IMAX',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm7',
    poster: 'https://image.tmdb.org/t/p/w500/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions.',
    genre: 'Action',
    language: 'English',
    duration: 181,
    rating: 8.3,
    releaseDate: '2019-04-26',
    certificate: 'PG-13',
    format: '3D',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm8',
    poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    title: 'Jawan',
    description: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
    genre: 'Action',
    language: 'Hindi',
    duration: 169,
    rating: 7.1,
    releaseDate: '2023-09-07',
    certificate: 'UA',
    format: '3D',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm9',
    poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    title: 'Pathaan',
    description: 'An Indian agent races against time to stop a rogue terrorist from unleashing a deadly bio-weapon.',
    genre: 'Action',
    language: 'Hindi',
    duration: 146,
    rating: 6.0,
    releaseDate: '2023-01-25',
    certificate: 'UA',
    format: '3D',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm10',
    poster: 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',
    title: 'KGF: Chapter 2',
    description: 'Rocky\'s time has come to rise against all odds as he battles for power in the world of gold and blood.',
    genre: 'Action',
    language: 'Kannada',
    duration: 168,
    rating: 8.2,
    releaseDate: '2022-04-14',
    certificate: 'UA',
    format: 'IMAX',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm11',
    poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    title: 'Baahubali 2: The Conclusion',
    description: 'When Shiva learns that his father was once the mighty king of Mahishmati, he sets out on an epic journey to reclaim the throne.',
    genre: 'Action',
    language: 'Telugu',
    duration: 167,
    rating: 8.2,
    releaseDate: '2017-04-28',
    certificate: 'UA',
    format: 'IMAX',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm12',
    poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    title: 'Spider-Man: No Way Home',
    description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    genre: 'Action',
    language: 'English',
    duration: 148,
    rating: 8.3,
    releaseDate: '2021-12-17',
    certificate: 'PG-13',
    format: '3D',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm13',
    poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    title: 'Pushpa: The Rise',
    description: 'Pushpa Raj is a daily-wage laborer who rises through the ranks of a red sandalwood smuggling syndicate.',
    genre: 'Action',
    language: 'Telugu',
    duration: 179,
    rating: 7.6,
    releaseDate: '2021-12-17',
    certificate: 'UA',
    format: '2D',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm14',
    poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    title: 'Vikram',
    description: 'A special investigator is assigned to track down a serial killer who is targeting ex-special forces members.',
    genre: 'Action',
    language: 'Tamil',
    duration: 174,
    rating: 8.2,
    releaseDate: '2022-06-03',
    certificate: 'UA',
    format: '2D',
    trailer: '',
    status: 'Now Showing',
  },
  {
    id: 'm15',
    poster: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genre: 'Sci-Fi',
    language: 'English',
    duration: 148,
    rating: 8.8,
    releaseDate: '2010-07-16',
    certificate: 'PG-13',
    format: '2D',
    trailer: '',
    status: 'Now Showing',
  },
]

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed.slice()
    const parsed = JSON.parse(raw)
    // Auto-restore the sample lineup if the store is empty or malformed,
    // so the Movies page never shows "No movies found" unexpectedly.
    if (!Array.isArray(parsed) || parsed.length === 0) return seed.slice()
    return parsed
  } catch (e) {
    return seed.slice()
  }
}

function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function getMovies() {
  return new Promise((res) => setTimeout(() => res(readStore()), 120)
  )
}

export async function getMovieById(id) {
  const items = readStore()
  return items.find((m) => m.id === id) || null
}

export async function addMovie(payload) {
  const items = readStore()
  const id = 'm' + Date.now()
  const movie = { id, ...payload }
  items.unshift(movie)
  writeStore(items)
  return movie
}

export async function updateMovie(id, updates) {
  const items = readStore()
  const idx = items.findIndex((m) => m.id === id)
  if (idx === -1) throw new Error('Not found')
  items[idx] = { ...items[idx], ...updates }
  writeStore(items)
  return items[idx]
}

export async function deleteMovie(id) {
  let items = readStore()
  items = items.filter((m) => m.id !== id)
  writeStore(items)
  return true
}

