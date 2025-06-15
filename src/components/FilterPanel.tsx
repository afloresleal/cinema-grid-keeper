
import { Movie } from '@/types/movie';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';

interface FilterPanelProps {
  movies: Movie[];
  selectedGenres: string[];
  selectedDecades: string[];
  selectedActors: string[];
  onGenresChange: (genres: string[]) => void;
  onDecadesChange: (decades: string[]) => void;
  onActorsChange: (actors: string[]) => void;
}

const FilterPanel = ({
  movies,
  selectedGenres,
  selectedDecades,
  selectedActors,
  onGenresChange,
  onDecadesChange,
  onActorsChange,
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

  const availableActors = useMemo(() => {
    const actors = Array.from(new Set(
      movies.flatMap(movie => movie.mainActors)
    ));
    return actors.sort();
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

  const handleActorChange = (actor: string, checked: boolean) => {
    if (checked) {
      onActorsChange([...selectedActors, actor]);
    } else {
      onActorsChange(selectedActors.filter(a => a !== actor));
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

      {/* Actor Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Actors</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableActors.map(actor => (
            <div key={actor} className="flex items-center space-x-2">
              <Checkbox
                id={`actor-${actor}`}
                checked={selectedActors.includes(actor)}
                onCheckedChange={(checked) => handleActorChange(actor, checked as boolean)}
              />
              <Label htmlFor={`actor-${actor}`} className="text-sm">
                {actor}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedGenres.length > 0 || selectedDecades.length > 0 || selectedActors.length > 0) && (
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              onGenresChange([]);
              onDecadesChange([]);
              onActorsChange([]);
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
