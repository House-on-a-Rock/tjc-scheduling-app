import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// queries
import { useQuery } from 'react-query';

// api
import { getTemplateData } from '../../query';

// components
import { TemplateContainer } from './TemplateContainer';

export const Template = ({ churchId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState('');

  // queries
  const templates = useQuery(['templates', churchId], () => getTemplateData(churchId), {
    enabled: !!churchId,
    refetchOnWindowFocus: false,
    staleTime: 100000000000000,
  });

  useEffect(() => {
    if (templates.isSuccess) setError(null);
    if (templates.isError) setError(templates.error);
    if (templates.data) setData({ ...data, templates: templates.data });
    if (templates.isLoading !== isLoading) setIsLoading(templates.isLoading);
  }, [templates]);

  // if (isTemplatesLoading) return <div>Loading</div>;

  // TODO add confirmation alerts
  return <TemplateContainer state={{ data, isLoading, error, isSuccess }} />;
};

Template.propTypes = {
  churchId: PropTypes.string,
};

export default Template;
