import { HttpErrorProps } from '../shared/types';

export interface DataStateProp<T> {
  data: T;
  isLoading: boolean;
  error: HttpErrorProps;
  isSuccess: string;
}

interface EventDataInterface {
  roleId: number;
  time: string;
  title: string;
}

interface ServiceDataInterface {
  name: string;
  day: string;
  events: EventDataInterface[];
}
export interface TemplateDataInterface {
  templateId: number;
  name: string;
  data: ServiceDataInterface[];
}
