import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMinhaLista } from '../context/MinhaListaContext';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { IoArrowBack } from 'react-icons/io5';
import styles from './Detalhes.module.css';

const TMDB_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxODVmYTVkNmY5M2UwODJlMWMzYjkyYTU5MzgyZTYxOCIsIm5iZiI6MTczNzUwNjA0MC43MTIsInN1YiI6IjY3OTAzY2Y4YmU5YTlhYTc4Mjc3NDA5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jkkt9V0WEXsWNVmQjx7QJeyYmvrBlKxyfPCYUjbAcfM";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
  },
};

export default function Detalhes() {
  const { id, tipo } = useParams();
  const navigate = useNavigate();
  const { lista, adicionarFilme, removerFilme } = useMinhaLista();
  const [detalhes, setDetalhes] = useState(null);
  const [elenco, setElenco] = useState([]);
  const [conteudosRelacionados, setConteudosRelacionados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isNaLista = lista.some(item => item.id === parseInt(id));

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        setIsLoading(true);
        
        // Buscar detalhes do filme/série
        const detalhesUrl = `${TMDB_BASE_URL}/${tipo}/${id}?language=pt-BR`;
        const detalhesResponse = await fetch(detalhesUrl, API_OPTIONS);
        const detalhesData = await detalhesResponse.json();
        
        // Buscar elenco
        const elencoUrl = `${TMDB_BASE_URL}/${tipo}/${id}/credits?language=pt-BR`;
        const elencoResponse = await fetch(elencoUrl, API_OPTIONS);
        const elencoData = await elencoResponse.json();
        
        // Buscar conteúdos relacionados
        const relacionadosUrl = `${TMDB_BASE_URL}/${tipo}/${id}/similar?language=pt-BR&page=1`;
        const relacionadosResponse = await fetch(relacionadosUrl, API_OPTIONS);
        const relacionadosData = await relacionadosResponse.json();
        
        setDetalhes(detalhesData);
        setElenco(elencoData.cast.slice(0, 10)); // Primeiros 10 atores
        setConteudosRelacionados(relacionadosData.results.slice(0, 6)); // Primeiros 6 relacionados
        
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDetalhes();
  }, [id, tipo]);

  const handleToggleLista = () => {
    if (isNaLista) {
      removerFilme(parseInt(id));
    } else {
      adicionarFilme(detalhes);
    }
  };

  const handleConteudoClick = (conteudo) => {
    const tipoConteudo = conteudo.media_type || (conteudo.first_air_date ? 'tv' : 'movie');
    navigate(`/detalhes/${tipoConteudo}/${conteudo.id}`);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (!detalhes) {
    return (
      <div className={styles.error}>
        <h2>Conteúdo não encontrado</h2>
        <button onClick={() => navigate('/home')} className={styles.btnVoltar}>
          Voltar ao início
        </button>
      </div>
    );
  }

  const titulo = detalhes.title || detalhes.name;
  const dataLancamento = detalhes.release_date || detalhes.first_air_date;
  const ano = dataLancamento ? new Date(dataLancamento).getFullYear() : 'N/A';

  return (
    <div className={styles.container}>
      {/* Botão voltar */}
      <button onClick={() => navigate(-1)} className={styles.btnVoltar}>
        <IoArrowBack /> Voltar
      </button>

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.posterContainer}>
            <img
              src={`https://image.tmdb.org/t/p/w500${detalhes.poster_path}`}
              alt={titulo}
              className={styles.poster}
            />
          </div>
          
          <div className={styles.info}>
            <h1 className={styles.titulo}>{titulo}</h1>
            
            <div className={styles.metaInfo}>
              <span className={styles.ano}>{ano}</span>
              {detalhes.runtime && (
                <span className={styles.duracao}>
                  {Math.floor(detalhes.runtime / 60)}h {detalhes.runtime % 60}min
                </span>
              )}
              <span className={styles.avaliacao}>
                ⭐ {detalhes.vote_average?.toFixed(1)}/10
              </span>
            </div>

            <div className={styles.generos}>
              {detalhes.genres?.map(genero => (
                <span key={genero.id} className={styles.genero}>
                  {genero.name}
                </span>
              ))}
            </div>

            <p className={styles.sinopse}>{detalhes.overview}</p>

            <div className={styles.acoes}>
              <button 
                onClick={handleToggleLista}
                className={`${styles.btnLista} ${isNaLista ? styles.naLista : ''}`}
              >
                {isNaLista ? <GoHeartFill /> : <GoHeart />}
                {isNaLista ? 'Remover da Lista' : 'Adicionar à Lista'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Elenco */}
      {elenco.length > 0 && (
        <section className={styles.secao}>
          <h2>Elenco Principal</h2>
          <div className={styles.elenco}>
            {elenco.map(ator => (
              <div key={ator.id} className={styles.ator}>
                <img
                  src={ator.profile_path 
                    ? `https://image.tmdb.org/t/p/w200${ator.profile_path}`
                    : '/placeholder-actor.jpg'
                  }
                  alt={ator.name}
                  className={styles.fotoAtor}
                />
                <h4>{ator.name}</h4>
                <p>{ator.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Conteúdos Relacionados */}
      {conteudosRelacionados.length > 0 && (
        <section className={styles.secao}>
          <h2>Conteúdos Relacionados</h2>
          <div className={styles.relacionados}>
            {conteudosRelacionados.map(conteudo => (
              <div 
                key={conteudo.id} 
                className={styles.cardRelacionado}
                onClick={() => handleConteudoClick(conteudo)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${conteudo.poster_path}`}
                  alt={conteudo.title || conteudo.name}
                  className={styles.posterRelacionado}
                />
                <h4>{conteudo.title || conteudo.name}</h4>
                <p className={styles.anoRelacionado}>
                  {new Date(conteudo.release_date || conteudo.first_air_date).getFullYear()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


