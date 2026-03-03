import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const EducationSearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  const nextParams = new URLSearchParams();
  nextParams.set('channel', 'education');
  if (query) {
    nextParams.set('q', query);
  }

  return <Navigate to={`/search?${nextParams.toString()}`} replace />;
};

export default EducationSearchResults;
