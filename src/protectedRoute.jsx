import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
  const [isLoading, setIsLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === role) {
          setAllowed(true);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [role]);

  if (isLoading) return <p>Chargement...</p>;

  return allowed ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;