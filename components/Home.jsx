import React from 'react';
import { Link } from 'react-router';

export default function Home() {
  return (
    <div>
      <p>
        There was once a lush and beautiful website, but everything comes to an end, to make way to the new.
      </p>
      <p>
        A slightly worse website is incoming. I know, but that's just how thermodynamics works :(
      </p>
      <div><Link to="/c/test">Test article</Link></div>
    </div>
  );
}
