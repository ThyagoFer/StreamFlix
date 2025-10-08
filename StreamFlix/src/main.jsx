// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layout from './components/Layout'; // <- 1. ESSE IMPORTA O LAYOUT
import Inicial from './pages/Inicial.jsx';
import MinhaLista from './pages/MinhaLista.jsx';
import './index.css';

import MinhaListaProvider from './context/MinhaListaContext.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // <- 2. EU COLOQUEI A ROTA PRINCIPAL AGORA PARA USAR O LAYOUT
    // As outras páginas viram as (children) do Layout
    children: [
      {
        path: "/",
        element: <Inicial />,
      },
      {
        path: "/minha-lista",
        element: <MinhaLista />,
      },
      // Aqui é para adicionar outras páginas no futuro por ex: /filmes, /series)
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MinhaListaProvider>
      <RouterProvider router={router} />
    </MinhaListaProvider>
  </React.StrictMode>,
);