import { getTeams } from './apis/teams';

export const getTeamsData = async (churchId: number) => (await getTeams(churchId)).data;
