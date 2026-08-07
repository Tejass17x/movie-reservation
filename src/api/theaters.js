const THEATER_KEY = 'theaters_mock_v1'

const seed = [
  {
    id: 't1',
    name: 'Grand Cinema Plaza',
    address: '123 Main St',
    city: 'Metropolis',
    state: 'CA',
    contact: '+1-555-1234',
    open: '10:00',
    close: '23:00',
    status: 'Active',
  },
  {
    id: 't2',
    name: 'Riverside Screens',
    address: '45 River Rd',
    city: 'Lakeside',
    state: 'NY',
    contact: '+1-555-5678',
    open: '09:30',
    close: '22:30',
    status: 'Active',
  },
  {
    id: 't3',
    name: 'Downtown IMAX Theater',
    address: '78 Broadway Ave',
    city: 'Metropolis',
    state: 'CA',
    contact: '+1-555-2345',
    open: '08:00',
    close: '01:00',
    status: 'Active',
  },
  {
    id: 't4',
    name: 'Moonlight Cinema',
    address: '12 Oak Boulevard',
    city: 'Star City',
    state: 'TX',
    contact: '+1-555-3456',
    open: '11:00',
    close: '23:30',
    status: 'Active',
  },
  {
    id: 't5',
    name: 'PVR IMAX Nexus',
    address: '56 MG Road, Indiranagar',
    city: 'Bangalore',
    state: 'KA',
    contact: '+91-80-45678900',
    open: '09:00',
    close: '00:00',
    status: 'Active',
  },
  {
    id: 't6',
    name: 'INOX Leisure City',
    address: '22 Park Street, Nehru Place',
    city: 'New Delhi',
    state: 'DL',
    contact: '+91-11-23456789',
    open: '09:30',
    close: '23:45',
    status: 'Active',
  },
  {
    id: 't7',
    name: 'Cinepolis Royal',
    address: '90 Marine Drive, Fort',
    city: 'Mumbai',
    state: 'MH',
    contact: '+91-22-34567890',
    open: '10:00',
    close: '00:30',
    status: 'Active',
  },
]

function read() {
  try {
    const raw = localStorage.getItem(THEATER_KEY)
    if (!raw) return seed.slice()
    return JSON.parse(raw)
  } catch (e) {
    return seed.slice()
  }
}

function write(data) {
  localStorage.setItem(THEATER_KEY, JSON.stringify(data))
}

export async function getTheaters() {
  return new Promise((res) => setTimeout(() => res(read()), 100))
}

export async function getTheaterById(id) {
  return read().find((t) => t.id === id) || null
}

export async function addTheater(payload) {
  const items = read()
  const id = 't' + Date.now()
  const rec = { id, ...payload }
  items.unshift(rec)
  write(items)
  return rec
}

export async function updateTheater(id, updates) {
  const items = read()
  const idx = items.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error('Not found')
  items[idx] = { ...items[idx], ...updates }
  write(items)
  return items[idx]
}

export async function deleteTheater(id) {
  let items = read()
  items = items.filter((t) => t.id !== id)
  write(items)
  return true
}
