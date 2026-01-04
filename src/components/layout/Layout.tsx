import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useProfile } from '@/lib/profile-context';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { supabaseError } = useProfile();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {supabaseError && (
          <div className="bg-destructive/10 px-8 py-3 border-b border-destructive/20">
            <Alert variant="destructive">
              <AlertTitle>Connexion à Supabase impossible</AlertTitle>
              <AlertDescription>
                {supabaseError} Les données affichées sont en lecture seule (aucune sauvegarde),
                ajoutez les variables d'environnement Supabase pour activer la synchronisation.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
