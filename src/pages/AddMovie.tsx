
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowLeft, CheckCircle } from 'lucide-react';
import { useMovies } from '@/hooks/useMovies';
import { MovieFormData } from '@/types/movie';
import { useToast } from '@/hooks/use-toast';

const AddMovie = () => {
  const navigate = useNavigate();
  const { addMovie } = useMovies();
  const { toast } = useToast();
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<MovieFormData>({
    name: '',
    year: new Date().getFullYear(),
    director: '',
    mainActors: ['', '', ''],
    genre: '',
    format: 'Digital',
    coverUrl: ''
  });

  const handleSearch = () => {
    // In a real app, this would call an external API
    // For now, we'll simulate auto-population
    if (searchQuery.toLowerCase().includes('matrix')) {
      setFormData({
        name: 'The Matrix',
        year: 1999,
        director: 'The Wachowskis',
        mainActors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
        genre: 'Science Fiction',
        format: 'Digital',
        coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop'
      });
      setIsSearchMode(false);
      toast({
        title: "Movie found!",
        description: "Please verify the information and select a format.",
      });
    } else {
      // No match found, switch to manual entry
      setFormData(prev => ({ ...prev, name: searchQuery }));
      setIsSearchMode(false);
      toast({
        title: "No auto-match found",
        description: "Please fill in the movie details manually.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    addMovie(filteredFormData);
    
    toast({
      title: "Movie added successfully!",
      description: (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{formData.name} has been added to your library.</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Add New Movie</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSearchMode ? (
          /* Search Mode */
          <Card>
            <CardHeader>
              <CardTitle>Search for Movie</CardTitle>
              <p className="text-gray-600">
                Enter a movie title to automatically populate information, or continue manually if not found.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter movie title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsSearchMode(false)}
                  className="w-full"
                >
                  Enter Details Manually
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Form Mode */
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Movie Details</CardTitle>
                <p className="text-gray-600">
                  Please verify and complete the movie information below.
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
                onClick={() => setIsSearchMode(true)}
                className="flex-1"
              >
                Back to Search
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Add Movie
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMovie;
