
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useMovies } from '@/hooks/useMovies';
import { MovieFormData } from '@/types/movie';
import { useToast } from '@/hooks/use-toast';

const CsvImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);
  
  const { addMovie } = useMovies();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setImportResults(null);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.replace(/"/g, '') || '';
        });
        data.push(row);
      }
    }
    
    return data;
  };

  const mapCSVToMovie = (row: any): MovieFormData | null => {
    try {
      // Try to map common CSV column names to our movie fields
      const name = row.name || row.title || row.Name || row.Title || '';
      const year = parseInt(row.year || row.Year || '0');
      const director = row.director || row.Director || '';
      const genre = row.genre || row.Genre || '';
      const format = row.format || row.Format || 'Digital';
      
      // Handle actors - could be comma-separated or pipe-separated
      let actors: string[] = [];
      const actorsField = row.actors || row.Actors || row.mainActors || row['Main Actors'] || '';
      if (actorsField) {
        actors = actorsField.split(/[,|]/).map((actor: string) => actor.trim()).filter((actor: string) => actor);
      }
      
      const coverUrl = row.coverUrl || row.poster || row.Poster || row.image || '';

      if (!name || year === 0) {
        return null;
      }

      // Validate format
      const validFormats = ['Digital', 'DVD', 'Blu-ray'];
      const movieFormat = validFormats.includes(format) ? format : 'Digital';

      return {
        name,
        year,
        director,
        mainActors: actors.length > 0 ? actors : ['Unknown'],
        genre: genre || 'Unknown',
        format: movieFormat as 'Digital' | 'DVD' | 'Blu-ray',
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop'
      };
    } catch (error) {
      return null;
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    const results = { successful: 0, failed: 0, errors: [] as string[] };

    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      
      if (csvData.length === 0) {
        throw new Error('No valid data found in CSV file');
      }

      for (let i = 0; i < csvData.length; i++) {
        const movieData = mapCSVToMovie(csvData[i]);
        if (movieData) {
          try {
            addMovie(movieData);
            results.successful++;
          } catch (error) {
            results.failed++;
            results.errors.push(`Row ${i + 2}: Failed to add movie "${csvData[i].name || 'Unknown'}"`);
          }
        } else {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Missing required fields (name, year)`);
        }
      }

      setImportResults(results);
      
      if (results.successful > 0) {
        toast({
          title: "Import completed",
          description: `Successfully imported ${results.successful} movies${results.failed > 0 ? ` (${results.failed} failed)` : ''}`,
        });
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to parse CSV file",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Import Movies from CSV</h2>
      </div>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <Label htmlFor="csv-file" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Choose CSV file
              </span>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </Label>
            <p className="text-sm text-gray-500">
              Upload a CSV file with your movie collection
            </p>
          </div>
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isImporting ? 'Importing...' : 'Import Movies'}
            </Button>
          </div>
        )}

        {importResults && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {importResults.successful} movies imported successfully
              </span>
            </div>
            
            {importResults.failed > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {importResults.failed} movies failed to import
                  </span>
                </div>
                {importResults.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Import Errors:</h4>
                    <ul className="text-xs text-red-700 space-y-1">
                      {importResults.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {importResults.errors.length > 5 && (
                        <li>• ... and {importResults.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">CSV Format Guidelines:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Required columns: <strong>name/title</strong> and <strong>year</strong></li>
            <li>• Optional columns: <strong>director</strong>, <strong>genre</strong>, <strong>actors</strong>, <strong>format</strong>, <strong>coverUrl</strong></li>
            <li>• Actors can be separated by commas or pipes (|)</li>
            <li>• Format should be: Digital, DVD, or Blu-ray</li>
            <li>• First row should contain column headers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CsvImport;
