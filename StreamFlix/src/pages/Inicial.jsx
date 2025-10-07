

import { useState, useEffect } from "react";
// Eu REMOVI o Header e Footer dos imports
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

            const originals = novasListas.find((L) => L.slug === "originals");
            if (originals && originals.items.length > 0) {
                const itemAleatorio =
                    originals.items[Math.floor(Math.random() * originals.items.length)];
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
                    height: "100vh"
                }}
            >
                Carregando a StreamFlix... <SlReload />
            </div>
        );
    }

    
    return (
        <>
            

            <Destaque item={tituloDestaque} />

            
            <div className="container">
                <main className={styles.listas}>
                    {listasDeTitulos.map((lista) => (
                        <LinhaDeTitulos
                            key={lista.slug}
                            titulo={lista.title}
                            items={lista.items}
                        />
                    ))}
                    
                </main>
            </div>

            
        </>
    );
}

export default Inicial;