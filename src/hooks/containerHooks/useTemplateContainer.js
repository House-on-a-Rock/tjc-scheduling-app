import { useQuery, useMutation, useQueryClient } from 'react-query';
import { deleteTemplate, getTemplates, postSchedule } from '../../apis';
import { useQueryConfig } from './shared';

const useTemplateContainer = (churchId, setIsNewScheduleOpen, setAlert, history) => {
  const queryClient = useQueryClient();

  const { isLoading, data: templateData } = useQuery(
    ['templates'],
    () => getTemplates(churchId),
    useQueryConfig,
  );

  const createSchedule = useMutation(postSchedule, {
    onSuccess: (res) => {
      queryClient.setQueryData('tabs', res.data);
      setIsNewScheduleOpen(false);
      setAlert(res);
      history.push(`/home?tab=${res.data.data.length - 1}`);
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
