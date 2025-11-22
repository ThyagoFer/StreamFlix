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
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const { lista } = useMinhaLista();

  const atualizarEstadoLogin = () => {
    try {
      const token = localStorage.getItem("token");
      const dadosUsuario = localStorage.getItem("currentUser");
      if (token && dadosUsuario) {
        setUsuario(JSON.parse(dadosUsuario));
      } else {
        setUsuario(null);
      }
    } catch {
      setUsuario(null);
    }
  };

  useEffect(() => {
    atualizarEstadoLogin();

    const handleScroll = () => setMostrarFundo(window.scrollY > 100);

    const handleClickOutside = (e) => {
      if (menuAberto && !e.target.closest(`.${styles.header}`)) setMenuAberto(false);
      if (perfilAberto && !e.target.closest(`.${styles.perfilContainer}`)) setPerfilAberto(false);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("storage", atualizarEstadoLogin);

    const interval = setInterval(atualizarEstadoLogin, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("storage", atualizarEstadoLogin);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setUsuario(null);
    setPerfilAberto(false);
    navigate("/", { replace: true });
  };

  const usuarioLogado = !!usuario;

  return (
    <header className={`${styles.header} ${mostrarFundo ? styles["header-fundo"] : ""}`}>
      <div className={styles["header-esquerda"]}>
        <Link to={usuarioLogado ? "/home" : "/"}>
          <img className={styles["header-logo"]} src={logo} alt="StreamFlix logo" />
        </Link>

        {usuarioLogado && (
          <nav className={`${styles["header-nav"]} ${menuAberto ? styles["nav-aberto"] : ""}`}>
            <Link to="/home" className={styles.ativo} onClick={() => setMenuAberto(false)}>Início</Link>
            <Link to="/filmes" onClick={() => setMenuAberto(false)}>Filmes</Link>
            <Link to="/series" onClick={() => setMenuAberto(false)}>Séries</Link>
            <Link to="/minha-lista" onClick={() => setMenuAberto(false)}>Minha Lista</Link>
          </nav>
        )}
      </div>

      <div className={styles["header-direita"]}>
        <button
          className={styles["menu-hamburguer"]}
          onClick={(e) => { e.stopPropagation(); setMenuAberto(prev => !prev); }}
          type="button"
        >
          <HiMenu />
        </button>

        {usuarioLogado ? (
          <>
            <span className={styles["header-icone"]} onClick={() => navigate("/busca")}>
              <GoSearch />
            </span>

            <Link to="/minha-lista" className={styles["header-icone"]}>
              <GoHeart />
              {lista.length > 0 && <span className={styles.contador}>{lista.length}</span>}
            </Link>

            <span className={styles["header-icone"]}>
              <GoBell />
            </span>

            <div className={styles.perfilContainer}>
              <span
                className={styles["header-icone"]}
                onClick={() => setPerfilAberto(prev => !prev)}
              >
                <CgProfile />
              </span>

              {perfilAberto && usuario && (
                <div className={styles.perfilDropdown}>
                  <div className={styles.perfilInfo}>
                    <div className={styles.perfilAvatar}>
                      {usuario.name?.[0]?.toUpperCase() || usuario.email[0].toUpperCase() || "U"}
                    </div>
                    <div className={styles.perfilDetalhes}>
                      <h4>{usuario.name || "Usuário"}</h4>
                      <p>{usuario.email}</p>
                    </div>
                  </div>
                  <div className={styles.perfilAcoes}>
                    <button className={styles.btnLogout} onClick={handleLogout}>
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/" className={styles.btnEntrar}>Entrar</Link>
        )}
      </div>
    </header>
  );
};

export default Header;