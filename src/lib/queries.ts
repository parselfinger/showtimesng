import { supabase } from './supabase';

// Types - matching the actual database schema
export interface Movie {
  id: number;
  title: string;
  description: string | null;
  release_year: number | null;
  duration_minutes: number | null;
  rating: number | null;
  poster_url: string | null;
  metacritic_rating: number | null;
  rotten_tomatoes_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Cinema {
  id: number;
  name: string;
  location: string | null;
  verbose_location: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to get display location (verbose_location if available, otherwise location)
export function getDisplayLocation(cinema: Cinema): string | null {
  return cinema.verbose_location || cinema.location;
}

export interface Showtime {
  id: number;
  movie_id: number;
  cinema_id: number;
  start_time: string; // DateTime stored as ISO string
  screen_type: string;
  movie_url: string | null; // Link to cinema's booking page
  created_at: string;
  updated_at: string;
}

// Helper to generate slug from title/name
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Get all movies currently showing (have future showtimes)
export async function getNowShowingMovies() {
  const now = new Date().toISOString();

  // Get all movies that have at least one future showtime using inner join
  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      showtimes!inner(id, start_time)
    `)
    .gte('showtimes.start_time', now);

  if (error) throw error;

  // Get earliest showtime per movie, sort by earliest showtime then alphabetically
  const moviesWithEarliest = (data || []).map(({ showtimes, ...movie }) => {
    const earliestShowtime = (showtimes as { start_time: string }[]).reduce(
      (earliest, st) => (!earliest || st.start_time < earliest ? st.start_time : earliest),
      null as string | null
    );
    return { ...movie, earliestShowtime };
  });

  moviesWithEarliest.sort((a, b) => {
    const timeA = a.earliestShowtime ?? '';
    const timeB = b.earliestShowtime ?? '';
    if (timeA !== timeB) return timeA.localeCompare(timeB);
    return (a.title ?? '').localeCompare(b.title ?? '');
  });

  return moviesWithEarliest.map(({ earliestShowtime, ...movie }) => movie) as Movie[];
}

// Get single movie by ID
export async function getMovieById(id: number) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Movie;
}

// Get all movies
export async function getAllMovies() {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('title');

  if (error) throw error;
  return data as Movie[];
}

// Get showtimes for a movie
export async function getShowtimesForMovie(movieId: number) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('showtimes')
    .select(`
      *,
      cinema:cinemas(*)
    `)
    .eq('movie_id', movieId)
    .gte('start_time', now)
    .order('start_time');

  if (error) throw error;
  return data;
}

// Get all cinemas
export async function getCinemas() {
  const { data, error } = await supabase
    .from('cinemas')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Cinema[];
}

// Get single cinema by ID
export async function getCinemaById(id: number) {
  const { data, error } = await supabase
    .from('cinemas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Cinema;
}

// Get showtimes for a cinema
export async function getShowtimesForCinema(cinemaId: number) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('showtimes')
    .select(`
      *,
      movie:movies(*)
    `)
    .eq('cinema_id', cinemaId)
    .gte('start_time', now)
    .order('start_time');

  if (error) throw error;
  return data;
}

// Get all movie IDs (for static path generation)
export async function getAllMovieIds() {
  const { data, error } = await supabase
    .from('movies')
    .select('id, title');

  if (error) throw error;
  return data as { id: number; title: string }[];
}

// Get all cinema IDs (for static path generation)
export async function getAllCinemaIds() {
  const { data, error } = await supabase
    .from('cinemas')
    .select('id, name');

  if (error) throw error;
  return data as { id: number; name: string }[];
}
