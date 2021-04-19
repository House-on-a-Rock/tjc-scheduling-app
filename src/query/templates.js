import { getTemplates } from './apis';

export const getTemplateData = async (churchId: number) =>
  (await getTemplates(churchId)).data;
