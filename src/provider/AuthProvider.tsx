import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

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
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  user: null,
  isAdmin: false,
  isPatient: false,
  isHcp: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthData>({
    session: null,
    loading: true,
    user: null,
    isAdmin: false,
    isPatient: false,
    isHcp: false,
  });

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        setAuthState((prevState) => ({ ...prevState, loading: false }));
        return;
      }
      if (session) {
        fetchUserProfile(session.user.id, session);
      } else {
        setAuthState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    const fetchUserProfile = async (userId: string, session: Session | null = authState.session) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
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
      });
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id, session);
      } else {
        setAuthState({
          session: null,
          loading: false,
          user: null,
          isAdmin: false,
          isPatient: false,
          isHcp: false,
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

