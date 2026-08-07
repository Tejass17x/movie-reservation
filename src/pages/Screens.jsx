import { useEffect, useMemo, useState } from 'react'
import { Plus, Edit, Trash2, SlidersHorizontal } from 'lucide-react'
import { getScreens, addScreen, updateScreen, deleteScreen } from '../api/screens'
import ScreenForm from '../components/screens/ScreenForm'
import ConfirmDialog from '../components/movies/ConfirmDialog'
import '../styles/screens.css'

export default function Screens() {
  const [screens, setScreens] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    setLoading(true)
    getScreens().then((res) => {
      setScreens(res)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    return screens.filter((screen) => screen.name.toLowerCase().includes(query.toLowerCase()) || screen.theater.toLowerCase().includes(query.toLowerCase()))
  }, [screens, query])

  async function handleAdd(payload) {
    const screen = await addScreen(payload)
    setScreens((current) => [screen, ...current])
    setShowForm(false)
  }

  async function handleUpdate(id, payload) {
    const updated = await updateScreen(id, payload)
    setScreens((current) => current.map((item) => (item.id === id ? updated : item)))
    setEditing(null)
  }

  async function handleDelete(id) {
    await deleteScreen(id)
    setScreens((current) => current.filter((item) => item.id !== id))
    setConfirm(null)
  }

  return (
    <div className="screens-page">
      <div className="screens-header">
        <div className="search-control">
          <input placeholder="Search screens or theaters" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button className="btn primary" onClick={() => setShowForm(true)}>
          <Plus /> Add Screen
        </button>
      </div>

      <div className="table-wrap">
        <table className="screens-table">
          <thead>
            <tr>
              <th>Screen Name</th>
              <th>Theater</th>
              <th>Total Seats</th>
              <th>Rows</th>
              <th>Seats/Row</th>
              <th>Screen Type</th>
              <th>Sound</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>No screens found.</td>
              </tr>
            ) : (
              filtered.map((screen) => (
                <tr key={screen.id}>
                  <td>{screen.name}</td>
                  <td>{screen.theater}</td>
                  <td>{screen.totalSeats}</td>
                  <td>{screen.rows}</td>
                  <td>{screen.seatsPerRow}</td>
                  <td>{screen.screenType}</td>
                  <td>{screen.soundType}</td>
                  <td>{screen.status}</td>
                  <td className="actions">
                    <button className="btn" onClick={() => setEditing(screen)}>
                      <Edit />
                    </button>
                    <button className="btn" onClick={() => alert('Configure Seats not implemented yet')}>
                      <SlidersHorizontal />
                    </button>
                    <button className="btn danger" onClick={() => setConfirm(screen)}>
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && <ScreenForm onClose={() => setShowForm(false)} onSubmit={handleAdd} />}
      {editing && <ScreenForm screen={editing} onClose={() => setEditing(null)} onSubmit={(data) => handleUpdate(editing.id, data)} />}
      {confirm && <ConfirmDialog title={`Delete ${confirm.name}?`} onCancel={() => setConfirm(null)} onConfirm={() => handleDelete(confirm.id)} />}
    </div>
  )
}
