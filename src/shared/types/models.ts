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
  status: string;
}

export interface PasswordState {
  value: string;
  visible: boolean;
  valid: boolean;
  message: string | null;
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
  duty: string;
  [key: string]: string;
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

// export interface TableProps {
//   columns: ColumnFields[];
//   data: WeeklyAssignmentInterface[];
//   updateMyData: (rowIndex: number, columnId: string, value: string) => void;
//   title: string;
// }

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

export interface AddScheduleProps {
  scheduleTitle: string;
  startDate: string;
  endDate: string;
  view: string;
  team: number;
  churchId: number;
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
  message: string;
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
