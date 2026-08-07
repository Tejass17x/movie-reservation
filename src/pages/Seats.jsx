import { useEffect, useMemo, useState } from 'react'
import { getSeatLayout, saveSeatLayout, resetSeatLayout } from '../api/seats'
import SeatMap from '../components/seats/SeatMap'
import ConfirmDialog from '../components/movies/ConfirmDialog'
import '../styles/seats.css'

const theaters = [
  { name: 'Grand Cinema Plaza', screens: ['Screen 1', 'Screen 2', 'IMAX Hall'] },
  { name: 'Riverside Screens', screens: ['Screen 1', 'Screen 2'] },
  { name: 'Downtown Hall', screens: ['Main Screen'] },
]

const tools = ['Standard', 'VIP', 'Blocked', 'Maintenance']

const DEFAULT_ROWS = 8
const DEFAULT_COLUMNS = 12

function defaultLayout() {
  return { rows: DEFAULT_ROWS, columns: DEFAULT_COLUMNS, seatStates: {} }
}

export default function Seats() {
  const [store, setStore] = useState({ selectedTheater: 'Grand Cinema Plaza', selectedScreen: 'Screen 1', layouts: {} })
  const [layout, setLayout] = useState(defaultLayout())
  const [activeTool, setActiveTool] = useState('VIP')
  const [selected, setSelected] = useState([])
  const [message, setMessage] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    getSeatLayout().then((data) => {
      setStore(data)
      const key = `${data.selectedTheater}|${data.selectedScreen}`
      setLayout(data.layouts[key] || defaultLayout())
    })
  }, [])

  function getCurrentKey(theater, screen) {
    return `${theater}|${screen}`
  }

  function loadLayout(theater, screen) {
    const key = getCurrentKey(theater, screen)
    const nextLayout = store.layouts[key] || defaultLayout()
    setStore((current) => ({ ...current, selectedTheater: theater, selectedScreen: screen }))
    setLayout(nextLayout)
    setSelected([])
    setMessage(`Loaded ${theater} / ${screen}`)
  }

  const stats = useMemo(() => {
    const total = layout.rows * layout.columns
    const counts = { Standard: 0, VIP: 0, Blocked: 0, Maintenance: 0 }
    Object.values(layout.seatStates).forEach((state) => {
      if (counts[state] !== undefined) counts[state]++
    })
    const selectedCount = selected.length
    const standard = total - counts.VIP - counts.Blocked - counts.Maintenance
    return {
      total,
      standard,
      vip: counts.VIP,
      blocked: counts.Blocked,
      maintenance: counts.Maintenance,
      selected: selectedCount,
    }
  }, [layout, selected])

  function updateSeatSelection(key) {
    setSelected((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key)
      return [...current, key]
    })
  }

  function selectRow(rowIndex) {
    const rowKeys = Array.from({ length: layout.columns }, (_, col) => `${rowIndex}-${col}`)
    setSelected((current) => {
      const allSelected = rowKeys.every((key) => current.includes(key))
      if (allSelected) {
        return current.filter((key) => !rowKeys.includes(key))
      }
      return Array.from(new Set([...current, ...rowKeys]))
    })
  }

  function selectAll() {
    if (selected.length === layout.rows * layout.columns) {
      setSelected([])
      setMessage('Cleared all seat selections.')
      return
    }
    const allKeys = Array.from({ length: layout.rows }, (_, row) =>
      Array.from({ length: layout.columns }, (_, col) => `${row}-${col}`),
    ).flat()
    setSelected(allKeys)
    setMessage(`Selected all ${allKeys.length} seats.`)
  }

  function applyTool() {
    const seatStates = { ...layout.seatStates }
    selected.forEach((key) => {
      seatStates[key] = activeTool
    })
    setLayout((current) => ({ ...current, seatStates }))
    setMessage(`Applied ${activeTool} to ${selected.length} seat${selected.length === 1 ? '' : 's'}.`)
    setSelected([])
  }

  function clearSelection() {
    setSelected([])
    setMessage('Selection cleared.')
  }

  function handleSave() {
    const key = getCurrentKey(store.selectedTheater, store.selectedScreen)
    const updated = {
      ...store,
      layouts: { ...store.layouts, [key]: layout },
      selectedTheater: store.selectedTheater,
      selectedScreen: store.selectedScreen,
    }
    saveSeatLayout(updated).then(() => {
      setStore(updated)
      setMessage('Layout saved successfully.')
    })
  }

  function handleReset() {
    setConfirmReset(true)
  }

  function confirmResetLayout() {
    resetSeatLayout(store).then((data) => {
      const key = getCurrentKey(store.selectedTheater, store.selectedScreen)
      setStore(data)
      setLayout(data.layouts[key] || defaultLayout())
      setSelected([])
      setMessage('Layout reset to default.')
      setConfirmReset(false)
    })
  }

  const currentTheater = theaters.find((item) => item.name === store.selectedTheater) || theaters[0]

  return (
    <div className="seats-page">
      <div className="seats-header">
        <div>
          <h2>Seat Configuration</h2>
          <p>Configure theater seating layouts with real-time type updates and saved layouts.</p>
        </div>
        <div className="selection-panel">
          <label>
            Theater
            <select value={store.selectedTheater} onChange={(e) => loadLayout(e.target.value, currentTheater.screens[0])}>
              {theaters.map((item) => (
                <option key={item.name} value={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
          <label>
            Screen
            <select value={store.selectedScreen} onChange={(e) => loadLayout(store.selectedTheater, e.target.value)}>
              {currentTheater.screens.map((screen) => (
                <option key={screen} value={screen}>{screen}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="seat-controls">
        <div className="tool-list">
          {tools.map((tool) => (
            <button key={tool} className={tool === activeTool ? 'active' : ''} onClick={() => setActiveTool(tool)}>{tool}</button>
          ))}
        </div>
        <div className="action-buttons">
          <button className="btn" onClick={selectAll}>Select All</button>
          <button className="btn" onClick={applyTool} disabled={!selected.length}>Set Selected</button>
          <button className="btn" onClick={clearSelection} disabled={!selected.length}>Clear Selection</button>
          <button className="btn primary" onClick={handleSave}>Save Layout</button>
          <button className="btn danger" onClick={handleReset}>Reset Layout</button>
        </div>
      </div>

      <div className="seat-stats">
        <div><span>Total Seats</span><strong>{stats.total}</strong></div>
        <div><span>Standard</span><strong>{stats.standard}</strong></div>
        <div><span>VIP</span><strong>{stats.vip}</strong></div>
        <div><span>Maintenance</span><strong>{stats.maintenance}</strong></div>
        <div><span>Blocked</span><strong>{stats.blocked}</strong></div>
        <div><span>Selected</span><strong>{stats.selected}</strong></div>
      </div>

      <div className="legend-panel">
        <span className="legend standard"><em /> Standard</span>
        <span className="legend vip"><em /> VIP</span>
        <span className="legend blocked"><em /> Blocked</span>
        <span className="legend maintenance"><em /> Maintenance</span>
      </div>

      <SeatMap
        rows={layout.rows}
        columns={layout.columns}
        seatStates={layout.seatStates}
        selected={selected}
        onSeatClick={updateSeatSelection}
        onRowSelect={selectRow}
      />

      {message && <div className="toast">{message}</div>}
      {confirmReset && (
        <ConfirmDialog
          title="Reset this layout?"
          onCancel={() => setConfirmReset(false)}
          onConfirm={confirmResetLayout}
        />
      )}
    </div>
  )
}

