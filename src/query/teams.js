import { getTeams } from './apis/teams';

export const getTeamsData = async (churchId) => (await getTeams(churchId)).data;
