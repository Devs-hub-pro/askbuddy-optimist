import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}

export const useUserLocation = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('浏览器不支持定位');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const loc: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(loc);
        setLoading(false);

        // Save to profile if logged in
        if (user) {
          await (supabase as any)
            .from('profiles')
            .update({
              latitude: loc.latitude,
              longitude: loc.longitude,
            })
            .eq('user_id', user.id);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [user]);

  return { location, loading, error, requestLocation };
};

export const getNearbyExperts = async (latitude: number, longitude: number, radiusKm = 50) => {
  const { data, error } = await (supabase as any).rpc('get_nearby_experts', {
    p_lat: latitude,
    p_lng: longitude,
    p_radius_km: radiusKm,
  });

  if (error) throw error;
  return data || [];
};
