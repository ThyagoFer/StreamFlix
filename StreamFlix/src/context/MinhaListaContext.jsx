import { createContext, useState, useContext, useEffect } from 'react';
import { apiMinhaLista, apiAddToMinhaLista, apiRemoveFromMinhaLista } from '../service/api';

export const MinhaListaContext = createContext();

export default function MinhaListaProvider({ children }) {
  const [lista, setLista] = useState([]);

  const carregarLista = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLista([]);
      return;
    }
    try {
      const data = await apiMinhaLista(token);
      if (data.detail || !Array.isArray(data)) {
        setLista([]);
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
      } else {
        setLista(data);
      }
    } catch {
      setLista([]);
    }
  };

  useEffect(() => {
    carregarLista();
    const interval = setInterval(carregarLista, 2000);
    return () => clearInterval(interval);
  }, []);

  const adicionarFilme = async (conteudo) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await apiAddToMinhaLista(token, conteudo.id);
      carregarLista();
    } catch (err) {
      console.error(err);
    }
  };

  const removerFilme = async (tmdb_id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await apiRemoveFromMinhaLista(token, tmdb_id);
    carregarLista();
  };

  return (
    <MinhaListaContext.Provider value={{ lista, adicionarFilme, removerFilme }}>
      {children}
    </MinhaListaContext.Provider>
  );
}

export const useMinhaLista = () => useContext(MinhaListaContext);