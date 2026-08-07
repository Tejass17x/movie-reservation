import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts'
import { getAnalyticsData } from '../api/analytics'
import '../styles/analytics.css'

const colors = ['#3b82f6', '#7c3aed', '#10b981', '#f59e0b', '#ef4444']

export default function Analytics() {
  const data = getAnalyticsData()

  return (
    <div className="analytics-page">
      <div className="summary-cards">
        <article className="stat-card">
          <span>Total Revenue</span>
          <strong>${data.summary.totalRevenue.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <span>Total Bookings</span>
          <strong>{data.summary.totalBookings.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <span>Tickets Sold</span>
          <strong>{data.summary.ticketsSold.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <span>Occupancy Rate</span>
          <strong>{data.summary.occupancyRate}%</strong>
        </article>
        <article className="stat-card">
          <span>Avg Booking Value</span>
          <strong>${data.summary.avgBookingValue.toFixed(2)}</strong>
        </article>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.revenueTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Booking Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.revenueTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Revenue by Movie</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.revenueByMovie} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Revenue by Theater</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.revenueByTheater} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <h3>Ticket Distribution</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={data.ticketDistribution} dataKey="tickets" nameKey="type" cx="50%" cy="50%" outerRadius={100} fill="#3b82f6" label>
                {data.ticketDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-grid">
        <div className="table-card">
          <h3>Top Performing Movies</h3>
          <table>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Revenue</th>
                <th>Tickets Sold</th>
              </tr>
            </thead>
            <tbody>
              {data.topMovies.map((movie) => (
                <tr key={movie.title}>
                  <td>{movie.title}</td>
                  <td>${movie.revenue.toLocaleString()}</td>
                  <td>{movie.tickets.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3>Theater Performance</h3>
          <table>
            <thead>
              <tr>
                <th>Theater</th>
                <th>Revenue</th>
                <th>Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {data.theaterPerformance.map((theater) => (
                <tr key={theater.theater}>
                  <td>{theater.theater}</td>
                  <td>${theater.revenue.toLocaleString()}</td>
                  <td>{theater.occupancy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
