import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMinhaLista } from '../context/MinhaListaContext';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { SlReload } from 'react-icons/sl';
import styles from './Categorias.module.css';

const TMDB_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxODVmYTVkNmY5M2UwODJlMWMzYjkyYTU5MzgyZTYxOCIsIm5iZiI6MTczNzUwNjA0MC43MTIsInN1YiI6IjY3OTAzY2Y4YmU5YTlhYTc4Mjc3NDA5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jkkt9V0WEXsWNVmQjx7QJeyYmvrBlKxyfPCYUjbAcfM";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
  },
};

const CATEGORIAS_SERIES = [
  { slug: "trending", title: "Em Alta", path: "/trending/tv/week?language=pt-BR&include_adult=false" },
  { slug: "toprated", title: "Mais Votadas", path: "/tv/top_rated?language=pt-BR&include_adult=false" },
  { slug: "action", title: "Ação e Aventura", path: "/discover/tv?with_genres=10759&language=pt-BR&include_adult=false" },
  { slug: "comedy", title: "Comédia", path: "/discover/tv?with_genres=35&language=pt-BR&include_adult=false" },
  { slug: "horror", title: "Terror", path: "/discover/tv?with_genres=27&language=pt-BR&include_adult=false" },
  { slug: "documentary", title: "Documentário", path: "/discover/tv?with_genres=99&language=pt-BR&include_adult=false" },
  { slug: "scifi", title: "Ficção Científica", path: "/discover/tv?with_genres=878&language=pt-BR&include_adult=false" },
  { slug: "fantasy", title: "Fantasia", path: "/discover/tv?with_genres=14&language=pt-BR&include_adult=false" },
  { slug: "romance", title: "Romance", path: "/discover/tv?with_genres=10749&language=pt-BR&include_adult=false" },
  { slug: "drama", title: "Drama", path: "/discover/tv?with_genres=18&language=pt-BR&include_adult=false" },
];

export default function Series() {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { lista, adicionarFilme, removerFilme } = useMinhaLista();

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setIsLoading(true);
    try {
      const novasCategorias = [];
      
      for (const categoria of CATEGORIAS_SERIES) {
        try {
          const url = `${TMDB_BASE_URL}${categoria.path}`;
          const response = await fetch(url, API_OPTIONS);
          const data = await response.json();
          
          novasCategorias.push({
            slug: categoria.slug,
            title: categoria.title,
            items: data.results || [],
          });
        } catch (error) {
          console.error(`Erro ao carregar ${categoria.title}:`, error);
        }
      }
      
      setCategorias(novasCategorias);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSerieClick = (serie) => {
    navigate(`/detalhes/tv/${serie.id}`);
  };

  const handleToggleLista = (e, serie) => {
    e.stopPropagation();
    const isNaLista = lista.some(item => item.id === serie.id);
    
    if (isNaLista) {
      removerFilme(serie.id);
    } else {
      adicionarFilme(serie);
    }
  };

  const isNaLista = (serie) => {
    return lista.some(item => item.id === serie.id);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando séries... <SlReload /></p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Séries</h1>
        <p>Descubra as melhores séries em todas as categorias</p>
      </div>

      <div className={styles.categorias}>
        {categorias.map((categoria) => (
          <section key={categoria.slug} className={styles.categoria}>
            <h2 className={styles.tituloCategoria}>{categoria.title}</h2>
            <div className={styles.grid}>
              {categoria.items.slice(0, 10).map((serie) => (
                <div
                  key={serie.id}
                  className={styles.card}
                  onClick={() => handleSerieClick(serie)}
                >
                  <div className={styles.posterContainer}>
                    <img
                      src={serie.poster_path 
                        ? `https://image.tmdb.org/t/p/w300${serie.poster_path}`
                        : '/placeholder-movie.jpg'
                      }
                      alt={serie.name}
                      className={styles.poster}
                    />
                    <div className={styles.overlay}>
                      <button
                        className={`${styles.btnLista} ${isNaLista(serie) ? styles.naLista : ''}`}
                        onClick={(e) => handleToggleLista(e, serie)}
                      >
                        {isNaLista(serie) ? <GoHeartFill /> : <GoHeart />}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.info}>
                    <h3>{serie.name}</h3>
                    <div className={styles.meta}>
                      <span className={styles.ano}>
                        {new Date(serie.first_air_date).getFullYear()}
                      </span>
                      <span className={styles.avaliacao}>
                        ⭐ {serie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}


