import { getTemplates } from '../store/apis';

export const getTemplateData = async (key: string, churchId: number) =>
  (await getTemplates(churchId)).data;
