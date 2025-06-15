
import { useState, useEffect } from 'react';
import { Movie, MovieFormData } from '@/types/movie';

// Sample data for demonstration
const sampleMovies: Movie[] = [
  {
    id: '1',
    name: 'The Matrix',
    year: 1999,
    director: 'The Wachowskis',
    mainActors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    genre: 'Science Fiction',
    format: 'Blu-ray',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop'
  },
  {
    id: '2',
    name: 'Inception',
    year: 2010,
    director: 'Christopher Nolan',
    mainActors: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
    genre: 'Science Fiction',
    format: 'Digital',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop'
  },
  {
    id: '3',
    name: 'The Godfather',
    year: 1972,
    director: 'Francis Ford Coppola',
    mainActors: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    genre: 'Crime',
    format: 'DVD',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop'
  }
];

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('useMovies: Loading movies from localStorage...');
    // Load movies from localStorage or use sample data
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      console.log('useMovies: Found saved movies in localStorage:', JSON.parse(savedMovies));
      setMovies(JSON.parse(savedMovies));
    } else {
      console.log('useMovies: No saved movies found, using sample data');
      setMovies(sampleMovies);
      localStorage.setItem('movies', JSON.stringify(sampleMovies));
    }
    setIsLoaded(true);
  }, []);

  const addMovie = (movieData: MovieFormData) => {
    console.log('useMovies: Adding new movie:', movieData);
    const newMovie: Movie = {
      ...movieData,
      id: Date.now().toString(),
    };
    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
    console.log('useMovies: Movie added successfully');
  };

  const updateMovie = (id: string, movieData: MovieFormData) => {
    console.log('useMovies: Updating movie with id:', id, 'data:', movieData);
    console.log('useMovies: Current movies array:', movies);
    const updatedMovies = movies.map(movie =>
      movie.id === id ? { ...movieData, id } : movie
    );
    console.log('useMovies: Updated movies array:', updatedMovies);
    setMovies(updatedMovies);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
    console.log('useMovies: Movie updated successfully');
  };

  const deleteMovie = (id: string) => {
    console.log('useMovies: Deleting movie with id:', id);
    const updatedMovies = movies.filter(movie => movie.id !== id);
    setMovies(updatedMovies);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
    console.log('useMovies: Movie deleted successfully');
  };

  const getMovie = (id: string) => {
    console.log('useMovies: Getting movie with id:', id);
    console.log('useMovies: Available movies:', movies);
    console.log('useMovies: Movies loaded?', isLoaded);
    const movie = movies.find(movie => movie.id === id);
    console.log('useMovies: Found movie:', movie);
    return movie;
  };

  return {
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    getMovie,
    isLoaded,
  };
};
