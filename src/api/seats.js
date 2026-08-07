const STORAGE_KEY = 'seat_configuration_layout_v1'

const defaultLayout = {
  rows: 8,
  columns: 12,
  seatStates: {},
}

const defaultStorage = {
  selectedTheater: 'Grand Cinema Plaza',
  selectedScreen: 'Screen 1',
  layouts: {
    'Grand Cinema Plaza|Screen 1': defaultLayout,
  },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStorage
    const parsed = JSON.parse(raw)
    return {
      selectedTheater: parsed.selectedTheater || defaultStorage.selectedTheater,
      selectedScreen: parsed.selectedScreen || defaultStorage.selectedScreen,
      layouts: parsed.layouts || defaultStorage.layouts,
    }
  } catch (error) {
    return defaultStorage
  }
}

function save(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export async function getSeatLayout() {
  return new Promise((resolve) => setTimeout(() => resolve(load()), 80))
}

export async function saveSeatLayout(store) {
  return new Promise((resolve) => {
    save(store)
    setTimeout(() => resolve(store), 80)
  })
}

export async function resetSeatLayout(store) {
  const key = `${store.selectedTheater}|${store.selectedScreen}`
  const layouts = { ...store.layouts, [key]: { ...defaultLayout, seatStates: {} } }
  const result = { ...store, layouts }
  save(result)
  return new Promise((resolve) => setTimeout(() => resolve(result), 80))
}
