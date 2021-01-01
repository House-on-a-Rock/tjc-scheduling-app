import { Color } from '@material-ui/lab/Alert';

export interface HttpResponseStatus {
  status: number;
  message: string;
}

export interface HttpErrorProps {
  status: number;
  message: string;
}
export interface AlertInterface {
  message: string;
  status: Color;
}

export interface PasswordState extends TextFieldState {
  visible: boolean;
}

export interface EmailState {
  value: string;
  valid: boolean;
  message: string | null;
}

export interface JWTDataType {
  iss: string;
  sub: string;
  exp: string;
  type: string;
  access: string;
}

export interface ColumnFields {
  Header: string;
  accessor: string;
}

export type DayIndexOptions = {
  [key: string]: number;
};

export interface WeeklyAssignmentInterface {
  title: string;
  view: string;
  role: any;
  columns: any;
  services: any;
}
export interface MappedScheduleInterface {
  day: string;
  name: string;
  columns: ColumnFields[];
  data: WeeklyAssignmentInterface[];
}

export interface WeeklyAssignment {
  [key: string]: string;
}

export interface TaskData {
  date: string;
  assignee: string;
}
export interface DutyData {
  title: string;
  tasks: TaskData[];
  team?: string;
}
export interface EventData {
  time: string;
  duties: DutyData[];
  tag?: string;
}
export interface WeeklyEventData {
  day: string;
  events: EventData[];
  dividers: Divider[];
  order: number;
}
export interface TimeRange {
  start: string;
  end: string;
}
export interface Divider {
  name: string;
  timerange: TimeRange;
}
export interface ScheduleData {
  title: string;
  id: string;
  view: string;
  daterange: string[];
  weeklyEvents: WeeklyEventData[];
  specificEvents?: any[];
}

export interface ScheduleInterface {
  columns: ColumnFields[];
  day: string;
}
interface CellIndexType {
  index: number;
}

interface CellColumnType {
  id: string;
}
export interface DataCellProps {
  value: any;
  row: CellIndexType;
  column: CellColumnType;
  updateMyData: (rowIndex: number, columnId: string, value: string) => void;
}

export type AccessTypes = 'read' | 'write';

export interface SchedulerProps {
  schedule: MappedScheduleInterface;
  // schedule: MappedScheduleInterface;
}

export interface ScheduleTabsProps {
  titles: string[];
  tabIdx: number;
  onTabClick: (e: React.ChangeEvent<{}>, value: number) => void;
}

export interface AddUserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  churchId: number;
}

export interface NewScheduleData {
  title: string;
  startDate: string;
  endDate: string;
  view: string;
  team: number;
  churchId?: number;
}

export interface NewServiceData {
  name: string;
  order?: number;
  dayOfWeek: number;
  scheduleId?: number;
}

export interface DeleteScheduleData {
  scheduleId: number;
  title: string;
}

export interface DeleteEventsData {
  eventIds: string[];
}

export interface AddServiceProps {
  name: string;
  order: number;
  dayOfWeek: number;
  scheduleId: number;
}

export interface ValidatedFieldState<T> {
  valid: boolean;
  message: string;
  value: T;
}

export interface TextFieldState {
  valid: boolean;
  message: string | null;
  value: string;
}

export interface LoadingState {
  loading: boolean;
  response: HttpResponseStatus;
}

export interface LoadingPayload {
  loading: boolean;
  response: HttpResponseStatus;
}

export interface MemberStateData {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  ChurchId?: number;
  church: ChurchAttribute;
  disabled: boolean;
  roles: string[];
}

interface ChurchAttribute {
  name: string;
}

// export interface DeleteScheduleProps
