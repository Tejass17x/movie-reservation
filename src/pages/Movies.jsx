import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { getMovies, addMovie, updateMovie, deleteMovie } from '../api/movies'
import MovieList from '../components/movies/MovieList'
import MovieForm from '../components/movies/MovieForm'
import MovieDetailsModal from '../components/movies/MovieDetailsModal'
import ConfirmDialog from '../components/movies/ConfirmDialog'
import '../styles/movies.css'

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [language, setLanguage] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('newest')

  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    setLoading(true)
    getMovies().then((res) => {
      setMovies(res)
      setLoading(false)
    })
  }, [])

  const genres = useMemo(() => [...new Set(movies.map((m) => m.genre).filter(Boolean))], [movies])
  const languages = useMemo(() => [...new Set(movies.map((m) => m.language).filter(Boolean))], [movies])

  function applyFilters(list) {
    let out = list.slice()
    if (query) out = out.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()))
    if (genre) out = out.filter((m) => m.genre === genre)
    if (language) out = out.filter((m) => m.language === language)
    if (status) out = out.filter((m) => m.status === status)
    if (sort === 'newest') out.sort((a,b)=> new Date(b.releaseDate) - new Date(a.releaseDate))
    if (sort === 'oldest') out.sort((a,b)=> new Date(a.releaseDate) - new Date(b.releaseDate))
    return out
  }

  async function handleAdd(data) {
    const movie = await addMovie(data)
    setMovies((s)=>[movie,...s])
    setShowAdd(false)
  }

  async function handleUpdate(id, data) {
    const updated = await updateMovie(id, data)
    setMovies((s)=>s.map(m=>m.id===id?updated:m))
    setEditing(null)
  }

  async function handleDelete(id) {
    await deleteMovie(id)
    setMovies((s)=>s.filter(m=>m.id!==id))
    setConfirm(null)
  }

  return (
    <div className="movies-page">
      <div className="movies-header">
        <div className="filters">
          <input placeholder="Search by title" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <select value={genre} onChange={(e)=>setGenre(e.target.value)}>
            <option value="">All Genres</option>
            {genres.map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={language} onChange={(e)=>setLanguage(e.target.value)}>
            <option value="">All Languages</option>
            {languages.map(l=> <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option>Now Showing</option>
            <option>Upcoming</option>
            <option>Archived</option>
          </select>
          <select value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={()=>setShowAdd(true)}><Plus /> Add Movie</button>
        </div>
      </div>

      <MovieList
        loading={loading}
        movies={applyFilters(movies)}
        onView={(m)=>setViewing(m)}
        onEdit={(m)=>setEditing(m)}
        onDelete={(m)=>setConfirm(m)}
      />

      {showAdd && <MovieForm onClose={()=>setShowAdd(false)} onSubmit={handleAdd} />}
      {editing && <MovieForm movie={editing} onClose={()=>setEditing(null)} onSubmit={(data)=>handleUpdate(editing.id,data)} />}
      {viewing && <MovieDetailsModal movie={viewing} onClose={()=>setViewing(null)} onEdit={(m)=>{setViewing(null); setEditing(m)}} />}
      {confirm && <ConfirmDialog title={`Delete ${confirm.title}?`} onCancel={()=>setConfirm(null)} onConfirm={()=>handleDelete(confirm.id)} />}
    </div>
  )
}
