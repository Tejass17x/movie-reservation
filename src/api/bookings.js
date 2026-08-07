const STORAGE_KEY = 'bookings_mock_v1'

const seed = [
  {
    id: 'b1',
    bookingId: 'BKG-001',
    movie: 'Nebula Nights',
    theater: 'Grand Cinema Plaza',
    screen: 'IMAX Hall',
    date: '2025-12-05',
    time: '18:00',
    seats: 'A1, A2, A3',
    amount: 45,
    status: 'Confirmed',
    customer: 'John Smith',
    email: 'john@example.com',
    phone: '+1-555-1111',
  },
  {
    id: 'b2',
    bookingId: 'BKG-002',
    movie: 'Romance by the Lake',
    theater: 'Riverside Screens',
    screen: 'Screen 2',
    date: '2025-12-08',
    time: '20:00',
    seats: 'B4, B5',
    amount: 24,
    status: 'Pending',
    customer: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1-555-2222',
  },
  {
    id: 'b3',
    bookingId: 'BKG-003',
    movie: 'Baahubali: The Crown',
    theater: 'Grand Cinema Plaza',
    screen: 'Screen 1',
    date: '2025-12-06',
    time: '14:30',
    seats: 'C1, C2, C3, C4',
    amount: 60,
    status: 'Confirmed',
    customer: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '+91-9876543210',
  },
  {
    id: 'b4',
    bookingId: 'BKG-004',
    movie: 'The Matrix Reborn',
    theater: 'Downtown IMAX Theater',
    screen: 'Main Screen',
    date: '2025-12-07',
    time: '21:00',
    seats: 'D10, D11, D12',
    amount: 52.5,
    status: 'Cancelled',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-3333',
  },
  {
    id: 'b5',
    bookingId: 'BKG-005',
    movie: 'Pathaan Returns',
    theater: 'PVR IMAX Nexus',
    screen: 'IMAX Screen',
    date: '2025-12-09',
    time: '19:00',
    seats: 'E5, E6, E7, E8, E9',
    amount: 100,
    status: 'Confirmed',
    customer: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91-8765432109',
  },
  {
    id: 'b6',
    bookingId: 'BKG-006',
    movie: 'The Grand Budapest Mystery',
    theater: 'Moonlight Cinema',
    screen: 'Screen A',
    date: '2025-12-10',
    time: '16:00',
    seats: 'F1, F2',
    amount: 20,
    status: 'Pending',
    customer: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+1-555-4444',
  },
  {
    id: 'b7',
    bookingId: 'BKG-007',
    movie: 'Pushpa: The Rule',
    theater: 'INOX Leisure City',
    screen: 'Screen 1',
    date: '2025-12-11',
    time: '18:30',
    seats: 'G7, G8, G9, G10',
    amount: 80,
    status: 'Confirmed',
    customer: 'Arjun Reddy',
    email: 'arjun@example.com',
    phone: '+91-7654321098',
  },
  {
    id: 'b8',
    bookingId: 'BKG-008',
    movie: 'Nebula Nights',
    theater: 'Cinepolis Royal',
    screen: 'Royal Screen',
    date: '2025-12-12',
    time: '20:30',
    seats: 'H3, H4',
    amount: 35,
    status: 'Pending',
    customer: 'Jessica Taylor',
    email: 'jessica@example.com',
    phone: '+1-555-5555',
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

export async function getBookings() {
  return new Promise((resolve) => setTimeout(() => resolve(readStore()), 100))
}

export async function getBookingById(id) {
  const items = readStore()
  return items.find((b) => b.id === id) || null
}

export async function addBooking(payload) {
  const items = readStore()
  const id = 'b' + Date.now()
  const bookingId = 'BKG-' + String(items.length + 1).padStart(3, '0')
  const record = { id, bookingId, ...payload }
  items.unshift(record)
  writeStore(items)
  return record
}

export async function updateBooking(id, updates) {
  const items = readStore()
  const index = items.findIndex((b) => b.id === id)
  if (index === -1) throw new Error('Booking not found')
  items[index] = { ...items[index], ...updates }
  writeStore(items)
  return items[index]
}

export async function deleteBooking(id) {
  const items = readStore().filter((b) => b.id !== id)
  writeStore(items)
  return true
}
