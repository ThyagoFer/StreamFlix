const TMDB_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxODVmYTVkNmY5M2UwODJlMWMzYjkyYTU5MzgyZTYxOCIsIm5iZiI6MTczNzUwNjA0MC43MTIsInN1YiI6IjY3OTAzY2Y4YmU5YTlhYTc4Mjc3NDA5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jkkt9V0WEXsWNVmQjx7QJeyYmvrBlKxyfPCYUjbAcfM";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
  },
};

export const CATEGORIAS = [
  { slug: "originals", title: "Originais StreamFlix", path: `/discover/tv?with_network=213&language=pt-BR&include_adult=false` },
  { slug: "trending", title: "Em Alta Agora", path: `/trending/all/week?language=pt-BR&include_adult=false` },
  { slug: "toprated", title: "Os Mais Votados", path: `/movie/top_rated?language=pt-BR&include_adult=false` },
  { slug: "action", title: "Ação e Aventura", path: `/discover/movie?with_genres=28&language=pt-BR&include_adult=false` },
  { slug: "comedy", title: "Comédia", path: `/discover/movie?with_genres=35&language=pt-BR&include_adult=false` },
  { slug: "horror", title: "Terror", path: `/discover/movie?with_genres=27&language=pt-BR&include_adult=false` },
  { slug: "documentary", title: "Documentário", path: `/discover/movie?with_genres=99&language=pt-BR&include_adult=false` },
  { slug: "scifi", title: "Ficção Científica", path: `/discover/movie?with_genres=878&language=pt-BR&include_adult=false` },
  { slug: "fantasy", title: "Fantasia", path: `/discover/movie?with_genres=14&language=pt-BR&include_adult=false` },
];

export async function fetchCategoria(categoria) {
  const url = `${TMDB_BASE_URL}${categoria.path}`;
  const res = await fetch(url, API_OPTIONS);
  return res.json();
}

export async function fetchTodasCategorias() {
  const listas = [];
  for (const categoria of CATEGORIAS) {
    try {
      const data = await fetchCategoria(categoria);
      listas.push({
        slug: categoria.slug,
        title: categoria.title,
        items: data.results,
      });
    } catch (err) {
      console.error(`Erro ao buscar ${categoria.title}:`, err);
    }
  }
  return listas;
}