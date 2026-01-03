import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserPreferences, MediaItem, MediaType, ListStatus, GamingPlatform } from './types';

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

const defaultPreferences: UserPreferences = {
  general: '',
  directors: [],
  actors: [],
  music_genres: [],
  game_preferences: '',
  book_preferences: '',
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initProfile = async () => {
    setIsLoading(true);
    
    // Check localStorage for existing profile
    let storedProfileId = localStorage.getItem('recovault_profile_id');
    
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
    }
    
    setIsLoading(false);
  };

  const loadMediaItems = async (pid: string) => {
    const { data } = await supabase
      .from('media_lists')
      .select('*')
      .eq('profile_id', pid)
      .order('created_at', { ascending: false });
    
    if (data) {
      setMediaItems(data as MediaItem[]);
    }
  };

  const refreshData = async () => {
    if (profileId) {
      await loadMediaItems(profileId);
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    if (!profileId) return;
    
    const newPrefs = { ...preferences, ...prefs };
    
    await supabase
      .from('profiles')
      .update({ preferences: newPrefs })
      .eq('id', profileId);
    
    setPreferences(newPrefs);
  };

  const addMediaItem = async (item: Omit<MediaItem, 'id' | 'profile_id' | 'created_at'>) => {
    if (!profileId) return;
    
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
    await supabase.from('media_lists').delete().eq('id', id);
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  const updateMediaItem = async (id: string, updates: Partial<MediaItem>) => {
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
  }, []);

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
