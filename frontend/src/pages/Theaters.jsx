import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, MapPin, Grid } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import Modal from '../components/Modal.jsx';

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTheaters, setExpandedTheaters] = useState({});

  // Modals Toggles
  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [isDeleteTheaterOpen, setIsDeleteTheaterOpen] = useState(false);
  const [isDeleteScreenOpen, setIsDeleteScreenOpen] = useState(false);

  // Active items
  const [activeTheater, setActiveTheater] = useState(null);
  const [activeScreen, setActiveScreen] = useState(null);

  // Form State: Theater
  const [theaterName, setTheaterName] = useState('');
  const [theaterLocation, setTheaterLocation] = useState('');
  const [theaterErrors, setTheaterErrors] = useState({});

  // Form State: Screen
  const [screenName, setScreenName] = useState('');
  const [screenRows, setScreenRows] = useState(6);
  const [screenCols, setScreenCols] = useState(8);
  const [screenErrors, setScreenErrors] = useState({});

  const { showToast } = useToast();

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/theaters');
      setTheaters(response.data);
    } catch (err) {
      console.error('Fetch theaters error:', err);
      showToast('Failed to retrieve theaters list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const toggleExpand = (id) => {
    setExpandedTheaters(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Theater Actions
  const openAddTheater = () => {
    setActiveTheater(null);
    setTheaterName('');
    setTheaterLocation('');
    setTheaterErrors({});
    setIsTheaterModalOpen(true);
  };

  const openEditTheater = (e, theater) => {
    e.stopPropagation(); // Avoid expanding/collapsing on edit click
    setActiveTheater(theater);
    setTheaterName(theater.name);
    setTheaterLocation(theater.location);
    setTheaterErrors({});
    setIsTheaterModalOpen(true);
  };

  const openDeleteTheater = (e, theater) => {
    e.stopPropagation();
    setActiveTheater(theater);
    setIsDeleteTheaterOpen(true);
  };

  const validateTheaterForm = () => {
    const errors = {};
    if (!theaterName.trim()) errors.name = 'Theater name is required';
    if (!theaterLocation.trim()) errors.location = 'Location is required';
    setTheaterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTheaterSubmit = async (e) => {
    e.preventDefault();
    if (!validateTheaterForm()) return;

    const payload = {
      name: theaterName.trim(),
      location: theaterLocation.trim()
    };

    try {
      if (activeTheater) {
        await api.put(`/admin/theaters/${activeTheater.id}`, payload);
        showToast(`Theater "${payload.name}" updated successfully.`, 'success');
      } else {
        await api.post('/admin/theaters', payload);
        showToast(`Theater "${payload.name}" registered successfully.`, 'success');
      }
      setIsTheaterModalOpen(false);
      fetchTheaters();
    } catch (err) {
      console.error('Submit theater error:', err);
      showToast('Failed to save theater.', 'error');
    }
  };

  const handleDeleteTheaterConfirm = async () => {
    if (!activeTheater) return;
    try {
      await api.delete(`/admin/theaters/${activeTheater.id}`);
      showToast(`Theater "${activeTheater.name}" has been deleted.`, 'success');
      setIsDeleteTheaterOpen(false);
      setActiveTheater(null);
      fetchTheaters();
    } catch (err) {
      console.error('Delete theater error:', err);
      showToast('Failed to delete theater.', 'error');
    }
  };

  // Screen Actions
  const openAddScreen = (theater) => {
    setActiveTheater(theater);
    setScreenName('');
    setScreenRows(6);
    setScreenCols(8);
    setScreenErrors({});
    setIsScreenModalOpen(true);
  };

  const openDeleteScreen = (screen) => {
    setActiveScreen(screen);
    setIsDeleteScreenOpen(true);
  };

  const validateScreenForm = () => {
    const errors = {};
    if (!screenName.trim()) errors.name = 'Screen name is required';
    
    const rows = parseInt(screenRows);
    if (!screenRows) {
      errors.rows = 'Rows count is required';
    } else if (isNaN(rows) || rows < 1 || rows > 30) {
      errors.rows = 'Rows must be between 1 and 30';
    }

    const cols = parseInt(screenCols);
    if (!screenCols) {
      errors.cols = 'Columns count is required';
    } else if (isNaN(cols) || cols < 1 || cols > 30) {
      errors.cols = 'Columns must be between 1 and 30';
    }

    setScreenErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleScreenSubmit = async (e) => {
    e.preventDefault();
    if (!validateScreenForm()) return;

    const payload = {
      name: screenName.trim(),
      rows: parseInt(screenRows),
      columns: parseInt(screenCols)
    };

    try {
      await api.post(`/admin/theaters/${activeTheater.id}/screens`, payload);
      showToast(`Screen "${payload.name}" added to theater "${activeTheater.name}".`, 'success');
      setIsScreenModalOpen(false);
      // Ensure the theater stays expanded to see the new screen
      setExpandedTheaters(prev => ({ ...prev, [activeTheater.id]: true }));
      fetchTheaters();
    } catch (err) {
      console.error('Submit screen error:', err);
      showToast('Failed to register screen.', 'error');
    }
  };

  const handleDeleteScreenConfirm = async () => {
    if (!activeScreen) return;
    try {
      await api.delete(`/admin/screens/${activeScreen.id}`);
      showToast(`Screen has been removed.`, 'success');
      setIsDeleteScreenOpen(false);
      setActiveScreen(null);
      fetchTheaters();
    } catch (err) {
      console.error('Delete screen error:', err);
      showToast('Failed to delete screen.', 'error');
    }
  };

  // Preview Grid Helper
  const renderSeatPreview = () => {
    const rows = Math.min(parseInt(screenRows) || 0, 8); // clamp for visual display preview
    const cols = Math.min(parseInt(screenCols) || 0, 12);
    
    if (rows <= 0 || cols <= 0) return null;

    const rowGrid = [];
    for (let r = 0; r < rows; r++) {
      rowGrid.push(r);
    }
    const colGrid = [];
    for (let c = 0; c < cols; c++) {
      colGrid.push(c);
    }

    return (
      <div className="seat-layout-grid">
        <div className="screen-front-indicator">Screen Stage Front</div>
        {rowGrid.map((rIdx) => (
          <div key={rIdx} className="seat-row">
            <span style={{ fontSize: '0.65rem', width: '15px', color: '#666', display: 'flex', alignItems: 'center' }}>
              {String.fromCharCode(65 + rIdx)}
            </span>
            {colGrid.map((cIdx) => (
              <div key={cIdx} className="seat-cell" title={`${String.fromCharCode(65 + rIdx)}${cIdx + 1}`}></div>
            ))}
          </div>
        ))}
        {(screenRows > 8 || screenCols > 12) && (
          <div style={{ fontSize: '0.7rem', color: '#d4a94a', marginTop: '0.5rem' }}>
            * Showing 8x12 preview of {screenRows}x{screenCols} seats
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Theaters & Screens</h1>
          <p>Manage cinema physical venues and configure screen layouts</p>
        </div>
        <button className="btn btn-primary" onClick={openAddTheater}>
          <Plus size={18} />
          <span>Add Theater</span>
        </button>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table" style={{ borderCollapse: 'separate' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Theater Name</th>
                <th>Location Details</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Screens</th>
                <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((t) => {
                const isExpanded = !!expandedTheaters[t.id];
                return (
                  <React.Fragment key={t.id}>
                    {/* Main Theater Row */}
                    <tr onClick={() => toggleExpand(t.id)} className="theater-row" style={{ cursor: 'pointer' }}>
                      <td style={{ textAlign: 'center' }}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                      <td>
                        <strong style={{ fontSize: '1.05rem' }}>{t.name}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a0a0a0' }}>
                          <MapPin size={14} className="text-gold" />
                          <span>{t.location}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-role-admin" style={{ textTransform: 'none' }}>
                          {t.screens.length} Screens
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={(e) => openEditTheater(e, t)}
                            title="Edit Venue"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-sm" 
                            onClick={(e) => openDeleteTheater(e, t)}
                            title="Delete Venue"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Screens Section */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="5" style={{ padding: 0, border: 'none' }}>
                          <div className="theater-screens-detail">
                            <div className="d-flex justify-between align-center mb-1">
                              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 600 }}>
                                Screens configured for {t.name}
                              </h4>
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => openAddScreen(t)}
                              >
                                <Plus size={14} />
                                <span>Add Screen</span>
                              </button>
                            </div>

                            {t.screens.length === 0 ? (
                              <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#666', padding: '1rem 0' }}>
                                No screens configured for this theater yet. Click "Add Screen" to get started.
                              </p>
                            ) : (
                              <div className="screen-cards-grid">
                                {t.screens.map((s) => (
                                  <div key={s.id} className="screen-card">
                                    <div>
                                      <div className="screen-card-header">{s.name}</div>
                                      <div className="screen-card-dims">
                                        Layout: {s.rows} Rows × {s.columns} Columns
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.8rem', color: '#d4a94a' }}>
                                        <Grid size={12} />
                                        <span>{s.rows * s.columns} total seats</span>
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                      <button 
                                        className="btn btn-danger btn-sm"
                                        style={{ padding: '0.25rem 0.5rem' }}
                                        onClick={() => openDeleteScreen(s)}
                                        title="Delete Screen"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {theaters.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    No theaters configured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Theater Form Modal */}
      <Modal
        isOpen={isTheaterModalOpen}
        onClose={() => setIsTheaterModalOpen(false)}
        title={activeTheater ? 'Edit Theater Venue' : 'Create New Theater'}
      >
        <form onSubmit={handleTheaterSubmit}>
          <div className="form-group">
            <label className="form-label">Theater Name</label>
            <input
              type="text"
              className="form-input"
              value={theaterName}
              onChange={(e) => setTheaterName(e.target.value)}
              placeholder="e.g. Aurelia Grand Cinema"
            />
            {theaterErrors.name && <div className="form-error">{theaterErrors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Location / Address</label>
            <input
              type="text"
              className="form-input"
              value={theaterLocation}
              onChange={(e) => setTheaterLocation(e.target.value)}
              placeholder="e.g. Level 4, Marina Bay Mall"
            />
            {theaterErrors.location && <div className="form-error">{theaterErrors.location}</div>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsTheaterModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {activeTheater ? 'Save Changes' : 'Create Theater'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Screen Form Modal */}
      <Modal
        isOpen={isScreenModalOpen}
        onClose={() => setIsScreenModalOpen(false)}
        title={`Add Screen to ${activeTheater?.name}`}
      >
        <form onSubmit={handleScreenSubmit}>
          <div className="form-group">
            <label className="form-label">Screen Name</label>
            <input
              type="text"
              className="form-input"
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              placeholder="e.g. Screen 1 (Dolby Atmos)"
            />
            {screenErrors.name && <div className="form-error">{screenErrors.name}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Number of Rows</label>
              <input
                type="number"
                className="form-input"
                value={screenRows}
                onChange={(e) => setScreenRows(Math.max(1, parseInt(e.target.value) || ''))}
                placeholder="e.g. 8"
                min="1"
                max="30"
              />
              {screenErrors.rows && <div className="form-error">{screenErrors.rows}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Seats per Row (Columns)</label>
              <input
                type="number"
                className="form-input"
                value={screenCols}
                onChange={(e) => setScreenCols(Math.max(1, parseInt(e.target.value) || ''))}
                placeholder="e.g. 10"
                min="1"
                max="30"
              />
              {screenErrors.cols && <div className="form-error">{screenErrors.cols}</div>}
            </div>
          </div>

          {/* Seat Layout Live Visualizer */}
          <div style={{ margin: '1.5rem 0' }}>
            <label className="form-label">Seat Layout Live Preview</label>
            {renderSeatPreview()}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsScreenModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Screen
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Theater Modal */}
      <Modal
        isOpen={isDeleteTheaterOpen}
        onClose={() => setIsDeleteTheaterOpen(false)}
        title="Confirm Theater Deletion"
        size="sm"
      >
        <div style={{ marginBottom: '1.5rem' }}>
          Are you sure you want to permanently delete theater <strong>{activeTheater?.name}</strong>? 
          <p style={{ marginTop: '0.5rem', color: '#ef4444', fontSize: '0.85rem' }}>
            Warning: This action will delete all screens, showtimes, and booking records associated with this venue!
          </p>
        </div>
        <div className="modal-footer" style={{ border: 'none', paddingTop: 0 }}>
          <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteTheaterOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDeleteTheaterConfirm}>
            Delete Theater
          </button>
        </div>
      </Modal>

      {/* Delete Screen Modal */}
      <Modal
        isOpen={isDeleteScreenOpen}
        onClose={() => setIsDeleteScreenOpen(false)}
        title="Remove Screen"
        size="sm"
      >
        <div style={{ marginBottom: '1.5rem' }}>
          Are you sure you want to remove <strong>{activeScreen?.name}</strong>? 
          <p style={{ marginTop: '0.5rem', color: '#ef4444', fontSize: '0.85rem' }}>
            Warning: This action will cascade delete all showtimes and booking records associated with this screen!
          </p>
        </div>
        <div className="modal-footer" style={{ border: 'none', paddingTop: 0 }}>
          <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteScreenOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDeleteScreenConfirm}>
            Delete Screen
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Theaters;
