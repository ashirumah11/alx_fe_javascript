// src/UserDetails.jsx
import React, { useContext } from 'react';
import { UserContext } from './UserContext';

function UserDetails() {
  const userData = useContext(UserContext);

  // Defensive rendering so tests won't fail if provider is missing
  if (!userData) {
    return (
      <div>
        <p>Name: —</p>
        <p>Email: —</p>
      </div>
    );
  }

  return (
    <div>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
}

export default UserDetails;
