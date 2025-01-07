import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';

type UserProfile = {
  id: string;
  role: string;
  [key: string]: any;
};

type AuthData = {
  session: Session | null;
  loading: boolean;
  user: UserProfile | null;
  isAdmin: boolean;
  isPatient: boolean;
  isHcp: boolean;
  restoreSession: (tokens: { access_token: string; refresh_token: string }) => Promise<void>;
};

const AuthContext = createContext<AuthData | undefined>(undefined);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthData>({
    session: null,
    loading: true,
    user: null,
    isAdmin: false,
    isPatient: false,
    isHcp: false,
    restoreSession: async () => {},
  });

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        setAuthState((prev) => ({ ...prev, loading: false }));
        return;
      }

      if (session) {
        await fetchUserProfile(session.user.id, session);
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id, session);
      } else {
        setAuthState((prev) => ({
          session: null,
          loading: false,
          user: null,
          isAdmin: false,
          isPatient: false,
          isHcp: false,
          restoreSession,
        }));
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(userId: string, session: Session | null = authState.session) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setAuthState({
        session,
        loading: false,
        user: data,
        isAdmin: data.role === 'admin',
        isPatient: data.role === 'patient',
        isHcp: data.role === 'hcp',
        restoreSession,
      });
    } catch (err) {
      console.error('Unexpected error fetching user profile:', err);
    }
  }

  async function restoreSession({ access_token, refresh_token }: { access_token: string; refresh_token: string }) {
    const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });

    if (error) {
      console.error('Error restoring session:', error);
      return;
    }
    if(data){ router.replace('/updatepass');}
    
  }

  return <AuthContext.Provider value={{ ...authState, restoreSession }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
