const STORAGE_KEY = 'showtimes_mock_v1'

const seed = [
  {
    id: 'st1',
    movie: 'Nebula Nights',
    theater: 'Grand Cinema Plaza',
    screen: 'Screen 1',
    date: '2025-12-05',
    startTime: '18:00',
    endTime: '21:00',
    language: 'English',
    format: 'IMAX',
    standardPrice: 15,
    vipPrice: 25,
    status: 'Active',
  },
  {
    id: 'st2',
    movie: 'Romance by the Lake',
    theater: 'Riverside Screens',
    screen: 'Screen 2',
    date: '2025-12-08',
    startTime: '20:00',
    endTime: '22:00',
    language: 'English',
    format: '2D',
    standardPrice: 12,
    vipPrice: 20,
    status: 'Upcoming',
  },
]

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed.slice()
    return JSON.parse(raw)
  } catch (error) {
    return seed.slice()
  }
}

function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function getShowtimes() {
  return new Promise((resolve) => setTimeout(() => resolve(readStore()), 100))
}

export async function addShowtime(payload) {
  const list = readStore()
  const record = { id: 'st' + Date.now(), ...payload }
  list.unshift(record)
  writeStore(list)
  return record
}

export async function updateShowtime(id, updates) {
  const list = readStore()
  const index = list.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Showtime not found')
  list[index] = { ...list[index], ...updates }
  writeStore(list)
  return list[index]
}

export async function deleteShowtime(id) {
  const list = readStore().filter((item) => item.id !== id)
  writeStore(list)
  return true
}
