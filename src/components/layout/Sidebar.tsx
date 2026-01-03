import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  List, 
  User, 
  HelpCircle, 
  Vault 
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Recommandations', icon: Sparkles },
  { path: '/lists', label: 'Mes listes', icon: List },
  { path: '/profile', label: 'Mon profil', icon: User },
  { path: '/help', label: 'Aide', icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Vault className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold gold-text">RecoVault</h1>
            <p className="text-xs text-muted-foreground">Vos trésors culturels</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-accent group',
                    isActive && 'bg-sidebar-accent border border-primary/20'
                  )}
                >
                  <item.icon 
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                    )} 
                  />
                  <span 
                    className={cn(
                      'font-medium transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-gold" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 m-3 rounded-lg bg-vault-surface border border-border">
        <p className="text-xs text-muted-foreground mb-2">Mode local</p>
        <p className="text-xs text-foreground/80">
          Vos données sont sauvegardées localement.
        </p>
      </div>
    </aside>
  );
}
