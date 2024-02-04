import { useEffect, useRef, useState } from "react";
import React from "react";
import StarRating from "./StarRating";
import { useMovies } from "./FetchMovies";
import { useLocalStorageState } from "./StoreWatchedMovies";
import { useKey } from "./KeyDown";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const key = "919fbcd2";
// const tempQuery = "Dunki"

export default function Appv1() {

  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useLocalStorageState([], "watched")


  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleWatchMovie(movie) {
    setWatched((watched) => [...watched, movie]);


  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie)

  return (
    <div>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {" "}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorHandler message={error} />
          ) : (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onWatchMovie={handleWatchMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}
// function NoMovies() {
//   return (
//     <p className="error">Serach For Movies</p>
//   )
// }
function Loader() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

function Navbar({ children }) {
  return (
    <div>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </div>
  );
}
function Main({ children }) {
  return <main className="mained">{children}</main>;
}
function Search({ query, setQuery }) {
  const inputEl = useRef(null)
  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus()

  // }, [])
  useKey("Enter", function (e) {
    if (document.activeElement === inputEl.current) return;

    inputEl.current.focus()
    setQuery("")



  })

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies,anime and web series..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="boxed">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          onClick={() => onDeleteWatched(movie.imdbID)}
          className="btn-delete"
        >
          ❌
        </button>
      </div>
    </li>
  );
}
function MovieDetails({ selectedId, onCloseMovie, onWatchMovie, watched }) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Plot: plot,
  } = movie;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const isRated = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countDecisions: countRef.current
    };
    onWatchMovie(newWatchedMovie);
    onCloseMovie();
  }
  const countRef = useRef(0);
  useEffect(function () {
    if (userRating) {
      countRef.current++;
    }
  }, [userRating])
  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");

          let res = await fetch(
            ` http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
          );
          if (!res.ok) throw new Error("Oops Something went wrong ");
          let data = await res.json();
          // console.log(data);
          setMovie(data);
          setIsLoading(false);
        } catch (error) {
          setError(error.message);
          // console.log(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = title;
      return function () {
        document.title = "MoviesHome";
      };
    },
    [title]
  );
  useKey("Escape", onCloseMovie)

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorHandler message={error} />
      ) : (
        <>
          <div className="details">
            <header>
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>
            <section>
              <div className="rating">
                {!isWatched ? (
                  <>
                    {" "}
                    <StarRating
                      maxRating={10}
                      size={30}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button className="btn-add" onClick={handleAdd}>
                        + Add to list
                      </button>
                    )}{" "}
                  </>
                ) : (
                  <p style={{ fontSize: "20px", marginLeft: "5px" }}>
                    This movie is Rated {isRated}🌟
                  </p>
                )}
              </div>

              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Director by {director}</p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
function ErrorHandler({ message }) {
  return (
    <p className="error">
      <span>😀</span>
      {message}
    </p>
  );
}
