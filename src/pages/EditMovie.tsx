
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useMovies } from '@/hooks/useMovies';
import { MovieFormData } from '@/types/movie';
import { useToast } from '@/hooks/use-toast';

const EditMovie = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateMovie, getMovie, isLoaded } = useMovies();
  const { toast } = useToast();
  const [formData, setFormData] = useState<MovieFormData>({
    name: '',
    year: new Date().getFullYear(),
    director: '',
    mainActors: ['', '', ''],
    genre: '',
    format: 'Digital',
    coverUrl: ''
  });

  useEffect(() => {
    console.log('EditMovie: Component mounted, id:', id, 'isLoaded:', isLoaded);
    
    if (id && isLoaded) {
      console.log('EditMovie: Attempting to get movie with id:', id);
      const movie = getMovie(id);
      console.log('EditMovie: Retrieved movie:', movie);
      
      if (movie) {
        console.log('EditMovie: Setting form data with movie:', movie);
        setFormData({
          name: movie.name,
          year: movie.year,
          director: movie.director,
          mainActors: [
            movie.mainActors[0] || '',
            movie.mainActors[1] || '',
            movie.mainActors[2] || ''
          ],
          genre: movie.genre,
          format: movie.format,
          coverUrl: movie.coverUrl
        });
      } else {
        console.log('EditMovie: Movie not found, showing error and redirecting');
        toast({
          title: "Movie not found",
          description: "The movie you're trying to edit doesn't exist.",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [id, getMovie, navigate, toast, isLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    console.log('EditMovie: Submitting form with data:', formData);

    // Validation
    const requiredFields = ['name', 'director', 'genre', 'coverUrl'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof MovieFormData]);
    const hasActors = formData.mainActors.some(actor => actor.trim() !== '');
    
    if (missingFields.length > 0 || !hasActors) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and at least one actor.",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty actors
    const filteredFormData = {
      ...formData,
      mainActors: formData.mainActors.filter(actor => actor.trim() !== '')
    };

    console.log('EditMovie: Calling updateMovie with:', id, filteredFormData);
    updateMovie(id, filteredFormData);
    
    toast({
      title: "Movie updated successfully!",
      description: (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{formData.name} has been updated.</span>
        </div>
      ),
    });

    navigate('/');
  };

  const updateFormField = (field: keyof MovieFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateActor = (index: number, value: string) => {
    const newActors = [...formData.mainActors];
    newActors[index] = value;
    setFormData(prev => ({ ...prev, mainActors: newActors }));
  };

  // Show loading state while movies are being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 mb-2">Loading...</div>
          <div className="text-gray-600">Loading movie data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Library
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Movie</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Movie Details</CardTitle>
              <p className="text-gray-600">
                Update the movie information below.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Movie Name */}
                <div>
                  <Label htmlFor="name">Movie Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormField('name', e.target.value)}
                    required
                  />
                </div>

                {/* Year */}
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1800"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => updateFormField('year', parseInt(e.target.value))}
                    required
                  />
                </div>

                {/* Director */}
                <div>
                  <Label htmlFor="director">Director *</Label>
                  <Input
                    id="director"
                    type="text"
                    value={formData.director}
                    onChange={(e) => updateFormField('director', e.target.value)}
                    required
                  />
                </div>

                {/* Genre */}
                <div>
                  <Label htmlFor="genre">Genre *</Label>
                  <Input
                    id="genre"
                    type="text"
                    value={formData.genre}
                    onChange={(e) => updateFormField('genre', e.target.value)}
                    placeholder="e.g., Action, Drama, Comedy"
                    required
                  />
                </div>

                {/* Format */}
                <div>
                  <Label htmlFor="format">Format *</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(value) => updateFormField('format', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Digital">Digital</SelectItem>
                      <SelectItem value="DVD">DVD</SelectItem>
                      <SelectItem value="Blu-ray">Blu-ray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cover URL */}
                <div>
                  <Label htmlFor="coverUrl">Cover Image URL *</Label>
                  <Input
                    id="coverUrl"
                    type="url"
                    value={formData.coverUrl}
                    onChange={(e) => updateFormField('coverUrl', e.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>

              {/* Main Actors */}
              <div>
                <Label>Main Actors * (at least one required)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {formData.mainActors.map((actor, index) => (
                    <Input
                      key={index}
                      type="text"
                      placeholder={`Actor ${index + 1}`}
                      value={actor}
                      onChange={(e) => updateActor(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              {formData.coverUrl && (
                <div>
                  <Label>Cover Preview</Label>
                  <div className="mt-2">
                    <img
                      src={formData.coverUrl}
                      alt="Cover preview"
                      className="w-24 h-36 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Update Movie
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;
