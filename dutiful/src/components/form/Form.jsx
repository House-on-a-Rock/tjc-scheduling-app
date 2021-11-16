import * as React from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { yupResolver } from '@hookform/resolvers/yup';

export const Form = ({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
  defaultValues = {},
}) => {
  const methods = useForm({
    ...options,
    resolver: schema && yupResolver(schema),
    defaultValues: defaultValues,
  });

  return (
    <form className={clsx(className)} onSubmit={methods.handleSubmit(onSubmit)} id={id}>
      {children(methods)}
    </form>
  );
};
