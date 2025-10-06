import styles from "./Footer.module.css";
import { IoIosLink } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles["footer-social"]}>
        <a href="#" className={styles["footer-icone"]}>
          <IoIosLink />
        </a>
        <a href="#" className={styles["footer-icone"]}>
          <FaInstagram />
        </a>
      </div>

      <div className={styles["footer-links"]}>
        <ul className={styles["footer-coluna"]}>
          <li>
            <a href="#">Privacidade</a>
          </li>
          <li>
            <a href="#">Entre em Contato</a>
          </li>
        </ul>

        <ul className={styles["footer-coluna"]}>
          <li>
            <a href="#">Centro de Ajuda</a>
          </li>
          <li>
            <a href="#">Preferências de Cookies</a>
          </li>
        </ul>

        <ul className={styles["footer-coluna"]}>
          <li>
            <a href="#">Termos de Uso</a>
          </li>
          <li>
            <a href="#">Informações Corporativas</a>
          </li>
        </ul>
      </div>

      <button className={styles["footer-codigo-servico"]}>
        Código de Serviço
      </button>

      <p className={styles["footer-copy"]}>
        © 2025-{currentYear} StreamFlix, Inc.
      </p>
    </footer>
  );
};

export default Footer;


