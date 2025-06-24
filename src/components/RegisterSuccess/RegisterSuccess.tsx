import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterSuccess: React.FC = () => {
  return (
    <section style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Registration Successful!</h1>
      <p>
        <Link to="/login">Click here to sign in</Link>
      </p>
    </section>
  );
};
