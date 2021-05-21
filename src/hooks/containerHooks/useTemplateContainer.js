import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createTemplate, getTemplates, postSchedule } from '../../apis';
import { useQueryConfig } from './shared';

const useTemplateContainer = (churchId, onSuccessHandler) => {
  const queryClient = useQueryClient();

  const { isLoading, data: templateData } = useQuery(
    ['templates'],
    () => getTemplates(churchId),
    useQueryConfig,
  );

  const createSchedule = useMutation(postSchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      queryClient.invalidateQueries('schedules');
      onSuccessHandler(false);
    },
  });

  const returnData = {
    templates: isLoading ? null : templateData.data,
  };

  return [isLoading, returnData.templates, createSchedule];
};

export default useTemplateContainer;
