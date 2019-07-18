import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { useDebounce } from 'use-debounce'
import * as ApiClient from './api-client'
import './app.css'

function Container({ children }) {
  return <div className="container">{children}</div>
}

function List({ children }) {
  return <ul className="movie-list">{children}</ul>
}

function Loader() {
  return <div className="loader" aria-hidden="true" />
}

function MovieImage({ path, alt = '' }) {
  return <img src={`https://image.tmdb.org/t/p/w500/${path}`} alt={alt} />
}

export function ListItem({ movie }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <li
      className={classnames('movie-item', { _is_expanded: expanded })}
      onClick={() => setExpanded(!expanded)}
      role="button"
    >
      {movie.backdrop_path && <MovieImage path={movie.backdrop_path} alt={movie.title} />}
      <h3>{movie.title}</h3>
      <div className="movie-item__content">
        <p>{movie.overview}</p>
        <span>
          Rating: <strong>{movie.vote_average} / 10</strong> ({movie.vote_count} ratings)
        </span>
      </div>
    </li>
  )
}

function InputField({ onChange, ...rest }) {
  const [value, setValue] = useState(rest.value)

  useEffect(
    () => {
      onChange(value)
    },
    [value]
  )

  return <input {...rest} onChange={(e) => setValue(e.target.value)} />
}

function Sorting({ onChange, ...rest }) {
  const [value, setValue] = useState(rest.value)

  useEffect(
    () => {
      onChange(value)
    },
    [value]
  )

  return (
    <select
      {...rest}
      onChange={(e) => setValue(e.target.value)}
    >
      <option value="none">Select sorting</option>
      <option value="popularity.desc">Most popular</option>
      <option value="popularity.asc">Least popular</option>
      <option value="new.desc">Newest</option>
      <option value="new.asc">Oldest</option>
    </select>
  )
}

function sortArray(arr, key, direction = 'desc') {
  if (direction === 'desc') {
    return arr.sort((a, b) => (a[key] < b[key] ? -1 : 1))
  }
  if (direction === 'asc') {
    return arr.sort((a, b) => (a[key] < b[key] ? 1 : -1))
  }
  return arr
}

function sortMovies(movies, sortBy) {
  switch (sortBy) {
    case 'popularity.desc':
      return sortArray(movies, 'vote_average', 'desc')
    case 'popularity.asc':
      return sortArray(movies, 'vote_average', 'asc')
    case 'new.desc':
      return sortArray(movies, 'release_date', 'desc')
    case 'new.asc':
      return sortArray(movies, 'release_date', 'asc')
    default:
      return movies
  }
}

export function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState('none')
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)

  const fetchMovies = async (sortBy = 'popularity.desc') => {
    setIsLoading(true)

    const { results } = await ApiClient.getMovies(sortBy)
    if (results && results.length) {
      setMovies(results)
    }

    setIsLoading(false)
  }

  const searchMovies = async (query) => {
    setIsLoading(true)

    const { results } = await ApiClient.searchMovies(query, sortBy)
    if (results) {
      setMovies(results)
    }

    setIsLoading(false)
  }

  // Mount
  useEffect(() => {
    fetchMovies()
  }, [])

  // Query change
  useEffect(
    () => {
      if (debouncedQuery !== '') {
        searchMovies(debouncedQuery)
      } else {
        fetchMovies() // restore original movies
      }
    },
    [debouncedQuery]
  )

  // Sort by change
  useEffect(
    () => {
      setIsLoading(true)
      setMovies([])

      const sortedMovies = sortMovies(movies, sortBy)

      setMovies(sortedMovies)
      setIsLoading(false)
    },
    [sortBy]
  )

  return (
    <Container>
      <h1>My Movies</h1>
      <InputField
        type="search"
        className="movie-search-input"
        placeholder="Search for movies"
        name="query"
        value={query}
        onChange={(value) => setQuery(value)}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {debouncedQuery !== '' &&
            movies.length !== 0 && (
              <div className="movie-search-info">
                <span className="movie-search-label">
                  Search results for: <strong>"{debouncedQuery}"</strong>
                </span>
                <Sorting value={sortBy} onChange={(value) => setSortBy(value)} />
              </div>
            )}
          {movies.length === 0 && (
            <div className="movie-search-no-results">
              <h3>No results found for: {debouncedQuery}</h3>
            </div>
          )}
          <List>{movies.map((movie) => <ListItem key={movie.id} movie={movie} />)}</List>
        </>
      )}
    </Container>
  )
}
