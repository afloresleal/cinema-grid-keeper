
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieCard from '@/components/MovieCard';
import FilterPanel from '@/components/FilterPanel';
import SupabaseMovieList from '@/components/SupabaseMovieList';
import { useMovies } from '@/hooks/useMovies';
import { Movie } from '@/types/movie';

const Index = () => {
  const { movies, deleteMovie } = useMovies();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>([]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie: Movie) => {
      // Search filter
      const searchMatch = searchTerm === '' || 
        movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.mainActors.some(actor => actor.toLowerCase().includes(searchTerm.toLowerCase()));

      // Genre filter
      const genreMatch = selectedGenres.length === 0 || selectedGenres.includes(movie.genre);

      // Decade filter
      const decade = Math.floor(movie.year / 10) * 10;
      const decadeMatch = selectedDecades.length === 0 || selectedDecades.includes(`${decade}s`);

      return searchMatch && genreMatch && decadeMatch;
    });
  }, [movies, searchTerm, selectedGenres, selectedDecades]);

  const handleDeleteMovie = (id: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      deleteMovie(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">My Movie Library</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/import-movies">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </Link>
              <Link to="/add-movie">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Movie
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SupabaseMovieList />
      </div>
    </div>
  );
};

export default Index;
