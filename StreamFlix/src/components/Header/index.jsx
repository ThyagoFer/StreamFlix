import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import { GoHeart, GoBell, GoSearch } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { HiMenu } from "react-icons/hi";
import { useMinhaLista } from "../../context/MinhaListaContext";
import logo from "../../assets/logo.png"; 
import styles from "./Header.module.css";

const Header = () => {
    const [mostrarFundo, setMostrarFundo] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState(false);
    const [perfilAberto, setPerfilAberto] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();
    const { lista } = useMinhaLista();

    useEffect(() => {
        // Verificar se usuário está logado
        const currentUser = localStorage.getItem('currentUser');
        setUsuarioLogado(!!currentUser);
        if (currentUser) {
            setUsuario(JSON.parse(currentUser));
        }

        const handleScroll = () => {
            if (window.scrollY > 100) {
                setMostrarFundo(true);
            } else {
                setMostrarFundo(false);
            }
        };

        const handleClickOutside = (event) => {
            if (menuAberto && !event.target.closest(`.${styles.header}`)) {
                setMenuAberto(false);
            }
            if (perfilAberto && !event.target.closest(`.${styles.perfilContainer}`)) {
                setPerfilAberto(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("click", handleClickOutside);
        };
    }, [menuAberto, perfilAberto]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setUsuarioLogado(false);
        setUsuario(null);
        setPerfilAberto(false);
        navigate('/');
    };

    return (
        <header
            className={`${styles.header} ${
                mostrarFundo ? styles["header-fundo"] : ""
            }`}
        >
            <div className={styles["header-esquerda"]}>
                <Link to={usuarioLogado ? "/home" : "/"}>
                    <img
                        className={styles["header-logo"]}
                        src={logo}
                        alt="StreamFlix logo"
                    />
                </Link>
                <nav className={`${styles["header-nav"]} ${menuAberto ? styles["nav-aberto"] : ""}`}>
                    <Link to="/home" className={styles.ativo} onClick={() => setMenuAberto(false)}>Início</Link>
                    <Link to="/filmes" onClick={() => setMenuAberto(false)}>Filmes</Link>
                    <Link to="/series" onClick={() => setMenuAberto(false)}>Séries</Link>
                    <Link to="/minha-lista" onClick={() => setMenuAberto(false)}>Minha Lista</Link>
                </nav>
            </div>
            <div className={styles["header-direita"]}>
                <button
                    className={styles["menu-hamburguer"]}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuAberto(!menuAberto);
                    }}
                    aria-label="Toggle menu"
                    type="button"
                >
                    {menuAberto ? <HiMenu /> : <HiMenu />}
                </button>
                <span 
                    className={styles["header-icone"]}
                    onClick={() => navigate('/busca')}
                    title="Buscar"
                >
                    <GoSearch />
                </span>
                <Link 
                    to="/minha-lista" 
                    className={styles["header-icone"]}
                    title="Minha Lista"
                >
                    <GoHeart />
                    {lista.length > 0 && (
                        <span className={styles.contador}>{lista.length}</span>
                    )}
                </Link>
                <span className={styles["header-icone"]}>
                    <GoBell />
                </span>
                <div className={styles.perfilContainer}>
                    <span 
                        className={styles["header-icone"]}
                        onClick={() => setPerfilAberto(!perfilAberto)}
                        title="Perfil"
                    >
                        <CgProfile />
                    </span>
                    
                    {perfilAberto && usuario && (
                        <div className={styles.perfilDropdown}>
                            <div className={styles.perfilInfo}>
                                <div className={styles.perfilAvatar}>
                                    {usuario.name ? usuario.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className={styles.perfilDetalhes}>
                                    <h4>{usuario.name || 'Usuário'}</h4>
                                    <p>{usuario.email}</p>
                                </div>
                            </div>
                            <div className={styles.perfilAcoes}>
                                <button 
                                    className={styles.btnLogout}
                                    onClick={handleLogout}
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;