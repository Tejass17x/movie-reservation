import { useState } from 'react'

const empty = {
  name: '',
  theater: '',
  totalSeats: 100,
  rows: 10,
  seatsPerRow: 10,
  screenType: '2D',
  soundType: 'Dolby Atmos',
  status: 'Active',
}

export default function ScreenForm({ screen, onClose, onSubmit }) {
  const [form, setForm] = useState(screen ? { ...screen } : empty)

  function change(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: name === 'totalSeats' || name === 'rows' || name === 'seatsPerRow' ? Number(value) : value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.name || !form.theater) {
      return alert('Name and theater are required')
    }
    onSubmit(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="screen-form" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <h3>{screen ? 'Edit Screen' : 'Add Screen'}</h3>
        <label>
          Screen Name
          <input name="name" value={form.name} onChange={change} />
        </label>
        <label>
          Theater
          <input name="theater" value={form.theater} onChange={change} />
        </label>
        <div className="row">
          <label>
            Total Seats
            <input type="number" name="totalSeats" value={form.totalSeats} onChange={change} />
          </label>
          <label>
            Rows
            <input type="number" name="rows" value={form.rows} onChange={change} />
          </label>
        </div>
        <div className="row">
          <label>
            Seats Per Row
            <input type="number" name="seatsPerRow" value={form.seatsPerRow} onChange={change} />
          </label>
          <label>
            Screen Type
            <select name="screenType" value={form.screenType} onChange={change}>
              <option>2D</option>
              <option>3D</option>
              <option>IMAX</option>
            </select>
          </label>
        </div>
        <div className="row">
          <label>
            Sound Type
            <select name="soundType" value={form.soundType} onChange={change}>
              <option>Dolby Atmos</option>
              <option>DTS</option>
              <option>Standard</option>
            </select>
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={change}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save</button>
        </div>
      </form>
    </div>
  )
}
