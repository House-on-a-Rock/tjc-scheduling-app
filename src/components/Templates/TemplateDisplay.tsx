import React from 'react';

export const TemplateDisplay = ({ template }: any) => {
  console.log('template', template);
  return <div>{template.name}</div>;
};
