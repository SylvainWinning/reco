import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, supabaseConfigError } from '@/integrations/supabase/client';
import { UserPreferences, MediaItem, MediaType, ListStatus } from './types';
import { defaultPreferences, seededMediaItems } from './default-data';

interface ProfileContextType {
  profileId: string | null;
  preferences: UserPreferences;
  mediaItems: MediaItem[];
  isLoading: boolean;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  addMediaItem: (item: Omit<MediaItem, 'id' | 'profile_id' | 'created_at'>) => Promise<void>;
  removeMediaItem: (id: string) => Promise<void>;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => Promise<void>;
  getItemsByTypeAndStatus: (mediaType: MediaType, status: ListStatus) => MediaItem[];
  isInAnyList: (title: string, mediaType: MediaType) => boolean;
  refreshData: () => Promise<void>;
}

const disabledContextValue: ProfileContextType = {
  profileId: null,
  preferences: defaultPreferences,
  mediaItems: [],
  isLoading: false,
  updatePreferences: async () => {
    console.error('Mise à jour des préférences impossible : Supabase n\'est pas configuré.');
  },
  addMediaItem: async () => {
    console.error('Ajout impossible : Supabase n\'est pas configuré.');
  },
  removeMediaItem: async () => {
    console.error('Suppression impossible : Supabase n\'est pas configuré.');
  },
  updateMediaItem: async () => {
    console.error('Mise à jour impossible : Supabase n\'est pas configuré.');
  },
  getItemsByTypeAndStatus: () => [],
  isInAnyList: () => false,
  refreshData: async () => {
    console.error('Rafraîchissement impossible : Supabase n\'est pas configuré.');
  },
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(supabaseConfigError);

  const loadMediaItems = useCallback(async (pid: string) => {
    if (!supabase) {
      console.error('Impossible de charger les médias : Supabase n\'est pas configuré.');
      return;
    }

    const { data } = await supabase
      .from('media_lists')
      .select('*')
      .eq('profile_id', pid)
      .order('created_at', { ascending: false });

    if (data) {
      setMediaItems(data as MediaItem[]);
    }
  }, []);

  const prefillMediaLists = useCallback(async (pid: string, hasExistingProfile: boolean) => {
    const shouldPrefill = (import.meta.env.VITE_PREFILL_ANONYMOUS_PROFILE ?? 'true') !== 'false';

    if (!supabase || !shouldPrefill || hasExistingProfile) return;

    const { error: rpcError } = await supabase.rpc('seed_anonymous_profile', {
      profile_id: pid,
      skip_seed: false,
    });

    if (rpcError) {
      console.warn('RPC seed_anonymous_profile indisponible, fallback client.', rpcError.message);

      const { error: insertError } = await supabase
        .from('media_lists')
        .insert(seededMediaItems.map(item => ({ ...item, profile_id: pid })));

      if (insertError) {
        console.error('Impossible de préremplir les listes par défaut', insertError.message);
        return;
      }
    }

    await loadMediaItems(pid);
  }, [loadMediaItems]);

  const initProfile = useCallback(async () => {
    setIsLoading(true);

    if (!supabase) {
      setSupabaseError(supabaseConfigError ?? 'Supabase n\'est pas configuré. Vérifiez vos variables VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.');
      setIsLoading(false);
      return;
    }

    // Check localStorage for existing profile
    const storedProfileId = localStorage.getItem('recovault_profile_id');
    const hasExistingProfile = Boolean(storedProfileId);

    if (storedProfileId) {
      // Verify profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', storedProfileId)
        .single();
      
      if (profile) {
        setProfileId(profile.id);
        const prefs = profile.preferences as unknown as UserPreferences;
        setPreferences(prefs || defaultPreferences);
        await loadMediaItems(profile.id);
        setIsLoading(false);
        return;
      }
    }

    // Create new anonymous profile
    const prefsJson = JSON.parse(JSON.stringify(defaultPreferences));
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert([{ preferences: prefsJson }])
      .select()
      .single();

    if (newProfile && !error) {
      localStorage.setItem('recovault_profile_id', newProfile.id);
      setProfileId(newProfile.id);
      setPreferences(defaultPreferences);
      await prefillMediaLists(newProfile.id, hasExistingProfile);
    }

    setIsLoading(false);
  }, [loadMediaItems, prefillMediaLists]);

  const refreshData = async () => {
    if (!supabase) {
      console.error('Impossible de rafraîchir les données : Supabase n\'est pas configuré.');
      return;
    }

    if (profileId) {
      await loadMediaItems(profileId);
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    if (!profileId) return;
    if (!supabase) {
      console.error('Impossible de mettre à jour les préférences : Supabase n\'est pas configuré.');
      return;
    }

    const newPrefs = { ...preferences, ...prefs };

    await supabase
      .from('profiles')
      .update({ preferences: newPrefs })
      .eq('id', profileId);
    
    setPreferences(newPrefs);
  };

  const addMediaItem = async (item: Omit<MediaItem, 'id' | 'profile_id' | 'created_at'>) => {
    if (!profileId) return;
    if (!supabase) {
      console.error('Impossible d\'ajouter un élément : Supabase n\'est pas configuré.');
      return;
    }

    const { data, error } = await supabase
      .from('media_lists')
      .insert({
        profile_id: profileId,
        media_type: item.media_type,
        status: item.status,
        title: item.title,
        platform: item.platform,
        notes: item.notes,
      })
      .select()
      .single();
    
    if (data && !error) {
      setMediaItems(prev => [data as MediaItem, ...prev]);
    }
  };

  const removeMediaItem = async (id: string) => {
    if (!supabase) {
      console.error('Impossible de supprimer un élément : Supabase n\'est pas configuré.');
      return;
    }

    await supabase.from('media_lists').delete().eq('id', id);
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  const updateMediaItem = async (id: string, updates: Partial<MediaItem>) => {
    if (!supabase) {
      console.error('Impossible de mettre à jour un élément : Supabase n\'est pas configuré.');
      return;
    }

    await supabase.from('media_lists').update(updates).eq('id', id);
    setMediaItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const getItemsByTypeAndStatus = (mediaType: MediaType, status: ListStatus) => {
    return mediaItems.filter(item => item.media_type === mediaType && item.status === status);
  };

  const isInAnyList = (title: string, mediaType: MediaType) => {
    return mediaItems.some(
      item => item.title.toLowerCase() === title.toLowerCase() && item.media_type === mediaType
    );
  };

  useEffect(() => {
    initProfile();
  }, [initProfile]);

  if (supabaseError) {
    return (
      <ProfileContext.Provider value={disabledContextValue}>
        <div className="p-6 space-y-4 text-center text-sm text-muted-foreground">
          <p className="text-base font-semibold text-destructive">Connexion à Supabase impossible</p>
          <p>{supabaseError}</p>
          <p>Ajoutez ces variables dans votre fichier d'environnement puis redémarrez l'application.</p>
        </div>
      </ProfileContext.Provider>
    );
  }

  return (
    <ProfileContext.Provider
      value={{
        profileId,
        preferences,
        mediaItems,
        isLoading,
        updatePreferences,
        addMediaItem,
        removeMediaItem,
        updateMediaItem,
        getItemsByTypeAndStatus,
        isInAnyList,
        refreshData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
