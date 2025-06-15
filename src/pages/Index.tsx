
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieCard from '@/components/MovieCard';
import FilterPanel from '@/components/FilterPanel';
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Search & Filters</h2>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search movies, directors, actors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <FilterPanel
                movies={movies}
                selectedGenres={selectedGenres}
                selectedDecades={selectedDecades}
                onGenresChange={setSelectedGenres}
                onDecadesChange={setSelectedDecades}
              />
            </div>
          </div>

          {/* Movies Grid */}
          <div className="flex-1">
            {filteredMovies.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="text-gray-500 mb-4">
                  {movies.length === 0 ? (
                    <>
                      <h3 className="text-xl font-semibold mb-2">No movies in your library yet</h3>
                      <p>Start building your collection by adding your first movie!</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold mb-2">No movies match your search</h3>
                      <p>Try adjusting your search terms or filters.</p>
                    </>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link to="/import-movies">
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Import from CSV
                    </Button>
                  </Link>
                  <Link to="/add-movie">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Movie
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    Showing {filteredMovies.length} of {movies.length} movies
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredMovies.map((movie: Movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onDelete={handleDeleteMovie}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
