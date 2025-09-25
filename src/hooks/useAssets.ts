import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LegacyAsset, AssetFormData, convertToLegacyFormat, convertFromLegacyFormat } from '@/types/asset';
import { Tables } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

export const useAssets = () => {
  const [assets, setAssets] = useState<LegacyAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load assets from Supabase
  const loadAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const legacyAssets = (data || []).map((asset: Tables<'assets'>) => convertToLegacyFormat(asset as any));
      setAssets(legacyAssets);
    } catch (err) {
      console.error('Error loading assets:', err);
      setError('Failed to load assets');
      toast({
        title: "Error",
        description: "Failed to load assets from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new asset
  const addAsset = async (assetData: AssetFormData) => {
    try {
      const dbAsset = convertFromLegacyFormat(assetData);
      
      const { data, error } = await supabase
        .from('assets')
        .insert([dbAsset])
        .select()
        .single();

      if (error) throw error;

      const newLegacyAsset = convertToLegacyFormat(data as any);
      setAssets(prev => [newLegacyAsset, ...prev]);
      
      toast({
        title: "Asset added",
        description: `${assetData.name} has been added successfully.`,
      });
    } catch (err) {
      console.error('Error adding asset:', err);
      toast({
        title: "Error",
        description: "Failed to add asset to database",
        variant: "destructive",
      });
    }
  };

  // Update existing asset
  const updateAsset = async (id: string, assetData: AssetFormData) => {
    try {
      const dbAsset = convertFromLegacyFormat(assetData);
      
      const { data, error } = await supabase
        .from('assets')
        .update(dbAsset)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedLegacyAsset = convertToLegacyFormat(data as any);
      setAssets(prev => prev.map(asset => 
        asset.id === id ? updatedLegacyAsset : asset
      ));
      
      toast({
        title: "Asset updated",
        description: `${assetData.name} has been updated successfully.`,
      });
    } catch (err) {
      console.error('Error updating asset:', err);
      toast({
        title: "Error",
        description: "Failed to update asset in database",
        variant: "destructive",
      });
    }
  };

  // Delete asset
  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.filter(asset => asset.id !== id));
      
      toast({
        title: "Asset deleted",
        description: "Asset has been deleted successfully.",
      });
    } catch (err) {
      console.error('Error deleting asset:', err);
      toast({
        title: "Error",
        description: "Failed to delete asset from database",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    loadAssets();

    const channel = supabase
      .channel('assets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assets'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Reload assets on any change
          loadAssets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    assets,
    loading,
    error,
    addAsset,
    updateAsset,
    deleteAsset,
    refreshAssets: loadAssets,
  };
};