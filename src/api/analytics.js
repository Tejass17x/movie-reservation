export function getAnalyticsData() {
  return {
    summary: {
      totalRevenue: 1678400,
      totalBookings: 12850,
      ticketsSold: 51800,
      occupancyRate: 78,
      avgBookingValue: 130.7,
    },
    revenueTrend: [
      { month: 'Jan', revenue: 110000, bookings: 870 },
      { month: 'Feb', revenue: 98000, bookings: 790 },
      { month: 'Mar', revenue: 145000, bookings: 1040 },
      { month: 'Apr', revenue: 158000, bookings: 1110 },
      { month: 'May', revenue: 190000, bookings: 1320 },
      { month: 'Jun', revenue: 223000, bookings: 1460 },
      { month: 'Jul', revenue: 202000, bookings: 1380 },
      { month: 'Aug', revenue: 206000, bookings: 1415 },
      { month: 'Sep', revenue: 170000, bookings: 1185 },
      { month: 'Oct', revenue: 145000, bookings: 980 },
      { month: 'Nov', revenue: 167400, bookings: 1215 },
      { month: 'Dec', revenue: 189000, bookings: 1365 },
    ],
    revenueByMovie: [
      { name: 'Nebula Nights', revenue: 414000 },
      { name: 'Romance by the Lake', revenue: 287000 },
      { name: 'Action Outlaws', revenue: 223000 },
      { name: 'Mystic Manor', revenue: 175000 },
      { name: 'Comedy Night', revenue: 129000 },
    ],
    revenueByTheater: [
      { name: 'Grand Cinema Plaza', revenue: 612000 },
      { name: 'Riverside Screens', revenue: 458000 },
      { name: 'Downtown Hall', revenue: 301000 },
      { name: 'Moonlight Arena', revenue: 208000 },
    ],
    ticketDistribution: [
      { type: 'Standard', tickets: 36200 },
      { type: 'VIP', tickets: 8400 },
      { type: 'Premium', tickets: 7200 },
      { type: 'Student', tickets: 4000 },
    ],
    topMovies: [
      { title: 'Nebula Nights', revenue: 414000, tickets: 12000 },
      { title: 'Romance by the Lake', revenue: 287000, tickets: 8700 },
      { title: 'Action Outlaws', revenue: 223000, tickets: 6800 },
      { title: 'Mystic Manor', revenue: 175000, tickets: 5400 },
    ],
    theaterPerformance: [
      { theater: 'Grand Cinema Plaza', revenue: 612000, occupancy: 84 },
      { theater: 'Riverside Screens', revenue: 458000, occupancy: 77 },
      { theater: 'Downtown Hall', revenue: 301000, occupancy: 71 },
      { theater: 'Moonlight Arena', revenue: 208000, occupancy: 66 },
    ],
  }
}
