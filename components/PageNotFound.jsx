import React from 'react';
import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  let location = useLocation();
  
  return (
    <p>
      I'm sorry but, <b>{location.pathname}</b>, is not a thing.
    </p>
  );
}
