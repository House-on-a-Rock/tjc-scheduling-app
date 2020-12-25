import { getTemplates } from './apis';

export const getTemplateData = async (key: string, churchId: number) =>
  (await getTemplates(churchId)).data;
