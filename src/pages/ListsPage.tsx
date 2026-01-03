import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useProfile } from '@/lib/profile-context';
import { MediaType, ListStatus, MEDIA_TYPE_LABELS, MEDIA_TYPE_ICONS, LIST_STATUS_LABELS, GamingPlatform, GAMING_PLATFORMS } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/media-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Download, Upload, Film, Tv, Gamepad2, BookOpen, Music } from 'lucide-react';
import { toast } from 'sonner';

const mediaTypeIcons: Record<MediaType, React.ReactNode> = {
  film: <Film className="w-4 h-4" />,
  serie: <Tv className="w-4 h-4" />,
  jeu: <Gamepad2 className="w-4 h-4" />,
  livre: <BookOpen className="w-4 h-4" />,
  musique: <Music className="w-4 h-4" />,
};

export default function ListsPage() {
  const { mediaItems, addMediaItem, removeMediaItem, getItemsByTypeAndStatus } = useProfile();
  const [activeType, setActiveType] = useState<MediaType>('film');
  const [activeStatus, setActiveStatus] = useState<ListStatus>('aime');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<GamingPlatform>('PS5');
  const [importText, setImportText] = useState('');

  const currentItems = getItemsByTypeAndStatus(activeType, activeStatus);

  const handleAddItem = async () => {
    if (!newTitle.trim()) return;

    await addMediaItem({
      title: newTitle.trim(),
      media_type: activeType,
      status: activeStatus,
      platform: activeType === 'jeu' ? newPlatform : undefined,
    });

    toast.success(`"${newTitle}" ajouté`);
    setNewTitle('');
    setIsAddOpen(false);
  };

  const handleImport = async () => {
    const titles = importText.split('\n').filter(t => t.trim());
    if (titles.length === 0) return;

    for (const title of titles) {
      await addMediaItem({
        title: title.trim(),
        media_type: activeType,
        status: activeStatus,
        platform: activeType === 'jeu' ? newPlatform : undefined,
      });
    }

    toast.success(`${titles.length} éléments importés`);
    setImportText('');
    setIsImportOpen(false);
  };

  const handleExport = () => {
    const data = mediaItems.filter(item => item.media_type === activeType);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovault-${activeType}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export téléchargé');
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">
              <span className="gold-text">Mes listes</span>
            </h1>
            <p className="text-muted-foreground">
              {mediaItems.length} œuvres enregistrées
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importer des titres</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Un titre par ligne</Label>
                    <Textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="The Last of Us&#10;God of War&#10;Elden Ring"
                      rows={8}
                      className="mt-1.5"
                    />
                  </div>
                  {activeType === 'jeu' && (
                    <div>
                      <Label>Plateforme</Label>
                      <Select value={newPlatform} onValueChange={(v) => setNewPlatform(v as GamingPlatform)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GAMING_PLATFORMS.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button onClick={handleImport} className="w-full">
                    Importer dans {LIST_STATUS_LABELS[activeStatus]}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Media type tabs */}
        <Tabs value={activeType} onValueChange={(v) => setActiveType(v as MediaType)}>
          <TabsList className="grid grid-cols-5 w-full">
            {(Object.keys(MEDIA_TYPE_LABELS) as MediaType[]).map((type) => (
              <TabsTrigger key={type} value={type} className="gap-2">
                {mediaTypeIcons[type]}
                <span className="hidden sm:inline">{MEDIA_TYPE_LABELS[type]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(MEDIA_TYPE_LABELS) as MediaType[]).map((type) => (
            <TabsContent key={type} value={type} className="mt-6">
              {/* Status tabs */}
              <Tabs value={activeStatus} onValueChange={(v) => setActiveStatus(v as ListStatus)}>
                <TabsList className="w-full justify-start gap-1 h-auto flex-wrap">
                  {(Object.keys(LIST_STATUS_LABELS) as ListStatus[]).map((status) => {
                    const count = getItemsByTypeAndStatus(type, status).length;
                    return (
                      <TabsTrigger key={status} value={status} className="gap-2">
                        <StatusBadge status={status} className="py-0.5" />
                        <span className="text-muted-foreground">({count})</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {(Object.keys(LIST_STATUS_LABELS) as ListStatus[]).map((status) => (
                  <TabsContent key={status} value={status} className="mt-4">
                    <div className="vault-card">
                      {/* Add button */}
                      <div className="p-4 border-b border-border">
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full border-dashed">
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter un {MEDIA_TYPE_LABELS[activeType].toLowerCase()}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ajouter à {LIST_STATUS_LABELS[activeStatus]}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Titre</Label>
                                <Input
                                  value={newTitle}
                                  onChange={(e) => setNewTitle(e.target.value)}
                                  placeholder={`Nom du ${MEDIA_TYPE_LABELS[activeType].toLowerCase()}`}
                                  className="mt-1.5"
                                />
                              </div>
                              {activeType === 'jeu' && (
                                <div>
                                  <Label>Plateforme</Label>
                                  <Select value={newPlatform} onValueChange={(v) => setNewPlatform(v as GamingPlatform)}>
                                    <SelectTrigger className="mt-1.5">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {GAMING_PLATFORMS.map((p) => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              <Button onClick={handleAddItem} className="w-full">
                                Ajouter
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Items list */}
                      {currentItems.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          <p>Aucun élément dans cette liste</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {currentItems.map((item) => (
                            <div 
                              key={item.id} 
                              className="px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{MEDIA_TYPE_ICONS[item.media_type]}</span>
                                <div>
                                  <p className="font-medium">{item.title}</p>
                                  {item.platform && (
                                    <p className="text-xs text-muted-foreground">{item.platform}</p>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  removeMediaItem(item.id);
                                  toast.success('Élément supprimé');
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
}
