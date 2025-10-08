

import React from 'react';
import { useMinhaLista } from '../context/MinhaListaContext';


export default function MinhaLista() {
  const { lista, removerFilme } = useMinhaLista();

  return (
    
    <div className="container" style={{ minHeight: '80vh', paddingTop: '4rem' }}>
      <h1>Minha Lista</h1>
      {lista.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
          {lista.map((filme) => (
            <div key={filme.id} style={{ border: '1px solid #222', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
              <img
                src={`https://image.tmdb.org/t/p/w200/${filme.poster_path}`}
                alt={filme.title}
                style={{ maxWidth: '150px', borderRadius: '4px' }}
              />
              <h4 style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{filme.title || filme.name}</h4>
              <button 
                onClick={() => removerFilme(filme.id)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '0.5rem',
                  backgroundColor: '#e50914',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: '2rem' }}>Sua lista está vazia.</p>
      )}
    </div>
  );
}