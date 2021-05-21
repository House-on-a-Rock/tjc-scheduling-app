import { useQuery, useMutation, useQueryClient } from 'react-query';
import { deleteTemplate, getTemplates, postSchedule } from '../../apis';
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
      // TODO navigate to created schedule?
      onSuccessHandler(false);
    },
  });

  const destroyTemplate = useMutation(deleteTemplate, {
    onSuccess: (res) => {
      queryClient.setQueryData('templates', res.data);
    },
  });

  const returnData = {
    templates: isLoading ? null : templateData.data,
  };

  return [isLoading, returnData.templates, createSchedule, destroyTemplate];
};

export default useTemplateContainer;
