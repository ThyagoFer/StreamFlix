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

const CATEGORIAS_FILMES = [
  { slug: "trending", title: "Em Alta", path: "/trending/movie/week?language=pt-BR&include_adult=false" },
  { slug: "toprated", title: "Mais Votados", path: "/movie/top_rated?language=pt-BR&include_adult=false" },
  { slug: "action", title: "Ação e Aventura", path: "/discover/movie?with_genres=28&language=pt-BR&include_adult=false" },
  { slug: "comedy", title: "Comédia", path: "/discover/movie?with_genres=35&language=pt-BR&include_adult=false" },
  { slug: "horror", title: "Terror", path: "/discover/movie?with_genres=27&language=pt-BR&include_adult=false" },
  { slug: "documentary", title: "Documentário", path: "/discover/movie?with_genres=99&language=pt-BR&include_adult=false" },
  { slug: "scifi", title: "Ficção Científica", path: "/discover/movie?with_genres=878&language=pt-BR&include_adult=false" },
  { slug: "fantasy", title: "Fantasia", path: "/discover/movie?with_genres=14&language=pt-BR&include_adult=false" },
  { slug: "romance", title: "Romance", path: "/discover/movie?with_genres=10749&language=pt-BR&include_adult=false" },
  { slug: "drama", title: "Drama", path: "/discover/movie?with_genres=18&language=pt-BR&include_adult=false" },
];

export default function Filmes() {
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
      
      for (const categoria of CATEGORIAS_FILMES) {
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

  const handleFilmeClick = (filme) => {
    navigate(`/detalhes/movie/${filme.id}`);
  };

  const handleToggleLista = (e, filme) => {
    e.stopPropagation();
    const isNaLista = lista.some(item => item.id === filme.id);
    
    if (isNaLista) {
      removerFilme(filme.id);
    } else {
      adicionarFilme(filme);
    }
  };

  const isNaLista = (filme) => {
    return lista.some(item => item.id === filme.id);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando filmes... <SlReload /></p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Filmes</h1>
        <p>Descubra os melhores filmes em todas as categorias</p>
      </div>

      <div className={styles.categorias}>
        {categorias.map((categoria) => (
          <section key={categoria.slug} className={styles.categoria}>
            <h2 className={styles.tituloCategoria}>{categoria.title}</h2>
            <div className={styles.grid}>
              {categoria.items.slice(0, 10).map((filme) => (
                <div
                  key={filme.id}
                  className={styles.card}
                  onClick={() => handleFilmeClick(filme)}
                >
                  <div className={styles.posterContainer}>
                    <img
                      src={filme.poster_path 
                        ? `https://image.tmdb.org/t/p/w300${filme.poster_path}`
                        : '/placeholder-movie.jpg'
                      }
                      alt={filme.title}
                      className={styles.poster}
                    />
                    <div className={styles.overlay}>
                      <button
                        className={`${styles.btnLista} ${isNaLista(filme) ? styles.naLista : ''}`}
                        onClick={(e) => handleToggleLista(e, filme)}
                      >
                        {isNaLista(filme) ? <GoHeartFill /> : <GoHeart />}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.info}>
                    <h3>{filme.title}</h3>
                    <div className={styles.meta}>
                      <span className={styles.ano}>
                        {new Date(filme.release_date).getFullYear()}
                      </span>
                      <span className={styles.avaliacao}>
                        ⭐ {filme.vote_average?.toFixed(1)}
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


