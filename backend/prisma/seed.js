import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete in reverse order of dependencies
  await prisma.bookingSeat.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.showtime.deleteMany({});
  await prisma.screen.deleteMany({});
  await prisma.theater.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding users...');
  const salt = await bcryptjs.genSalt(10);
  const adminPasswordHash = await bcryptjs.hash('admin123', salt);
  const userPasswordHash = await bcryptjs.hash('user123', salt);

  // 2 Admins
  const admin1 = await prisma.user.create({
    data: {
      name: 'Sarah Connor',
      email: 'admin1@cinema.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'admin2@cinema.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });

  // 5 regular users for booking reporting
  const users = [];
  const sampleUsersData = [
    { name: 'Alice Smith', email: 'alice@gmail.com' },
    { name: 'Bob Jones', email: 'bob@yahoo.com' },
    { name: 'Charlie Brown', email: 'charlie@outlook.com' },
    { name: 'David Miller', email: 'david@gmail.com' },
    { name: 'Emma Wilson', email: 'emma@gmail.com' },
  ];

  for (const u of sampleUsersData) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        passwordHash: userPasswordHash,
        role: 'user',
      },
    });
    users.push(user);
  }

  console.log('Seeding movies...');
  const moviesData = [
    {
      title: 'Neon Frontier',
      genre: 'Sci-Fi',
      durationMinutes: 120,
      description: 'A dystopian cyberpunk adventure in a city ruled by AI and neon lights.',
      posterUrl: 'https://images.unsplash.com/photo-1542204172-e7052809f852?w=500',
      rating: 'PG-13',
    },
    {
      title: 'The Venetian Heist',
      genre: 'Thriller',
      durationMinutes: 115,
      description: 'A mastermind plans the ultimate art heist during the Venice Carnival.',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      rating: 'R',
    },
    {
      title: 'Ember & Ash',
      genre: 'Drama',
      durationMinutes: 140,
      description: 'An epic tale of love, rivalry, and survival in a post-war industrial town.',
      posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
      rating: 'PG-13',
    },
    {
      title: 'Apex Predator',
      genre: 'Action',
      durationMinutes: 110,
      description: 'A special forces veteran battles rogue mercenaries and nature in Alaska.',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500',
      rating: 'R',
    },
    {
      title: 'Laugh Out Loud',
      genre: 'Comedy',
      durationMinutes: 95,
      description: 'A suburban neighborhood descends into hilarious chaos over a simple fence dispute.',
      posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500',
      rating: 'PG',
    },
    {
      title: 'Whispers in the Dark',
      genre: 'Horror',
      durationMinutes: 100,
      description: 'An ancient entity terrorizes a family in a secluded mountain cabin.',
      posterUrl: 'https://images.unsplash.com/photo-1505635330303-319530796676?w=500',
      rating: 'R',
    },
    {
      title: 'Starlight Voyage',
      genre: 'Sci-Fi',
      durationMinutes: 135,
      description: 'Humanity\'s first interstellar mission encounters an anomaly near Jupiter.',
      posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
      rating: 'PG',
    },
    {
      title: 'Midnight Chronicles',
      genre: 'Thriller',
      durationMinutes: 105,
      description: 'A night-shift radio host receives calls from a mysterious listener detailing live crimes.',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500',
      rating: 'R',
    },
  ];

  const movies = [];
  for (const m of moviesData) {
    const movie = await prisma.movie.create({ data: m });
    movies.push(movie);
  }

  console.log('Seeding theaters and screens...');
  // Theater 1
  const t1 = await prisma.theater.create({
    data: {
      name: 'Grand Cinema',
      location: 'Downtown Mall, 4th Floor',
    },
  });

  const s1_1 = await prisma.screen.create({
    data: { theaterId: t1.id, name: 'IMAX Screen 1', rows: 10, columns: 12 },
  });
  const s1_2 = await prisma.screen.create({
    data: { theaterId: t1.id, name: 'Screen 2', rows: 8, columns: 10 },
  });
  const s1_3 = await prisma.screen.create({
    data: { theaterId: t1.id, name: 'Screen 3 (VIP)', rows: 5, columns: 6 },
  });

  // Theater 2
  const t2 = await prisma.theater.create({
    data: {
      name: 'Starlight Theater',
      location: 'Uptown Arts District',
    },
  });

  const s2_1 = await prisma.screen.create({
    data: { theaterId: t2.id, name: 'Main Hall', rows: 12, columns: 15 },
  });
  const s2_2 = await prisma.screen.create({
    data: { theaterId: t2.id, name: 'Screen 2 (3D)', rows: 8, columns: 10 },
  });
  const s2_3 = await prisma.screen.create({
    data: { theaterId: t2.id, name: 'Screen 3', rows: 6, columns: 8 },
  });

  const screens = [s1_1, s1_2, s1_3, s2_1, s2_2, s2_3];

  console.log('Seeding showtimes...');
  const showtimes = [];
  const prices = [12.00, 14.50, 16.00, 18.50, 20.00];

  // Helper to generate dates relative to today
  const getRelativeDate = (daysOffset, hour, minute = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  // Generate 18 showtimes spread over 7 days
  const showtimesSchedule = [
    // Today
    { movieIdx: 0, screenIdx: 0, offset: 0, hour: 13, price: 16.00 },
    { movieIdx: 0, screenIdx: 0, offset: 0, hour: 18, price: 18.50 },
    { movieIdx: 1, screenIdx: 1, offset: 0, hour: 15, price: 14.50 },
    { movieIdx: 2, screenIdx: 3, offset: 0, hour: 20, price: 20.00 },
    
    // Tomorrow (Day 1)
    { movieIdx: 3, screenIdx: 4, offset: 1, hour: 14, price: 12.00 },
    { movieIdx: 4, screenIdx: 2, offset: 1, hour: 16, price: 18.50 }, // VIP
    { movieIdx: 5, screenIdx: 5, offset: 1, hour: 21, price: 14.50 },
    
    // Day 2
    { movieIdx: 6, screenIdx: 0, offset: 2, hour: 12, price: 14.50 },
    { movieIdx: 7, screenIdx: 1, offset: 2, hour: 19, price: 16.00 },
    { movieIdx: 0, screenIdx: 3, offset: 2, hour: 17, price: 18.50 },
    
    // Day 3
    { movieIdx: 1, screenIdx: 4, offset: 3, hour: 15, price: 12.00 },
    { movieIdx: 2, screenIdx: 5, offset: 3, hour: 18, price: 14.50 },
    { movieIdx: 3, screenIdx: 2, offset: 3, hour: 20, price: 20.00 }, // VIP
    
    // Day 4
    { movieIdx: 4, screenIdx: 1, offset: 4, hour: 14, price: 12.00 },
    { movieIdx: 5, screenIdx: 3, offset: 4, hour: 22, price: 18.50 },
    
    // Day 5
    { movieIdx: 6, screenIdx: 0, offset: 5, hour: 16, price: 16.00 },
    
    // Day 6
    { movieIdx: 7, screenIdx: 4, offset: 6, hour: 20, price: 14.50 },
    { movieIdx: 0, screenIdx: 1, offset: 6, hour: 17, price: 14.50 },
  ];

  for (const s of showtimesSchedule) {
    const showtime = await prisma.showtime.create({
      data: {
        movieId: movies[s.movieIdx].id,
        screenId: screens[s.screenIdx].id,
        startTime: getRelativeDate(s.offset, s.hour),
        price: s.price,
      },
    });
    showtimes.push(showtime);
  }

  console.log('Seeding bookings and seats...');
  // Seed 20 bookings with random users/seats/showtimes
  const statuses = ['confirmed', 'confirmed', 'confirmed', 'confirmed', 'cancelled']; // 80% confirmed

  for (let i = 1; i <= 24; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const showtime = showtimes[Math.floor(Math.random() * showtimes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Number of seats for this booking (1 to 4)
    const numSeats = Math.floor(Math.random() * 3) + 1;
    const pricePerSeat = parseFloat(showtime.price);
    const totalCost = pricePerSeat * numSeats;

    // Pick random seats
    const screen = screens.find(s => s.id === showtime.screenId);
    const seatLabels = [];
    for (let s = 0; s < numSeats; s++) {
      const rowLetter = String.fromCharCode(65 + Math.floor(Math.random() * screen.rows)); // A, B, C...
      const colNum = Math.floor(Math.random() * screen.columns) + 1;
      seatLabels.push(`${rowLetter}${colNum}`);
    }

    // Set custom booking creation date over the last 7 days
    const createdDaysAgo = Math.floor(Math.random() * 8); // 0 to 7 days ago
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() - createdDaysAgo);
    bookingDate.setHours(10 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        showtimeId: showtime.id,
        totalCost: totalCost,
        status: status,
        createdAt: bookingDate,
      },
    });

    for (const label of seatLabels) {
      await prisma.bookingSeat.create({
        data: {
          bookingId: booking.id,
          seatLabel: label,
        },
      });
    }
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
