
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMinhaLista } from '../context/MinhaListaContext';
import { GoHeartFill, GoTrash } from 'react-icons/go';
import { IoPlay } from 'react-icons/io5';
import styles from './MinhaLista.module.css';

export default function MinhaLista() {
  const { lista, removerFilme } = useMinhaLista();
  const navigate = useNavigate();

  const handleConteudoClick = (conteudo) => {
    const tipo = conteudo.media_type || (conteudo.first_air_date ? 'tv' : 'movie');
    navigate(`/detalhes/${tipo}/${conteudo.id}`);
  };

  const handleRemover = (e, id) => {
    e.stopPropagation();
    removerFilme(id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Minha Lista</h1>
        <p>{lista.length} {lista.length === 1 ? 'item' : 'itens'} na sua lista</p>
      </div>

      {lista.length > 0 ? (
        <div className={styles.grid}>
          {lista.map((conteudo) => (
            <div
              key={conteudo.id}
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
                  <button className={styles.btnPlay}>
                    <IoPlay />
                  </button>
                  <button
                    className={styles.btnRemover}
                    onClick={(e) => handleRemover(e, conteudo.id)}
                    title="Remover da lista"
                  >
                    <GoTrash />
                  </button>
                </div>
                <div className={styles.badge}>
                  <GoHeartFill />
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
      ) : (
        <div className={styles.listaVazia}>
          <GoHeartFill className={styles.iconeVazio} />
          <h2>Sua lista está vazia</h2>
          <p>Adicione filmes e séries à sua lista para vê-los aqui</p>
          <button 
            className={styles.btnExplorar}
            onClick={() => navigate('/home')}
          >
            Explorar Conteúdo
          </button>
        </div>
      )}
    </div>
  );
}