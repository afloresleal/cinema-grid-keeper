
import { Movie } from '@/types/movie';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';

interface FilterPanelProps {
  movies: Movie[];
  selectedGenres: string[];
  selectedDecades: string[];
  onGenresChange: (genres: string[]) => void;
  onDecadesChange: (decades: string[]) => void;
}

const FilterPanel = ({
  movies,
  selectedGenres,
  selectedDecades,
  onGenresChange,
  onDecadesChange,
}: FilterPanelProps) => {
  const availableGenres = useMemo(() => {
    const genres = Array.from(new Set(movies.map(movie => movie.genre)));
    return genres.sort();
  }, [movies]);

  const availableDecades = useMemo(() => {
    const decades = Array.from(new Set(movies.map(movie => {
      const decade = Math.floor(movie.year / 10) * 10;
      return `${decade}s`;
    })));
    return decades.sort().reverse();
  }, [movies]);

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      onGenresChange([...selectedGenres, genre]);
    } else {
      onGenresChange(selectedGenres.filter(g => g !== genre));
    }
  };

  const handleDecadeChange = (decade: string, checked: boolean) => {
    if (checked) {
      onDecadesChange([...selectedDecades, decade]);
    } else {
      onDecadesChange(selectedDecades.filter(d => d !== decade));
    }
  };

  return (
    <div className="space-y-6">
      {/* Genre Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Genre</h3>
        <div className="space-y-2">
          {availableGenres.map(genre => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
              />
              <Label htmlFor={`genre-${genre}`} className="text-sm">
                {genre}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Decade Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Decade</h3>
        <div className="space-y-2">
          {availableDecades.map(decade => (
            <div key={decade} className="flex items-center space-x-2">
              <Checkbox
                id={`decade-${decade}`}
                checked={selectedDecades.includes(decade)}
                onCheckedChange={(checked) => handleDecadeChange(decade, checked as boolean)}
              />
              <Label htmlFor={`decade-${decade}`} className="text-sm">
                {decade}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedGenres.length > 0 || selectedDecades.length > 0) && (
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              onGenresChange([]);
              onDecadesChange([]);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
