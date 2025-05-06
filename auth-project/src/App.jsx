import { useState, useEffect } from 'react';
import Auth from './components/EmailAuth';
import Dashboard from './components/Dashboard';
import { supabase } from './supabases';
import './index.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [needsRevalidation, setNeedsRevalidation] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkRevalidation(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkRevalidation(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkRevalidation = async (session) => {
    if (!session) return;
    
    const { data } = await supabase
      .from('user_logins')
      .select('last_login')
      .eq('user_id', session.user.id)
      .order('last_login', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      const lastLogin = new Date(data.last_login);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      if (lastLogin < oneWeekAgo) {
        setNeedsRevalidation(true);
        await supabase.auth.signOut();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!session ? (
        <Auth needsRevalidation={needsRevalidation} />
      ) : (
        <Dashboard session={session} />
      )}
    </div>
  );
}