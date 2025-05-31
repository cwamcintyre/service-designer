import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

export default function CallbackPage() {
  const auth = useAuth();

  useEffect(() => {
    console.log(auth);
    if (auth.isAuthenticated) {
      window.location.href = '/form';
    } else {
      console.log("User is not authenticated");
    }
  }, [auth]);

  return (
    <div>Redirecting...</div>
  );
}