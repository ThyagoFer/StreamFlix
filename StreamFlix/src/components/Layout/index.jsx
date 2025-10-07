import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

// Fiz este componente que vai servir como o "molde" para todas as páginas agora
const Layout = () => {
  return (
    <>
      <Header />
      <main>
        
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;