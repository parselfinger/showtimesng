import { format, parseISO } from 'date-fns';

export function formatShowtime(dateTime: string): string {
  return format(parseISO(dateTime), 'h:mm a');
}

export function formatDate(dateTime: string): string {
  return format(parseISO(dateTime), 'EEE, MMM d');
}

export function formatFullDate(dateTime: string): string {
  return format(parseISO(dateTime), 'EEEE, MMMM d, yyyy');
}

export function groupShowtimesByDate(showtimes: any[]) {
  return showtimes.reduce((acc, showtime) => {
    const date = format(parseISO(showtime.start_time), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(showtime);
    return acc;
  }, {} as Record<string, any[]>);
}

export function groupShowtimesByCinema(showtimes: any[]) {
  return showtimes.reduce((acc, showtime) => {
    const cinemaId = showtime.cinema.id;
    if (!acc[cinemaId]) {
      acc[cinemaId] = {
        cinema: showtime.cinema,
        showtimes: [],
      };
    }
    acc[cinemaId].showtimes.push(showtime);
    return acc;
  }, {} as Record<string, any>);
}

export function groupShowtimesByMovie(showtimes: any[]) {
  return showtimes.reduce((acc, showtime) => {
    const movieId = showtime.movie.id;
    if (!acc[movieId]) {
      acc[movieId] = {
        movie: showtime.movie,
        showtimes: [],
      };
    }
    acc[movieId].showtimes.push(showtime);
    return acc;
  }, {} as Record<string, any>);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatDuration(minutes: number | null): string {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatRating(rating: number | null): string {
  if (!rating) return '';
  return rating.toFixed(1);
}

export function formatDayShort(dateTime: string): string {
  return format(parseISO(dateTime), 'EEE');
}

export function formatDayNum(dateTime: string): string {
  return format(parseISO(dateTime), 'd');
}

export function formatMonthShort(dateTime: string): string {
  return format(parseISO(dateTime), 'MMM');
}
