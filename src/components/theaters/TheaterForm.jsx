import { useState } from 'react'

const empty = { name:'', address:'', city:'', state:'', contact:'', open:'09:00', close:'22:00', screens:3, status:'Active' }

export default function TheaterForm({ theater, onClose, onSubmit }){
  const [form, setForm] = useState(theater?{...theater}:empty)

  function change(e){
    const { name, value } = e.target
    setForm(s=>({ ...s, [name]: value }))
  }

  function submit(e){
    e.preventDefault()
    if(!form.name) return alert('Name required')
    onSubmit(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="theater-form" onSubmit={submit} onClick={(e)=>e.stopPropagation()}>
        <h3>{theater? 'Edit Theater':'Add Theater'}</h3>
        <label>Name<input name="name" value={form.name} onChange={change} /></label>
        <label>Address<input name="address" value={form.address} onChange={change} /></label>
        <div className="row">
          <label>City<input name="city" value={form.city} onChange={change} /></label>
          <label>State<input name="state" value={form.state} onChange={change} /></label>
        </div>
        <label>Contact Number<input name="contact" value={form.contact} onChange={change} /></label>
        <div className="row">
          <label>Opening Time<input type="time" name="open" value={form.open} onChange={change} /></label>
          <label>Closing Time<input type="time" name="close" value={form.close} onChange={change} /></label>
        </div>
        <div className="row">
          <label>Number of Screens<input type="number" name="screens" min="1" max="50" step="1" value={form.screens} onChange={change} /></label>
          <label>Status<select name="status" value={form.status} onChange={change}><option>Active</option><option>Inactive</option></select></label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save</button>
        </div>
      </form>
    </div>
  )
}
