import React from 'react';

function PageNotFound({ location }) {
  return (
    <p>
      I'm sorry but, <b>{location.pathname}</b>, is not a thing.
    </p>
  );
}

export default PageNotFound;
