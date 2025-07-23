import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectByRole = async () => {
      const user = auth.currentUser;
      if (!user) return navigate('/');

      const userDoc = await getDoc(doc(db, 'Users', user.uid));
      const data = userDoc.data();

      if (data.role === 'chef') {
        navigate('/chef/accueil');
      } else if (data.role === 'technicien') {
        navigate('/technicien/accueil');
      } else {
        navigate('/');
      }

      setLoading(false);
    };

    redirectByRole();
  }, [navigate]);

  return loading ? <p>Redirection en cours...</p> : null;
}

export default UserProfile;