import { useNavigate } from 'react-router-dom';
import styles from "./CartaoTitulo.module.css";
import { useMinhaLista } from '../../context/MinhaListaContext'; 
import { IoMdAddCircleOutline } from "react-icons/io";           

const IMAGE_BASE = "https://image.tmdb.org/t/p/";

function CartaoTitulo({ item }) {
    if (!item.poster_path) return null;

    const navigate = useNavigate();
    const { adicionarFilme, lista } = useMinhaLista(); 

    const handleAdicionar = (e) => { 
        e.stopPropagation(); 
        adicionarFilme(item);
    }

    const handleClick = () => {
        const tipo = item.media_type || (item.first_air_date ? 'tv' : 'movie');
        navigate(`/detalhes/${tipo}/${item.id}`);
    };

    const isNaLista = lista.some(listaItem => listaItem.id === item.id);

    const posterUrl = `${IMAGE_BASE}w300${item.poster_path}`;
    const titulo = item.title || item.name;

    return (
        <div className={styles["cartao-titulo"]} onClick={handleClick}>
            <img
                src={posterUrl}
                alt={titulo}
                loading="lazy"
                onError={(e) => {
                    e.target.style.display = "none";
                }}
            />
            
            <button 
                onClick={handleAdicionar} 
                className={`${styles.botaoAdicionar} ${isNaLista ? styles.naLista : ''}`}
                title={isNaLista ? 'Remover da lista' : 'Adicionar à lista'}
            >
                <IoMdAddCircleOutline size={30} />
            </button>
        </div>
    );
}

export default CartaoTitulo;