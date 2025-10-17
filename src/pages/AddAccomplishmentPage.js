import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import AccomplishmentForm from '../components/AccomplishmentsForm';

function AddAccomplishmentPage() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        navigate('/');
      } else {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="add-page">
      {/* Optional small header actions */}
      <div className="nav-buttons flex items-center justify-between mb-4">
        <Link
          to="/dashboard/accomplishments/overview"
          className="text-blue-600 hover:underline"
        >
          ← Back to Overview
        </Link>
        <button
          onClick={() => auth.signOut()}
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <AccomplishmentForm
        userId={user.uid}
        userName={user.displayName || user.email}
      />
    </div>
  );
}

export default AddAccomplishmentPage;
