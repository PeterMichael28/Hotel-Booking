import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';

interface Props {
 children?: React.ReactNode;
 withOutlet?: boolean;
}

const Layout = ({ withOutlet = true, children }: Props) => {
 return (
  <div className="flex flex-col min-h-screen">
   <Header />
   <Hero />
   <div className="container mx-auto py-10 flex-1">
    {withOutlet ? <Outlet /> : children}
   </div>
   <Footer />
  </div>
 );
};

export default Layout;
