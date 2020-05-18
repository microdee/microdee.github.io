import React from 'react';
import { Link } from 'react-router';

export default function Home() {
  return (
    <div>
      <h2>Unimpressive.Articles</h2>
      <p>Statically served, all-client, Markdown and React based article reader website boilerplate for lazy and/or poor people who still wants total control tho.</p>
      <p>Originally designed for Github pages, but works with a dead simple default nginx as well.</p>
      <div><Link to="/c/test">Test article</Link></div>
    </div>
  );
}
