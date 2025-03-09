import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import { getTrendingmovies, updateSearch } from "./appwrite";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
const App = () => {
  const [searchterm, setSearchTerm] = useState("");
  const [errormsg, seterrormsg] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isloading, setisLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  useDebounce(() => setDebouncedTerm(searchterm), 1000, [searchterm]);
  const fetchMovies = async (query) => {
    setisLoading(true);
    seterrormsg("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const res = await fetch(endpoint, API_OPTIONS);
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
 
      // console.log(data);
      if (data.Response == false) {
        seterrormsg(data.value || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearch(query, data.results[0]);
      }
    } catch (e) {
      console.log(`Error fetching movies: ${e}`);
      seterrormsg("Error fetching movies, please try again later. ");
    } finally {
      setisLoading(false);
    }
  };

  const loadMovies = async () => {
    try {
      const movies = await getTrendingmovies();
      setTrendingMovies(movies);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchMovies(debouncedTerm);
  }, [debouncedTerm]);

  useEffect(() => {
    loadMovies();
  }, []);
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="hero banner" />
          <h1>
            Find <span className="text-gradient"> Movies</span> You'll Enjoy
            without the Hassle
          </h1>
          <Search searchterm={searchterm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2 className=" ">All Movies</h2>

          {isloading ? (
            <p className="text-white">Loading....</p>
          ) : errormsg ? (
            <p className="text-red-500">{errormsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
