import { getTemplates } from './apis';

export const getTemplateData = async (churchId) => (await getTemplates(churchId)).data;
