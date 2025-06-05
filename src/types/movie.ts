
export interface Movie {
  id: string;
  name: string;
  year: number;
  director: string;
  mainActors: string[];
  genre: string;
  format: 'Digital' | 'DVD' | 'Blu-ray';
  coverUrl: string;
}

export interface MovieFormData {
  name: string;
  year: number;
  director: string;
  mainActors: string[];
  genre: string;
  format: 'Digital' | 'DVD' | 'Blu-ray';
  coverUrl: string;
}
