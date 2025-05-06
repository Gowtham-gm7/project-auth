import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabases';
import '../index.css';

export default function Dashboard({ session }) {
  const [loginTime, setLoginTime] = useState('');
  const [nextValidation, setNextValidation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;  // Declare a timeout ID to clean up the timeout later

    const fetchLoginData = async () => {
      setLoading(true);
      try {
        // Ensure the session exists before fetching data
        if (!session || !session.user) return;

        // Get the most recent login
        const { data } = await supabase
          .from('user_logins')
          .select('last_login')
          .eq('user_id', session.user.id)
          .order('last_login', { ascending: false })
          .limit(1)
          .single();
          
        if (data) {
          const lastLogin = new Date(data.last_login);
          setLoginTime(lastLogin.toLocaleString());
      
          const nextValidationDate = new Date(lastLogin);
          nextValidationDate.setMinutes(nextValidationDate.getMinutes() + 1);  // Add 1 minute
          setNextValidation(nextValidationDate.toLocaleString());
      
          // Automatically sign out after 1 minute
          timeoutId = setTimeout(async () => {
            console.log("Automatic logout initiated");
            await supabase.auth.signOut();
            navigate('/emailauth');  // Redirect to email auth page
          }, 60000);  // 60000 milliseconds = 1 minute
        }
      } catch (error) {
        console.error('Error fetching login data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginData();

    // Cleanup the timeout if the component unmounts or session changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [session, navigate]);  // Added navigate to dependencies

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/emailauth');  // Redirect to email auth page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-800">Welcome, {session.user.email}</h2>
              <p className="text-blue-700">You're successfully authenticated!</p>
              {loginTime && (
                <div className="mt-4">
                  <p className="text-gray-600">Logged in at: {loginTime}</p>
                  <p className="text-gray-600">Auto logout at: {nextValidation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}