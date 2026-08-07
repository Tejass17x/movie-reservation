import { useEffect, useMemo, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getTheaters, addTheater, updateTheater, deleteTheater } from '../api/theaters'
import ConfirmDialog from '../components/movies/ConfirmDialog'
import TheaterForm from '../components/theaters/TheaterForm'
import '../styles/theaters.css'

export default function Theaters() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(()=>{
    setLoading(true)
    getTheaters().then(res=>{setList(res);setLoading(false)})
  },[])

  const filtered = useMemo(()=>{
    return list.filter(t=>t.name.toLowerCase().includes(query.toLowerCase()))
  },[list,query])

  async function handleAdd(data){
    const rec = await addTheater(data)
    setList(s=>[rec,...s])
    setShowForm(false)
  }

  async function handleUpdate(id,data){
    const updated = await updateTheater(id,data)
    setList(s=>s.map(x=>x.id===id?updated:x))
    setEditing(null)
  }

  async function handleDelete(id){
    await deleteTheater(id)
    setList(s=>s.filter(x=>x.id!==id))
    setConfirm(null)
  }

  return (
    <div className="theaters-page">
      <div className="theaters-header">
        <div className="left">
          <input placeholder="Search theaters" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <div className="right">
          <button className="btn primary" onClick={()=>setShowForm(true)}><Plus /> Add Theater</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="theaters-table">
          <thead>
            <tr><th>Name</th><th>Address</th><th>City</th><th>State</th><th>Contact</th><th>Hours</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={8}>Loading...</td></tr> : filtered.map(t=> (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.address}</td>
                <td>{t.city}</td>
                <td>{t.state}</td>
                <td>{t.contact}</td>
                <td>{t.open} - {t.close}</td>
                <td>{t.status}</td>
                <td className="actions">
                  <button className="btn" onClick={()=>setEditing(t)}><Edit /></button>
                  <button className="btn danger" onClick={()=>setConfirm(t)}><Trash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <TheaterForm onClose={()=>setShowForm(false)} onSubmit={handleAdd} />}
      {editing && <TheaterForm theater={editing} onClose={()=>setEditing(null)} onSubmit={(data)=>handleUpdate(editing.id,data)} />}
      {confirm && <ConfirmDialog title={`Delete ${confirm.name}?`} onCancel={()=>setConfirm(null)} onConfirm={()=>handleDelete(confirm.id)} />}
    </div>
  )
}
