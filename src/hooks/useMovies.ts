import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    // Load movies from localStorage or use sample data
    const savedMovies = localStorage.getItem('movies');
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    } else {
      setMovies(sampleMovies);
      localStorage.setItem('movies', JSON.stringify(sampleMovies));
    }
  }, []);

  const addMovie = useCallback((movieData: MovieFormData) => {
    const newMovie: Movie = {
      ...movieData,
      id: Date.now().toString(),
    };
    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
  }, [movies]);

  const updateMovie = useCallback((id: string, movieData: MovieFormData) => {
    const updatedMovies = movies.map(movie =>
      movie.id === id ? { ...movieData, id } : movie
    );
    setMovies(updatedMovies);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
  }, [movies]);

  const deleteMovie = useCallback((id: string) => {
    const updatedMovies = movies.filter(movie => movie.id !== id);
    setMovies(updatedMovies);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
  }, [movies]);

  const getMovie = useCallback((id: string) => {
    return movies.find(movie => movie.id === id);
  }, [movies]);

  return {
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    getMovie,
  };
};
