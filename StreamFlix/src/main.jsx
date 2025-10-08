import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"; // <--- CORRIGIDO AQUI

import Layout from './components/Layout';
import Inicial from './pages/Inicial.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import MinhaLista from './pages/MinhaLista.jsx';
import MinhaListaProvider from './context/MinhaListaContext.jsx';
import './index.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Inicial />,
      },
      {
        path: "/minha-lista",
        element: <MinhaLista />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MinhaListaProvider>
      <RouterProvider router={router} />
    </MinhaListaProvider>
  </React.StrictMode>,
);