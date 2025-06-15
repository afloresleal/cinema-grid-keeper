
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface SupabaseMovie {
  Name: string | null;
  Year: number | null;
  Director: string | null;
  Actors: string | null;
  Genre: string | null;
  Format: string | null;
  coverUrl: string | null;
}

const SupabaseMovieList = () => {
  const [movies, setMovies] = useState<SupabaseMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log('Fetching movies from Supabase...');
        const { data, error } = await supabase
          .from('movieDB')
          .select('*');

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
        } else {
          console.log('Fetched movies from Supabase:', data);
          setMovies(data || []);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading movies from Supabase...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Error loading movies</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <h3 className="text-gray-800 font-semibold mb-2">No movies found</h3>
        <p className="text-gray-600">Your Supabase movieDB table is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Movies from Supabase Database</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {movies.map((movie, index) => (
          <Card key={index} className="overflow-hidden">
            {movie.coverUrl && (
              <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
                <img
                  src={movie.coverUrl}
                  alt={movie.Name || 'Movie cover'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop';
                  }}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{movie.Name || 'Untitled'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Year:</span>
                <span className="font-medium">{movie.Year || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Director:</span>
                <span className="font-medium text-right">{movie.Director || 'N/A'}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Genre:</span>
                <div className="mt-1">
                  {movie.Genre && (
                    <Badge variant="outline">{movie.Genre}</Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Format:</span>
                <div className="mt-1">
                  {movie.Format && (
                    <Badge variant="secondary">{movie.Format}</Badge>
                  )}
                </div>
              </div>
              {movie.Actors && (
                <div>
                  <span className="text-sm text-gray-600">Actors:</span>
                  <p className="text-sm mt-1">{movie.Actors}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SupabaseMovieList;
