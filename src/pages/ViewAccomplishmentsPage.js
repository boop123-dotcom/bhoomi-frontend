import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Accomplishments from '../components/Accomplishments';

function ViewAccomplishmentsPage() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/'); 
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="view-page">
      <Accomplishments />
    </div>
  );
}

export default ViewAccomplishmentsPage;