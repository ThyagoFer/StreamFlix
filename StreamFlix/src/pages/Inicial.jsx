import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Destaque from "../components/Destaque";
import LinhaDeTitulos from "../components/LinhaDeTitulos";
import { SlReload } from "react-icons/sl";

import styles from "../components/LinhaDeTitulos/LinhaDeTitulos.module.css";

const TMDB_API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxODVmYTVkNmY5M2UwODJlMWMzYjkyYTU5MzgyZTYxOCIsIm5iZiI6MTczNzUwNjA0MC43MTIsInN1YiI6IjY3OTAzY2Y4YmU5YTlhYTc4Mjc3NDA5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jkkt9V0WEXsWNVmQjx7QJeyYmvrBlKxyfPCYUjbAcfM";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
  },
};

const CATEGORIAS = [
  {
    slug: "originals",
    title: "Originais StreamFlix",
    path: `/discover/tv?with_network=213&language=pt-BR&include_adult=false`,
  },
  {
    slug: "trending",
    title: "Em Alta Agora",
    path: `/trending/all/week?language=pt-BR&include_adult=false`,
  },
  {
    slug: "toprated",
    title: "Os Mais Votados",
    path: `/movie/top_rated?language=pt-BR&include_adult=false`,
  },

  {
    slug: "action",
    title: "Ação e Aventura",
    path: `/discover/movie?with_genres=28&language=pt-BR&include_adult=false`,
  },
  {
    slug: "comedy",
    title: "Comédia",
    path: `/discover/movie?with_genres=35&language=pt-BR&include_adult=false`,
  },
  {
    slug: "horror",
    title: "Terror",
    path: `/discover/movie?with_genres=27&language=pt-BR&include_adult=false`,
  },
  {
    slug: "documentary",
    title: "Documentário",
    path: `/discover/movie?with_genres=99&language=pt-BR&include_adult=false`,
  },
  {
    slug: "scifi",
    title: "Ficção Científica",
    path: `/discover/movie?with_genres=878&language=pt-BR&include_adult=false`,
  },
  {
    slug: "fantasy",
    title: "Fantasia",
    path: `/discover/movie?with_genres=14&language=pt-BR&include_adult=false`,
  },
];

function Inicial() {
  const [listasDeTitulos, setListasDeTitulos] = useState([]);
  const [tituloDestaque, setTituloDestaque] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarTudo() {
      let novasListas = [];

      for (const categoria of CATEGORIAS) {
        const url = `${TMDB_BASE_URL}${categoria.path}`;

        try {
          const response = await fetch(url, API_OPTIONS);
          const data = await response.json();

          novasListas.push({
            slug: categoria.slug,
            title: categoria.title,
            items: data.results,
          });
        } catch (error) {
          console.error(`Falha na API ao buscar ${categoria.title}:`, error);
        }
      }

      setListasDeTitulos(novasListas);

      let originais = novasListas.find((list) => list.slug === "originals");
      if (originais && originais.items && originais.items.length > 0) {
        let itemAleatorio =
          originais.items[Math.floor(Math.random() * originais.items.length)];
        setTituloDestaque(itemAleatorio);
      }

      setIsLoading(false);
    }
    carregarTudo();
  }, []);

  if (isLoading || !tituloDestaque) {
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "20vh",
          fontSize: "24px",
          color: "white",
        }}
      >
        Carregando a StreamFlix... <SlReload />
      </div>
    );
  }

  return (
    <div className="streamflix-app">
      <Header />

      <Destaque item={tituloDestaque} />

      <main className={styles.listas}>
        {listasDeTitulos.map((lista) => (
          <LinhaDeTitulos
            key={lista.slug}
            titulo={lista.title}
            itens={lista.items}
          />
        ))}
        <div style={{ marginBottom: 40 }} />
      </main>

      <Footer />
    </div>
  );
}

export default Inicial;
