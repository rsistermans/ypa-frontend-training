import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import * as ApiClient from './api-client'
import './app.css'

function Container({ children }) {
  return <div className="container">{children}</div>
}

function List({ children }) {
  return <ul className="movie-list">{children}</ul>
}

export function ListItem({ movie }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <li
      onClick={() => setExpanded(!expanded)}
      className={classnames('movie-item', {
        _is_expanded: expanded,
      })}
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

function MovieImage({ path, alt = '' }) {
  return <img src={`https://image.tmdb.org/t/p/w500/${path}`} alt={alt} />
}

export function App() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    async function fetchMovies() {
      const { results } = await ApiClient.getMovies('popularity.desc')
      if (results && results.length) {
        setMovies(results)
      }
    }
    fetchMovies()
  }, [])

  return (
    <Container>
      <h1>My Movies</h1>
      <List>{movies.map((movie) => <ListItem key={movie.id} movie={movie} />)}</List>
    </Container>
  )
}
