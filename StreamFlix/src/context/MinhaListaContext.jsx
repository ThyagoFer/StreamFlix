import { createContext, useState, useContext, useEffect } from 'react';
import {
  apiMinhaLista,
  apiAddToMinhaLista,
  apiRemoveFromMinhaLista
} from '../service/api';

export const MinhaListaContext = createContext();

export default function MinhaListaProvider({ children }) {
  const [lista, setLista] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      apiMinhaLista(token).then(data => {
        if (Array.isArray(data)) {
          setLista(data);
        }
      });
    }
  }, [token]);

  function adicionarFilme(conteudo) {
    if (!token) return;

    const payload = {
      tmdb_id: conteudo.id,
      title: conteudo.title || conteudo.name,
      poster_path: conteudo.poster_path,
      media_type: conteudo.media_type || (conteudo.first_air_date ? "tv" : "movie"),
      vote_average: conteudo.vote_average,
      release_date: conteudo.release_date || conteudo.first_air_date
    };

    apiAddToMinhaLista(token, conteudo.id).then(novoRegistro => {
          if (novoRegistro && !novoRegistro.detail) {
            setLista(prev => [...prev, novoRegistro]);
        }
      });
  }

  function removerFilme(tmdb_id) {
    if (!token) return;

    apiRemoveFromMinhaLista(token, tmdb_id).then(() => {
      setLista(prev => prev.filter(item => item.tmdb_id !== tmdb_id));
    });
  }

  return (
    <MinhaListaContext.Provider value={{ lista, adicionarFilme, removerFilme }}>
      {children}
    </MinhaListaContext.Provider>
  );
}

export function useMinhaLista() {
  return useContext(MinhaListaContext);
}