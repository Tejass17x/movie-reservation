import { Fragment } from 'react'

const seatLabel = (row, col) => `${String.fromCharCode(65 + row)}${col + 1}`

export default function SeatMap({ rows, columns, seatStates, selected, onSeatClick, onRowSelect }) {
  const rowLabels = Array.from({ length: rows }, (_, row) => String.fromCharCode(65 + row))
  const colLabels = Array.from({ length: columns }, (_, col) => col + 1)

  return (
    <div className="seat-map-wrapper">
      <div className="screen-indicator">Screen</div>
      <div className="seat-grid" style={{ gridTemplateColumns: `48px repeat(${columns}, minmax(42px, 1fr))` }}>
        <div className="grid-corner" />
        {colLabels.map((number) => (
          <div key={`col-${number}`} className="col-label">{number}</div>
        ))}
        {rowLabels.map((label, rowIndex) => {
          const rowKeys = Array.from({ length: columns }, (_, col) => `${rowIndex}-${col}`)
          const rowFullySelected = rowKeys.every((key) => selected.includes(key))
          return (
            <Fragment key={`row-${label}`}>
              <button
                type="button"
                className={`row-label ${rowFullySelected ? 'selected' : ''}`}
                onClick={() => onRowSelect(rowIndex)}
                title={`Select row ${label}`}
              >
                {label}
              </button>
              {colLabels.map((_, colIndex) => {
                const key = `${rowIndex}-${colIndex}`
                const state = seatStates[key] || 'Standard'
                const isSelected = selected.includes(key)
                const unavailable = state === 'Blocked' || state === 'Maintenance'
                return (
                  <button
                    key={key}
                    type="button"
                    className={`seat ${state.toLowerCase()} ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSeatClick(key)}
                    title={`${seatLabel(rowIndex, colIndex)} — ${state}`}
                    aria-label={`${seatLabel(rowIndex, colIndex)} ${state}`}
                  >
                    <span className="label">{seatLabel(rowIndex, colIndex)}</span>
                    {unavailable && <span className="seat-overlay">✕</span>}
                  </button>
                )
              })}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

