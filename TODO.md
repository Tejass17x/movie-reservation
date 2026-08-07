# Task: Seat Configuration & Movies Seed Restoration

## Steps

- [x] 1. Read all relevant source files (Seats, SeatMap, seats api/css, Movies, MovieForm, MovieList, MovieDetailsModal, movies api/css)
- [x] 2. Create plan & get approval
- [x] 3. Verify working TMDB poster image URLs for the movie seed

## Seat Configuration

- [x] 4. Edit `src/components/seats/SeatMap.jsx` — Fix React key warning, add tooltips, add Blocked/Maintenance "✕" overlay, add row-selected highlight
- [x] 5. Edit `src/pages/Seats.jsx` — Add "Select All" bulk-select, feedback messages for Set Selected / Clear Selection, robust Standard count
- [x] 6. Edit `src/styles/seats.css` — Distinct Blocked/Maintenance visuals (diagonal stripes + ✕), keep VIP gold gradient distinct

## Movies

- [x] 7. Edit `src/api/movies.js` — Bump storage key to `movies_mock_v2`, replace seed with 15 real movies (8 Hollywood + 7 Indian) with rating + working TMDB posters
- [x] 8. Edit `src/components/movies/MovieForm.jsx` — Add Rating field
- [x] 9. Edit `src/components/movies/MovieDetailsModal.jsx` — Display rating
- [x] 10. Edit `src/components/movies/MovieList.jsx` — Add rating badge on cards
- [x] 11. Edit `src/styles/movies.css` — Add rating-badge style

## Verification

- [x] 12. Run `npm run build` and fix any errors
- [x] 13. Verify all existing functionality remains intact

