import { Button } from "@/components/ui/button";
import { Building2, Menu, User, Heart, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export const Header = ({ isLoggedIn }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Use auth state if isLoggedIn prop is not provided
  const userLoggedIn = isLoggedIn !== undefined ? isLoggedIn : !!user;

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-primary to-primary-glow p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ResaleFlats.in</h1>
              <p className="text-xs text-muted-foreground">Find Your Perfect Home</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="/properties" className="text-muted-foreground hover:text-primary transition-colors">
              Properties
            </a>
            <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {userLoggedIn ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate('/saved-properties')} title="Saved Properties">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/price-alerts')} title="Price Alerts">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut} title="Sign Out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="trust" onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col space-y-3">
              <a 
                href="/" 
                className="text-foreground hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/properties" 
                className="text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </a>
              {userLoggedIn && (
                <>
                  <a 
                    href="/saved-properties" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Saved Properties
                  </a>
                  <a 
                    href="/price-alerts" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Price Alerts
                  </a>
                </>
              )}
              <a 
                href="/about" 
                className="text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="/contact" 
                className="text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex flex-col gap-2 pt-2">
                {userLoggedIn ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="trust" 
                      size="sm" 
                      onClick={() => {
                        navigate('/signup');
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};