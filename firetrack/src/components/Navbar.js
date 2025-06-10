import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand">FireTrack</span>
        <div className="navbar-nav ms-auto">
          {currentUser && (
            <button
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
