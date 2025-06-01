import css from './App.module.css';
import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSubmit = async (query: string) => {
        try {
            setIsLoading(true);
            setIsError(false);
            setMovies([]);
            const data = await fetchMovies(query);

            if (data.length === 0) {
                toast(`No movies found for your request.`);
                return;
            }

            setMovies(data);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false)
        }
    };

    const handleSelect = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };
    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    return (<div className={css.app}>
    <SearchBar 
    onSubmit={handleSubmit} 
    />
    {movies.length > 0 && 
    <MovieGrid 
    onSelect={handleSelect} 
    movies={movies} 
    />
    }
    {isLoading && <Loader />}
    {isError && <ErrorMessage />}
    {isModalOpen && selectedMovie && (
        <MovieModal 
        movie={selectedMovie} 
        onClose={handleClose} 
        />
    )}
    <Toaster />
    </div>)
}