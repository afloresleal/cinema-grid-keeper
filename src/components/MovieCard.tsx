
import { Movie } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
  onDelete: (id: string) => void;
}

const MovieCard = ({ movie, onDelete }: MovieCardProps) => {
  const formatBadgeVariant = (format: string) => {
    switch (format) {
      case 'Digital':
        return 'default';
      case 'DVD':
        return 'secondary';
      case 'Blu-ray':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Movie Cover */}
      <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
        <img
          src={movie.coverUrl}
          alt={`${movie.name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight line-clamp-2">
            {movie.name}
          </h3>
          <Badge variant={formatBadgeVariant(movie.format)} className="ml-2 flex-shrink-0">
            {movie.format}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium">Year:</span> {movie.year}</p>
          <p><span className="font-medium">Director:</span> {movie.director}</p>
          <p><span className="font-medium">Genre:</span> {movie.genre}</p>
          <div>
            <span className="font-medium">Actors:</span>
            <div className="mt-1">
              {movie.mainActors.map((actor, index) => (
                <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                  {actor}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Link to={`/edit-movie/${movie.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(movie.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
