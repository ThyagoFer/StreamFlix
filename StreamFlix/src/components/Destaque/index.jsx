import { useNavigate } from 'react-router-dom';
import styles from "./Destaque.module.css";
import { FaPlay } from "react-icons/fa";
import { MdFilterListAlt } from "react-icons/md";
import { useMinhaLista } from "../../context/MinhaListaContext";

const IMAGE_BASE = "https://image.tmdb.org/t/p/";

const Destaque = ({ item }) => {
    const navigate = useNavigate();
    const { adicionarFilme, lista } = useMinhaLista();

    if (!item) return null;

    const titulo = item.title || item.name;

    const backgroundStyle = {
        backgroundImage: `url(${IMAGE_BASE}/original${item.backdrop_path})`,
        backgroundColor: "#141414",
    };

    const sinopseCompleta = item.overview || "Sinopse indisponível.";
    let sinopseCurta = sinopseCompleta;
    if (sinopseCompleta.length > 250) {
        sinopseCurta = sinopseCompleta.substring(0, 250) + "...";
    }

    const anoLancamento = item.first_air_date
        ? item.first_air_date.substring(0, 4)
        : item.release_date?.substring(0, 4);

    const isNaLista = lista.some(listaItem => listaItem.id === item.id);
    
    const handleAdicionarNaLista = () => {
        adicionarFilme(item); 
    }

    const handleAssistir = () => {
        const tipo = item.media_type || (item.first_air_date ? 'tv' : 'movie');
        navigate(`/detalhes/${tipo}/${item.id}`);
    }

    return (
        <header className={styles.destaque} style={backgroundStyle}>
            <div className={styles["destaque-vertical"]}>
                <div className={styles["destaque-horizontal"]}>
                    <div className={styles["destaque-conteudo"]}>
                        <h1>{titulo}</h1>
                        <div className={styles["destaque-info"]}>
                            {item.vote_average > 0 && (
                                <span className={styles["destaque-pontuacao"]}>
                                    {item.vote_average.toFixed(1)} Pontos
                                </span>
                            )}
                            <span className={styles["destaque-ano"]}>{anoLancamento}</span>
                        </div>
                        <p className={styles["destaque-descricao"]}>{sinopseCurta}</p>
                        <div className={styles["destaque-botoes"]}>
                            <button
                                onClick={handleAssistir}
                                className={`${styles["destaque-botao"]} ${styles["destaque-assistir"]}`}
                            >
                                <FaPlay /> Assistir
                            </button>
                            
                            <button
                                onClick={handleAdicionarNaLista}
                                className={`${styles["destaque-botao"]} ${styles["destaque-lista"]} ${isNaLista ? styles.naLista : ''}`}
                            >
                                <MdFilterListAlt /> {isNaLista ? 'Na Lista' : 'Minha Lista'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Destaque;