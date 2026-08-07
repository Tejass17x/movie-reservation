const STORAGE_KEY = 'screens_mock_v1'

const seed = [
  {
    id: 's1',
    name: 'Screen 1',
    theater: 'Grand Cinema Plaza',
    totalSeats: 180,
    rows: 10,
    seatsPerRow: 18,
    screenType: 'IMAX',
    soundType: 'Dolby Atmos',
    status: 'Active',
  },
  {
    id: 's2',
    name: 'Screen 2',
    theater: 'Riverside Screens',
    totalSeats: 140,
    rows: 7,
    seatsPerRow: 20,
    screenType: '3D',
    soundType: 'DTS',
    status: 'Active',
  },
  {
    id: 's3',
    name: 'IMAX Hall',
    theater: 'Grand Cinema Plaza',
    totalSeats: 350,
    rows: 14,
    seatsPerRow: 25,
    screenType: 'IMAX',
    soundType: 'Dolby Atmos',
    status: 'Active',
  },
  {
    id: 's4',
    name: 'Screen 3',
    theater: 'Grand Cinema Plaza',
    totalSeats: 120,
    rows: 8,
    seatsPerRow: 15,
    screenType: '2D',
    soundType: 'DTS',
    status: 'Active',
  },
  {
    id: 's5',
    name: 'Main Screen',
    theater: 'Downtown IMAX Theater',
    totalSeats: 400,
    rows: 16,
    seatsPerRow: 25,
    screenType: 'IMAX',
    soundType: 'Dolby Atmos',
    status: 'Active',
  },
  {
    id: 's6',
    name: 'Screen B',
    theater: 'Downtown IMAX Theater',
    totalSeats: 200,
    rows: 10,
    seatsPerRow: 20,
    screenType: '3D',
    soundType: 'DTS',
    status: 'Active',
  },
  {
    id: 's7',
    name: 'Screen A',
    theater: 'Moonlight Cinema',
    totalSeats: 250,
    rows: 12,
    seatsPerRow: 21,
    screenType: '2D',
    soundType: 'DTS',
    status: 'Active',
  },
  {
    id: 's8',
    name: 'Screen B',
    theater: 'Moonlight Cinema',
    totalSeats: 180,
    rows: 9,
    seatsPerRow: 20,
    screenType: '3D',
    soundType: 'Dolby Atmos',
    status: 'Inactive',
  },
  {
    id: 's9',
    name: 'IMAX Screen',
    theater: 'PVR IMAX Nexus',
    totalSeats: 380,
    rows: 15,
    seatsPerRow: 26,
    screenType: 'IMAX',
    soundType: 'Dolby Atmos',
    status: 'Active',
  },
  {
    id: 's10',
    name: 'Screen 2',
    theater: 'PVR IMAX Nexus',
    totalSeats: 160,
    rows: 8,
    seatsPerRow: 20,
    screenType: '2D',
    soundType: 'DTS',
    status: 'Active',
  },
  {
    id: 's11',
    name: 'Screen 1',
    theater: 'INOX Leisure City',
    totalSeats: 220,
    rows: 11,
    seatsPerRow: 20,
    screenType: '3D',
    soundType: 'Dolby Atmos',
    status: 'Active',
  },
  {
    id: 's12',
    name: 'Screen 2',
    theater: 'INOX Leisure City',
    totalSeats: 140,
    rows: 7,
    seatsPerRow: 20,
    screenType: '2D',
    soundType: 'DTS',
    status: 'Active',
  },
  {
    id: 's13',
    name: 'Screen 3',
    theater: 'INOX Leisure City',
    totalSeats: 100,
    rows: 5,
    seatsPerRow: 20,
    screenType: '2D',
    soundType: 'DTS',
    status: 'Active',
  },
  {
    id: 's14',
    name: 'Royal Screen',
    theater: 'Cinepolis Royal',
    totalSeats: 300,
    rows: 12,
    seatsPerRow: 25,
    screenType: 'IMAX',
    soundType: 'Dolby Atmos',
    status: 'Active',
  },
  {
    id: 's15',
    name: 'Screen 2',
    theater: 'Cinepolis Royal',
    totalSeats: 180,
    rows: 9,
    seatsPerRow: 20,
    screenType: '3D',
    soundType: 'DTS',
    status: 'Active',
  },
  {
    id: 's16',
    name: 'Screen 1',
    theater: 'Riverside Screens',
    totalSeats: 150,
    rows: 10,
    seatsPerRow: 15,
    screenType: '2D',
    soundType: 'DTS',
    status: 'Active',
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

function writeStore(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export async function getScreens() {
  return new Promise((resolve) => setTimeout(() => resolve(readStore()), 100))
}

export async function addScreen(payload) {
  const list = readStore()
  const record = { id: 's' + Date.now(), ...payload }
  list.unshift(record)
  writeStore(list)
  return record
}

export async function updateScreen(id, updates) {
  const list = readStore()
  const index = list.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Screen not found')
  list[index] = { ...list[index], ...updates }
  writeStore(list)
  return list[index]
}

export async function deleteScreen(id) {
  const list = readStore().filter((item) => item.id !== id)
  writeStore(list)
  return true
}
