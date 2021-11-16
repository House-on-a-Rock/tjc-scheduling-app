import * as React from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { yupResolver } from '@hookform/resolvers/yup';

export const Form = ({ onSubmit, children, className, options, id, schema }) => {
  const methods = useForm({
    ...options,
    resolver: schema && yupResolver(schema),
  });
  return (
    <form className={clsx(className)} onSubmit={methods.handleSubmit(onSubmit)} id={id}>
      {children(methods)}
    </form>
  );
};
