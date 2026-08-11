import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Ticket, 
  Film, 
  Percent, 
  TrendingUp 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import api from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/bookings/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Fetch dashboard stats error:', err);
        showToast('Failed to load dashboard metrics.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [showToast]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Unable to load dashboard data</h2>
        <p>Please check your backend connection or refresh the page.</p>
      </div>
    );
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val);
  };

  // Customized tooltip styling for the Recharts component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#121212',
          border: '1px solid #d4a94a',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
        }}>
          <p style={{ color: '#a0a0a0', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</p>
          <p style={{ color: '#d4a94a', fontWeight: 'bold' }}>{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Dashboard</h1>
          <p>Real-time analytics for your cinema operations</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Ticket size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Bookings</span>
            <span className="stat-value">{stats.totalBookings}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Film size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Movies</span>
            <span className="stat-value">{stats.totalMovies}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Percent size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Occupancy Rate</span>
            <span className="stat-value">{stats.occupancyRate}%</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* Revenue Trend Line Chart */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Revenue Trend (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 320, marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.revenueTrend}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a94a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d4a94a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  tickLine={false}
                  tick={{ fill: '#a0a0a0', fontSize: 11 }}
                />
                <YAxis 
                  stroke="#666" 
                  tickLine={false}
                  tick={{ fill: '#a0a0a0', fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#d4a94a" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Movies List */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Top Movies</h3>
          <div className="table-container" style={{ border: 'none', background: 'transparent' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem 0.5rem', background: 'transparent' }}>Movie Title</th>
                  <th style={{ padding: '0.75rem 0.5rem', background: 'transparent', textAlign: 'right' }}>Bookings</th>
                  <th style={{ padding: '0.75rem 0.5rem', background: 'transparent', textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.bookingsPerMovie.slice(0, 5).map((m) => (
                  <tr key={m.movieId}>
                    <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid #222' }}>
                      <strong>{m.title}</strong>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid #222', textAlign: 'right' }}>
                      {m.bookingsCount}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', borderBottom: '1px solid #222', textAlign: 'right', color: '#d4a94a', fontWeight: 500 }}>
                      {formatCurrency(m.revenue)}
                    </td>
                  </tr>
                ))}
                {stats.bookingsPerMovie.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '1.5rem', color: '#666' }}>
                      No booking data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
