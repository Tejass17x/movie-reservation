import { Calendar, Monitor, Film, Activity, DollarSign, MapPin, Clock, TrendingUp, Users } from 'lucide-react'

const stats = [
  { label: "Today's Bookings", value: '1,254', icon: Calendar, change: '+12.5%', positive: true },
  { label: 'Revenue', value: '$48,290', icon: DollarSign, change: '+8.3%', positive: true },
  { label: 'Active Screens', value: '16', icon: Monitor, change: '+2', positive: true },
  { label: 'Available Movies', value: '12', icon: Film, change: '+5 new', positive: true },
  { label: 'Active Theaters', value: '7', icon: MapPin, change: 'All operational', positive: true },
  { label: 'Upcoming Shows', value: '48', icon: Clock, change: '+12 this week', positive: true },
]

const activityItems = [
  { title: 'New booking confirmed for Nebula Nights', time: '2 minutes ago' },
  { title: 'Screen 2 maintenance scheduled for tomorrow', time: '1 hour ago' },
  { title: '"Baahubali: The Crown" added to lineup', time: '3 hours ago' },
  { title: 'Pathaan Returns show sold out at PVR IMAX', time: '5 hours ago' },
  { title: 'New theater "Cinepolis Royal" activated', time: '1 day ago' },
  { title: 'Booking #BKG-005 confirmed for 5 seats', time: '2 days ago' },
]

const upcomingShows = [
  { movie: 'Nebula Nights', theater: 'Grand Cinema Plaza', time: '6:00 PM', tickets: '45 remaining' },
  { movie: 'Baahubali: The Crown', theater: 'Grand Cinema Plaza', time: '2:30 PM', tickets: 'Sold Out' },
  { movie: 'The Matrix Reborn', theater: 'Downtown IMAX', time: '9:00 PM', tickets: '120 remaining' },
  { movie: 'Pushpa: The Rule', theater: 'INOX Leisure City', time: '6:30 PM', tickets: '78 remaining' },
]

export default function Dashboard() {
  return (
    <section className="dashboard">
      <h2 style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--font-size-xl)' }}>Dashboard Overview</h2>
      <div className="dashboard-grid">
        {stats.map((s) => (
          <div className="card dashboard-stat" key={s.label}>
            <div className="stat-header">
              <h3>{s.label}</h3>
              <div className="stat-icon">
                <s.icon size={20} />
              </div>
            </div>
            <p className="stat">{s.value}</p>
            <span className={`stat-change ${s.positive ? 'positive' : 'negative'}`}>
              {s.change} from last month
            </span>
          </div>
        ))}
        <div className="card wide dashboard-activity">
          <div className="stat-header">
            <h3>Recent Activity</h3>
            <div className="stat-icon">
              <Activity size={20} />
            </div>
          </div>
          <div className="activity-content">
            {activityItems.map((item, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-dot" />
                <div className="activity-text">
                  <span className="activity-title">{item.title}</span>
                  <span className="activity-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card wide dashboard-upcoming">
          <div className="stat-header">
            <h3>Upcoming Shows Today</h3>
            <div className="stat-icon">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="upcoming-grid">
            <div className="upcoming-header">
              <span>Movie</span>
              <span>Theater</span>
              <span>Time</span>
              <span>Availability</span>
            </div>
            {upcomingShows.map((show, i) => (
              <div className="upcoming-row" key={i}>
                <span className="upcoming-movie">{show.movie}</span>
                <span className="upcoming-theater">{show.theater}</span>
                <span className="upcoming-time">{show.time}</span>
                <span className={`upcoming-tickets ${show.tickets === 'Sold Out' ? 'sold-out' : ''}`}>
                  {show.tickets}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
