import { useState } from 'react'

const empty = {
  movie: '',
  theater: '',
  screen: '',
  date: '',
  startTime: '10:00',
  endTime: '12:00',
  language: 'English',
  format: '2D',
  standardPrice: 10,
  vipPrice: 18,
  status: 'Active',
}

export default function ShowtimeForm({ showtime, onClose, onSubmit }) {
  const [form, setForm] = useState(showtime ? { ...showtime } : empty)

  function change(e) {
    const { name, value } = e.target
    setForm((current) => ({
      ...current,
      [name]: name === 'standardPrice' || name === 'vipPrice' ? Number(value) : value,
    }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.movie || !form.theater || !form.screen || !form.date) {
      return alert('Movie, theater, screen, and date are required.')
    }
    if (form.endTime <= form.startTime) {
      return alert('End time must be later than start time.')
    }
    onSubmit(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="showtime-form" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <h3>{showtime ? 'Edit Showtime' : 'Add Showtime'}</h3>
        <div className="row">
          <label>
            Movie
            <input name="movie" value={form.movie} onChange={change} />
          </label>
          <label>
            Theater
            <input name="theater" value={form.theater} onChange={change} />
          </label>
        </div>
        <div className="row">
          <label>
            Screen
            <input name="screen" value={form.screen} onChange={change} />
          </label>
          <label>
            Date
            <input type="date" name="date" value={form.date} onChange={change} />
          </label>
        </div>
        <div className="row">
          <label>
            Start Time
            <input type="time" name="startTime" value={form.startTime} onChange={change} />
          </label>
          <label>
            End Time
            <input type="time" name="endTime" value={form.endTime} onChange={change} />
          </label>
        </div>
        <div className="row">
          <label>
            Language
            <select name="language" value={form.language} onChange={change}>
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </label>
          <label>
            Format
            <select name="format" value={form.format} onChange={change}>
              <option>2D</option>
              <option>3D</option>
              <option>IMAX</option>
            </select>
          </label>
        </div>
        <div className="row">
          <label>
            Standard Price
            <input type="number" name="standardPrice" value={form.standardPrice} onChange={change} />
          </label>
          <label>
            VIP Price
            <input type="number" name="vipPrice" value={form.vipPrice} onChange={change} />
          </label>
        </div>
        <label>
          Status
          <select name="status" value={form.status} onChange={change}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save</button>
        </div>
      </form>
    </div>
  )
}
