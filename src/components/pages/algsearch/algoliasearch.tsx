
"use client"
import { useState } from 'react';
import { searchVideos } from '@/services/algoliaservice';
import { ISearchVideo } from '@/types/search.interface'

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    await searchVideos(query)
      .then((data) => {
        console.log(data);
        const searchResults: any[] = data;
      });

  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search videos..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}