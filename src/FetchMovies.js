import { useState, useEffect } from "react";
const key = "919fbcd2";
export function useMovies(query, callback) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(

        function () {
            callback?.()

            const controller = new AbortController();
            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");

                    let res = await fetch(
                        ` http://www.omdbapi.com/?apikey=${key}&s=${query}`,
                        { Signal: controller.signal }
                    );
                    if (!res.ok) throw new Error("Oops Something went wrong "); // no internet connection
                    let data = await res.json();
                    if (data.Response === "False") throw new Error("Movie Not Found!"); // no query matched
                    setMovies(data.Search);
                    setError("");
                    // console.log(data);
                } catch (err) {
                    // console.log(err.message);
                    if (err.name !== "AbortError") setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            if (query.length < 3) {
                setError("");
                setMovies([]);
                return;
            }
            // handleCloseMovie()
            fetchMovies();
            return function () {
                controller.abort();
            };
        },
        [query]
    );
    return { movies, isLoading, error }
}