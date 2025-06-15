
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OMDBResponse {
  Title: string;
  Year: string;
  Director: string;
  Actors: string;
  Genre: string;
  Poster: string;
  Response: string;
  Error?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery } = await req.json();
    
    if (!searchQuery) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const omdbApiKey = Deno.env.get('OMDB_API_KEY');
    
    if (!omdbApiKey) {
      console.error('OMDB_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('Searching for movie:', searchQuery);
    console.log('API key exists:', !!omdbApiKey);
    console.log('API key length:', omdbApiKey.length);
    
    // Use HTTPS instead of HTTP - this is often the cause of 401 errors
    const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(searchQuery)}&apikey=${omdbApiKey}`;
    console.log('OMDB URL (without key):', `https://www.omdbapi.com/?t=${encodeURIComponent(searchQuery)}&apikey=***`);
    
    const response = await fetch(omdbUrl);
    
    console.log('OMDB response status:', response.status);
    
    if (!response.ok) {
      console.error('OMDB API HTTP error:', response.status, response.statusText);
      
      // Specific handling for 401 errors
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid API key or unauthorized access. Please check your OMDB API key.',
            found: false 
          }),
          { 
            status: 200, // Return 200 so the frontend can handle it gracefully
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `OMDB API error: ${response.status}` }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    const data: OMDBResponse = await response.json();
    
    console.log('OMDB response:', data);
    
    if (data.Response === 'False') {
      console.log('Movie not found or API error:', data.Error);
      return new Response(
        JSON.stringify({ found: false, error: data.Error || 'Movie not found' }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    // Transform OMDB data to our format
    const movieData = {
      found: true,
      name: data.Title,
      year: parseInt(data.Year),
      director: data.Director,
      mainActors: data.Actors.split(', ').slice(0, 3), // Take first 3 actors
      genre: data.Genre.split(', ')[0], // Take first genre
      coverUrl: data.Poster !== 'N/A' ? data.Poster : '',
    };
    
    return new Response(
      JSON.stringify(movieData),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
    
  } catch (error: any) {
    console.error('Error in omdb-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
