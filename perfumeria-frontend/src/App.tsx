import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavBar from './components/navbar';
import Home from './pages/Home';
/* import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import Login from './pages/Login'; */
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <AuthProvider>
          <CartProvider> */}
            <NavBar />
            <main className="min-h-screen bg-gray-50">
              {<Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/producto/:id" element={<ProductoDetalle />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/mis-pedidos" element={<MisPedidos />} />
                <Route path="/login" element={<Login />} /> */}
              </Routes> }
            </main>
          {/* </CartProvider>
        </AuthProvider> */}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;