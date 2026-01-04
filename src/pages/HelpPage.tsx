import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Sparkles, Search, AlertTriangle, Link2, Database, Info } from 'lucide-react';

export default function HelpPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">
            <span className="gold-text">Aide</span>
          </h1>
          <p className="text-muted-foreground">
            Comment utiliser RecoVault
          </p>
        </div>

        {/* How it works */}
        <Card className="vault-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Comment ça marche ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              RecoVault est un assistant de recommandation personnel. Il analyse vos goûts 
              et vous suggère des films, séries, jeux, livres et musiques susceptibles de vous plaire.
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong className="text-foreground">Configurez votre profil</strong> avec vos préférences générales, réalisateurs et acteurs favoris, etc.</li>
              <li><strong className="text-foreground">Remplissez vos listes</strong> : œuvres aimées, moyennement aimées, pas aimées et à voir.</li>
              <li><strong className="text-foreground">Demandez une analyse</strong> : entrez le titre d'une œuvre que vous aimez.</li>
              <li><strong className="text-foreground">Recevez 5 recommandations</strong> personnalisées avec notes et justifications.</li>
            </ol>
          </CardContent>
        </Card>

        {/* Prefill guide */}
        <Card className="vault-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Données pré-remplies
            </CardTitle>
            <CardDescription>Ce qui est ajouté automatiquement dans un nouveau profil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Lors de la création d'un profil anonyme, RecoVault pré-remplit vos préférences (goûts généraux,
              réalisateurs, acteurs, genres musicaux, préférences jeux/livres) ainsi que des listes de films,
              séries, jeux, livres et musiques déjà aimés, mitigés, pas aimés ou à découvrir.
            </p>
            <p>
              Vous pouvez personnaliser ces données à tout moment :
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Mettez à jour vos préférences dans l'onglet <strong>Mon profil</strong> (textes et listes de noms).
              </li>
              <li>
                Gérez les œuvres préchargées depuis la section <strong>Mes listes</strong> (ajout, modification, suppression).
              </li>
            </ul>
            <p>
              Si un profil existe déjà dans votre navigateur, aucun préchargement supplémentaire n'est effectué. Les
              administrateurs peuvent aussi désactiver le remplissage automatique en définissant la variable
              d'environnement <code>VITE_PREFILL_ANONYMOUS_PROFILE=false</code> avant le démarrage.
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="vault-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Questions fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ratings">
                <AccordionTrigger>D'où viennent les notes ?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-2">
                    Les notes sont récupérées sur <strong>SensCritique</strong> et <strong>Metacritic</strong>.
                  </p>
                  <p>
                    <strong>Important :</strong> Pour Metacritic, nous utilisons exclusivement le 
                    <em> user score</em> (note des utilisateurs) et jamais le metascore (note des critiques).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="games">
                <AccordionTrigger>Pourquoi la plateforme pour les jeux ?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Les notes Metacritic varient selon la plateforme (PS5, PC, Xbox, Switch, PS4). 
                  Indiquer la plateforme permet d'obtenir la note correspondante.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="notfound">
                <AccordionTrigger>Que faire si une note n'est pas trouvée ?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-2">
                    La recherche automatique peut échouer pour certaines œuvres (titre ambigu, 
                    œuvre récente, orthographe différente...).
                  </p>
                  <p>
                    Dans ce cas, les recommandations restent disponibles mais sans la note manquante. 
                    Vous pouvez vérifier manuellement sur SensCritique ou Metacritic.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="duplicates">
                <AccordionTrigger>Pourquoi je ne vois pas certaines œuvres en recommandation ?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Les œuvres déjà présentes dans vos listes (Aimés, Moyens, Pas aimés, À voir) 
                  sont automatiquement exclues des recommandations pour éviter les doublons.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="data">
                <AccordionTrigger>Mes données sont-elles sauvegardées ?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Oui, vos données sont sauvegardées dans le cloud de manière sécurisée. 
                  Vous pouvez également exporter vos listes en JSON depuis la page "Mes listes".
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card className="vault-card border-border border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              Limitations connues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <Search className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
              <p>
                <strong className="text-foreground">Recherche de notes :</strong> La récupération 
                automatique des notes peut échouer pour certains titres, notamment les œuvres obscures 
                ou avec des titres ambigus.
              </p>
            </div>
            <div className="flex gap-3">
              <Link2 className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
              <p>
                <strong className="text-foreground">Liens :</strong> Les liens vers SensCritique et 
                Metacritic peuvent parfois pointer vers une mauvaise page si plusieurs œuvres 
                partagent le même nom.
              </p>
            </div>
            <div className="flex gap-3">
              <Database className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
              <p>
                <strong className="text-foreground">Cache :</strong> Les notes sont mises en cache 
                pendant 7 jours. Si une note change, elle ne sera pas mise à jour immédiatement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
