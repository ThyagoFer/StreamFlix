import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoSearch, GoX } from 'react-icons/go';
import { useMinhaLista } from '../context/MinhaListaContext';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import styles from './Busca.module.css';

const TMDB_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxODVmYTVkNmY5M2UwODJlMWMzYjkyYTU5MzgyZTYxOCIsIm5iZiI6MTczNzUwNjA0MC43MTIsInN1YiI6IjY3OTAzY2Y4YmU5YTlhYTc4Mjc3NDA5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jkkt9V0WEXsWNVmQjx7QJeyYmvrBlKxyfPCYUjbAcfM";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
  },
};

export default function Busca() {
  const [termoBusca, setTermoBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtro, setFiltro] = useState('all');
  const navigate = useNavigate();
  const { lista, adicionarFilme, removerFilme } = useMinhaLista();

  useEffect(() => {
    if (termoBusca.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        buscarConteudo();
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setResultados([]);
    }
  }, [termoBusca, filtro]);

  const buscarConteudo = async () => {
    if (!termoBusca.trim()) return;

    setIsLoading(true);
    try {
      let url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(termoBusca)}&language=pt-BR&include_adult=false`;
      
      if (filtro === 'movie') {
        url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(termoBusca)}&language=pt-BR&include_adult=false`;
      } else if (filtro === 'tv') {
        url = `${TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(termoBusca)}&language=pt-BR&include_adult=false`;
      }

      const response = await fetch(url, API_OPTIONS);
      const data = await response.json();

      let resultadosFiltrados = data.results || [];
      
      if (filtro === 'all') {
        resultadosFiltrados = resultadosFiltrados.filter(item => 
          item.media_type === 'movie' || item.media_type === 'tv'
        );
      }
      
      setResultados(resultadosFiltrados);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConteudoClick = (conteudo) => {
    const tipo = conteudo.media_type || (conteudo.first_air_date ? 'tv' : 'movie');
    navigate(`/detalhes/${tipo}/${conteudo.id}`);
  };

  const handleToggleLista = (e, conteudo) => {
    e.stopPropagation();
    const isNaLista = lista.some(item => item.id === conteudo.id);
    
    if (isNaLista) {
      removerFilme(conteudo.id);
    } else {
      adicionarFilme(conteudo);
    }
  };

  const limparBusca = () => {
    setTermoBusca('');
    setResultados([]);
  };

  const isNaLista = (conteudo) => {
    return lista.some(item => item.id === conteudo.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Buscar Filmes e Séries</h1>
        
        <div className={styles.buscaContainer}>
          <div className={styles.inputContainer}>
            <GoSearch className={styles.iconeBusca} />
            <input
              type="text"
              placeholder="Digite o nome do filme ou série..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className={styles.inputBusca}
            />
            {termoBusca && (
              <button onClick={limparBusca} className={styles.btnLimpar}>
                <GoX />
              </button>
            )}
          </div>
          
          <div className={styles.filtros}>
            <button
              className={`${styles.filtro} ${filtro === 'all' ? styles.ativo : ''}`}
              onClick={() => setFiltro('all')}
            >
              Todos
            </button>
            <button
              className={`${styles.filtro} ${filtro === 'movie' ? styles.ativo : ''}`}
              onClick={() => setFiltro('movie')}
            >
              Filmes
            </button>
            <button
              className={`${styles.filtro} ${filtro === 'tv' ? styles.ativo : ''}`}
              onClick={() => setFiltro('tv')}
            >
              Séries
            </button>
          </div>
        </div>
      </div>

      <div className={styles.resultados}>
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Buscando...</p>
          </div>
        )}

        {!isLoading && termoBusca && resultados.length === 0 && (
          <div className={styles.semResultados}>
            <p>Nenhum resultado encontrado para "{termoBusca}"</p>
          </div>
        )}

        {!isLoading && termoBusca && resultados.length > 0 && (
          <>
            <div className={styles.contador}>
              <p>{resultados.length} resultado(s) encontrado(s)</p>
            </div>
            
            <div className={styles.grid}>
              {resultados.map((conteudo) => (
                <div
                  key={`${conteudo.media_type || 'movie'}-${conteudo.id}`}
                  className={styles.card}
                  onClick={() => handleConteudoClick(conteudo)}
                >
                  <div className={styles.posterContainer}>
                    <img
                      src={conteudo.poster_path 
                        ? `https://image.tmdb.org/t/p/w300${conteudo.poster_path}`
                        : '/placeholder-movie.jpg'
                      }
                      alt={conteudo.title || conteudo.name}
                      className={styles.poster}
                    />
                    <div className={styles.overlay}>
                      <button
                        className={`${styles.btnLista} ${isNaLista(conteudo) ? styles.naLista : ''}`}
                        onClick={(e) => handleToggleLista(e, conteudo)}
                      >
                        {isNaLista(conteudo) ? <GoHeartFill /> : <GoHeart />}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.info}>
                    <h3>{conteudo.title || conteudo.name}</h3>
                    <div className={styles.meta}>
                      <span className={styles.tipo}>
                        {conteudo.media_type === 'tv' ? 'Série' : 'Filme'}
                      </span>
                      <span className={styles.ano}>
                        {new Date(conteudo.release_date || conteudo.first_air_date).getFullYear()}
                      </span>
                    </div>
                    <p className={styles.avaliacao}>
                      ⭐ {conteudo.vote_average?.toFixed(1)}/10
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!termoBusca && (
          <div className={styles.placeholder}>
            <GoSearch className={styles.iconePlaceholder} />
            <h2>Encontre seus filmes e séries favoritos</h2>
            <p>Digite o nome do filme ou série que você está procurando</p>
          </div>
        )}
      </div>
    </div>
  );
}


