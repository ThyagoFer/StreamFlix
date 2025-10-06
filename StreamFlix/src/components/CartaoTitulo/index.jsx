import styles from "./CartaoTitulo.module.css";

const IMAGE_BASE = "http://image.tmdb.org/t/p/";

function CartaoTitulo({ item }) {
  if (!item.poster_path) return null;

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
    </div>
  );
}

export default CartaoTitulo;