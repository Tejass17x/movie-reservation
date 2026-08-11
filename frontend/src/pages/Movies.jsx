import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import Modal from '../components/Modal.jsx';

const GENRES = ['All', 'Sci-Fi', 'Thriller', 'Drama', 'Action', 'Comedy', 'Horror'];
const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeMovie, setActiveMovie] = useState(null); // Used for editing/deleting

  // Form Fields State
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [rating, setRating] = useState('PG-13');
  const [formErrors, setFormErrors] = useState({});

  const { showToast } = useToast();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedGenre && selectedGenre !== 'All') params.genre = selectedGenre;

      const response = await api.get('/admin/movies', { params });
      setMovies(response.data);
    } catch (err) {
      console.error('Fetch movies error:', err);
      showToast('Failed to retrieve movies list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedGenre]);

  const resetForm = () => {
    setTitle('');
    setGenre('Sci-Fi');
    setDurationMinutes('');
    setDescription('');
    setPosterUrl('');
    setRating('PG-13');
    setFormErrors({});
    setActiveMovie(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditModal = (movie) => {
    setActiveMovie(movie);
    setTitle(movie.title);
    setGenre(movie.genre);
    setDurationMinutes(movie.durationMinutes);
    setDescription(movie.description || '');
    setPosterUrl(movie.posterUrl || '');
    setRating(movie.rating || 'PG-13');
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openDeleteModal = (movie) => {
    setActiveMovie(movie);
    setIsDeleteOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!genre.trim()) errors.genre = 'Genre is required';
    
    const duration = parseInt(durationMinutes);
    if (!durationMinutes) {
      errors.durationMinutes = 'Duration is required';
    } else if (isNaN(duration) || duration <= 0) {
      errors.durationMinutes = 'Duration must be a positive integer';
    }

    if (posterUrl.trim() && !/^https?:\/\/.+/.test(posterUrl)) {
      errors.posterUrl = 'Poster must be a valid URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: title.trim(),
      genre: genre.trim(),
      durationMinutes: parseInt(durationMinutes),
      description: description.trim() || null,
      posterUrl: posterUrl.trim() || null,
      rating: rating,
    };

    try {
      if (activeMovie) {
        // Update Action
        const response = await api.put(`/admin/movies/${activeMovie.id}`, payload);
        showToast(`Successfully updated film "${response.data.title}"`, 'success');
      } else {
        // Create Action
        const response = await api.post('/admin/movies', payload);
        showToast(`Successfully registered film "${response.data.title}"`, 'success');
      }
      setIsFormOpen(false);
      resetForm();
      fetchMovies();
    } catch (err) {
      console.error('Submit movie error:', err);
      const errMsg = err.response?.data?.error || 'Failed to submit movie details.';
      showToast(errMsg, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeMovie) return;

    try {
      await api.delete(`/admin/movies/${activeMovie.id}`);
      showToast(`Film "${activeMovie.title}" has been deleted.`, 'success');
      setIsDeleteOpen(false);
      setActiveMovie(null);
      fetchMovies();
    } catch (err) {
      console.error('Delete movie error:', err);
      showToast('Failed to delete movie.', 'error');
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Movies Catalogue</h1>
          <p>Add, modify, or archive movies in the system</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add Movie</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search movies by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chip-filters">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`chip ${selectedGenre === g ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Table */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Poster</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Duration</th>
                <th>Rating</th>
                <th>Description</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m.id}>
                  <td>
                    <img 
                      src={m.posterUrl || 'https://images.unsplash.com/photo-1542204172-e7052809f852?w=100'} 
                      alt={m.title} 
                      className="table-poster"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100';
                      }}
                    />
                  </td>
                  <td>
                    <strong>{m.title}</strong>
                  </td>
                  <td>{m.genre}</td>
                  <td>{m.durationMinutes} mins</td>
                  <td>
                    <span className="badge badge-role-admin" style={{ textTransform: 'none' }}>
                      {m.rating || 'NR'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.description || <span className="text-muted">No description available</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        title="Edit Details"
                        onClick={() => openEditModal(m)}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        title="Delete Movie"
                        onClick={() => openDeleteModal(m)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {movies.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    No movies found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={activeMovie ? 'Edit Movie Details' : 'Add New Movie'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Movie Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Frontier"
            />
            {formErrors.title && <div className="form-error">{formErrors.title}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select 
                className="form-input" 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                {GENRES.filter(g => g !== 'All').map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {formErrors.genre && <div className="form-error">{formErrors.genre}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Rating</label>
              <select 
                className="form-input" 
                value={rating} 
                onChange={(e) => setRating(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                {RATINGS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="form-input"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="e.g. 120"
              />
              {formErrors.durationMinutes && <div className="form-error">{formErrors.durationMinutes}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Poster Image URL</label>
              <input
                type="text"
                className="form-input"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
              {formErrors.posterUrl && <div className="form-error">{formErrors.posterUrl}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Synopsis / Description</label>
            <textarea
              className="form-input"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief summary of the film..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {activeMovie ? 'Save Changes' : 'Add Movie'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Movie Deletion"
        size="sm"
      >
        <div style={{ marginBottom: '1.5rem' }}>
          Are you sure you want to permanently delete the movie <strong>{activeMovie?.title}</strong>? 
          <p style={{ marginTop: '0.5rem', color: '#ef4444', fontSize: '0.85rem' }}>
            Warning: This action will cascade delete all associated showtimes and booking records!
          </p>
        </div>
        <div className="modal-footer" style={{ border: 'none', paddingTop: 0 }}>
          <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
            Delete Movie
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Movies;
