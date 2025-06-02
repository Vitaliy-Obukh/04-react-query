// import css from './App.module.css';
// import { useState } from 'react';
// import SearchBar from '../SearchBar/SearchBar';
// import MovieGrid from '../MovieGrid/MovieGrid';
// import Loader from '../Loader/Loader';
// import ErrorMessage from '../ErrorMessage/ErrorMessage';
// import MovieModal from '../MovieModal/MovieModal';
// import { fetchMovies } from '../../services/movieService';
// import type { Movie } from '../../types/movie';
// import toast, { Toaster } from 'react-hot-toast';

// export default function App() {
//     const [movies, setMovies] = useState<Movie[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [isError, setIsError] = useState<boolean>(false);
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//     const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

//     const handleSubmit = async (query: string) => {
//         try {
//             setIsLoading(true);
//             setIsError(false);
//             setMovies([]);
//             const data = await fetchMovies(query);

//             if (data.length === 0) {
//                 toast(`No movies found for your request.`);
//                 return;
//             }

//             setMovies(data);
//         } catch {
//             setIsError(true);
//         } finally {
//             setIsLoading(false)
//         }
//     };

//     const handleSelect = (movie: Movie) => {
//         setSelectedMovie(movie);
//         setIsModalOpen(true);
//     };
//     const handleClose = () => {
//         setIsModalOpen(false);
//         setSelectedMovie(null);
//     };

//     return (<div className={css.app}>
//     <SearchBar
//     onSubmit={handleSubmit}
//     />
//     {movies.length > 0 &&
//     <MovieGrid
//     onSelect={handleSelect}
//     movies={movies}
//     />
//     }
//     {isLoading && <Loader />}
//     {isError && <ErrorMessage />}
//     {isModalOpen && selectedMovie && (
//         <MovieModal
//         movie={selectedMovie}
//         onClose={handleClose}
//         />
//     )}
//     <Toaster />
//     </div>)
// }
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { useEffect } from 'react';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import css from '../App/App.module.css';
export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movie', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  });
  useEffect(() => {
    if (data && data.results.length === 0) {
      toast('No movies found for your request.');
    }
  }, [data]);
  const handleSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };
  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
        </>
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
