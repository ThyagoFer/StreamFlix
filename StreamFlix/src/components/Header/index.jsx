import { useState, useEffect } from "react";
import { GoHeart, GoBell, GoSearch  } from "react-icons/go";
import { CgProfile, } from "react-icons/cg";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../assets/logo.png";
import styles from "./Header.module.css";

const Header = () => {
  const [mostrarFundo, setMostrarFundo] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
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
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuAberto]);

  return (
    <header
      className={`${styles.header} ${
        mostrarFundo ? styles["header-fundo"] : ""
      }`}
    >
      <div className={styles["header-esquerda"]}>
        <a href="/">
          <img
            className={styles["header-logo"]}
            src={logo}
            alt="StreamFlix logo"
          />
        </a>
        <nav className={`${styles["header-nav"]} ${menuAberto ? styles["nav-aberto"] : ""}`}>
          <a href="/" className={styles.ativo} onClick={() => setMenuAberto(false)}>
            Início
          </a>
          <a href="/filmes" onClick={() => setMenuAberto(false)}>Filmes</a>
          <a href="/series" onClick={() => setMenuAberto(false)}>Séries</a>
          <a href="/lista" onClick={() => setMenuAberto(false)}>Minha Lista</a>
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
          {menuAberto ? <HiX /> : <HiMenu />}
        </button>
        <span className={styles["header-icone"]}>
          <GoHeart />
        </span>
        <span className={styles["header-icone"]}>
          <GoBell />
        </span>
        <span className={styles["header-icone"]}>
          <GoSearch />
        </span>
        <span className={styles["header-icone"]}>
          <CgProfile />
        </span>
      </div>
    </header>
  );
};

export default Header;