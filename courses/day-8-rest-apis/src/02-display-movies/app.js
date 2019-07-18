import React, { useState, useEffect } from 'react'
import * as ApiClient from './api-client'
import './app.css'

function Container({ children }) {
  return <div className="container">{children}</div>
}

function List({ children }) {
  return <ul className="movie-list">{children}</ul>
}

export function ListItem({ movie }) {
  return (
    <li className="movie-item">
      <h3>{movie.title}</h3>
    </li>
  )
}

function Image({ src, alt = '' }) {
  return <img src={src} alt={alt} />
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
