import { useQuery, useMutation, useQueryClient } from 'react-query';
import { deleteTemplate, getTemplates, postSchedule, getTeams } from '../../apis';
import { useQueryConfig } from './shared';
import { useHistory } from 'react-router-dom';

const useTemplateContainer = (churchId, setIsNewScheduleOpen, setAlert) => {
  const queryClient = useQueryClient();
  const history = useHistory();

  const { isLoading: isTemplatesLoading, data: templateData } = useQuery(
    ['templates'],
    () => getTemplates(churchId),
    useQueryConfig,
  );

  const { isLoading: isTeamsLoading, data: teamsData } = useQuery(
    ['teams'],
    () => getTeams(churchId),
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
    loaded: !isTemplatesLoading && !isTeamsLoading,
    templates: isTemplatesLoading ? null : templateData.data,
    teams: isTeamsLoading ? null : teamsData.data,
  };

  return [
    returnData.loaded,
    returnData.templates,
    returnData.teams,
    createSchedule,
    destroyTemplate,
  ];
};

export default useTemplateContainer;
