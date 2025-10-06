import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Destaque from "../components/Destaque";
import LinhaDeTitulos from "../components/LinhaDeTitulos";
import { SlReload } from "react-icons/sl";

import styles from "../components/LinhaDeTitulos/LinhaDeTitulos.module.css";

import { fetchTodasCategorias } from "../service/tmdb";

function Inicial() {
  const [listasDeTitulos, setListasDeTitulos] = useState([]);
  const [tituloDestaque, setTituloDestaque] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarTudo() {
      const novasListas = await fetchTodasCategorias();
      setListasDeTitulos(novasListas);

      const originais = novasListas.find((l) => l.slug === "originals");
      if (originais && originais.items.length > 0) {
        const itemAleatorio =
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