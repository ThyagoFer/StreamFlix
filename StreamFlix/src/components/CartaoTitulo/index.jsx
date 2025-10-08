import styles from "./CartaoTitulo.module.css";
import { useMinhaLista } from '../../context/MinhaListaContext'; 
import { IoMdAddCircleOutline } from "react-icons/io";           

const IMAGE_BASE = "https://image.tmdb.org/t/p/";

function CartaoTitulo({ item }) {
    if (!item.poster_path) return null;

    // -para adicionar na lista -
    const { adicionarFilme } = useMinhaLista(); 

    const handleAdicionar = (e) => { 
        e.stopPropagation(); 
        adicionarFilme(item);
        alert(`'${item.title || item.name}' adicionado à lista.`);
    }
    // - Fim  -

    const posterUrl = `${IMAGE_BASE}w300${item.poster_path}`;
    const titulo = item.title || item.name;

    return (
        <div className={styles["cartao-titulo"]}>
            <img
                src={posterUrl}
                alt={titulo}
                loading="lazy"
                onError={(e) => {
                    e.target.style.display = "none";
                }}
            />
            
            <button onClick={handleAdicionar} className={styles.botaoAdicionar}>
                <IoMdAddCircleOutline size={30} />
            </button>
        </div>
    );
}

export default CartaoTitulo;