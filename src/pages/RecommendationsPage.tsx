import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { RecommendationSearch } from '@/components/recommendations/RecommendationSearch';
import { RecommendationResults } from '@/components/recommendations/RecommendationResults';
import { AnalysisResult } from '@/lib/types';
import { Sparkles, TrendingUp, Library } from 'lucide-react';

export default function RecommendationsPage() {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            <span className="gold-text">Recommandations</span>
          </h1>
          <p className="text-muted-foreground">
            Analysez une œuvre et découvrez des suggestions personnalisées
          </p>
        </div>

        {/* Search */}
        <RecommendationSearch 
          onResults={setResults}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* Loading state */}
        {isLoading && (
          <div className="vault-card p-12 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-gold">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">Analyse en cours...</h3>
            <p className="text-sm text-muted-foreground">
              Recherche des notes et génération des recommandations
            </p>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && (
          <RecommendationResults results={results} />
        )}

        {/* Empty state */}
        {!results && !isLoading && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="vault-card p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-display font-semibold">Notes en temps réel</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Récupération automatique des notes SensCritique et Metacritic (user score) 
                pour chaque recommandation.
              </p>
            </div>

            <div className="vault-card p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Library className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-display font-semibold">Basé sur vos goûts</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Les recommandations tiennent compte de votre profil, vos préférences 
                et vos listes pour éviter les doublons.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
