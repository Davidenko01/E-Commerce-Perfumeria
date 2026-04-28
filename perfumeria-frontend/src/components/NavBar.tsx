import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
//import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  //const { totalItems } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/products" 
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Colección
            </Link>
            <Link 
              to="/#about" 
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Sobre Nosotros
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-serif text-xl md:text-2xl tracking-[0.3em] font-medium">
              DAVOR
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/#contact" 
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Contacto
            </Link>
            <Link 
              to="/cart" 
              className="relative p-2 hover:opacity-70 transition-opacity" 
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {/* {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                  {totalItems}
                </span>
              )} */}
            </Link>
          </nav>

          {/* Mobile Cart */}
          <Link 
            to="/cart" 
            className="md:hidden relative p-2 -mr-2" 
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {/* {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                {totalItems}
              </span>
            )} */}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border">
          <nav className="flex flex-col px-6 py-8 gap-6">
            <Link 
              to="/products" 
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Colección
            </Link>
            <Link 
              to="/#about" 
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            <Link 
              to="/#contact" 
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
