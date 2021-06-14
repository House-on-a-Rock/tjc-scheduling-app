import React from 'react';
import PropTypes from 'prop-types';

const ErrorPage = ({ type }) => {
  return (
    <>
      Error page
      {type === 'expired' && 'Token Expired'}
    </>
  );
};

ErrorPage.propTypes = {
  type: PropTypes.string,
};

export default ErrorPage;
