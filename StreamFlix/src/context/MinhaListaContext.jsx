import { createContext, useState, useContext } from 'react';

export const MinhaListaContext = createContext();

export default function MinhaListaProvider({ children }) {
  const [lista, setLista] = useState([]);

  function adicionarFilme(novoFilme) {
    
    const filmeRepetido = lista.find(filme => filme.id === novoFilme.id);
    if (!filmeRepetido) {
      setLista([...lista, novoFilme]);
      console.log("Filme adicionado:", novoFilme.title); 
    } else {
      console.log("Filme já está na lista:", novoFilme.title); 
    }
  }

  function removerFilme(id) {
    const novaLista = lista.filter(filme => filme.id !== id);
    setLista(novaLista);
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