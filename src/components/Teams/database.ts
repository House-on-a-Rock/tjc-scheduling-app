import { v4 as uuid } from 'uuid';
import { BackendTeamsData, MembersData } from './models';

export const TEAMS: BackendTeamsData[] = [
  {
    role: 'Sermon Speakers',
    members: [
      { id: uuid(), name: 'Sun-Yu Yang' },
      { id: uuid(), name: 'Kevin Wang' },
      { id: uuid(), name: 'Yvonne Wong' },
    ],
  },
  {
    role: 'Pianists',
    members: [
      { id: uuid(), name: 'Shouli Tung' },
      { id: uuid(), name: 'Shaun Tung' },
      { id: uuid(), name: 'Rebecca Lin' },
      { id: uuid(), name: 'Shenney Lin' },
      { id: uuid(), name: 'Joseph Wu' },
      { id: uuid(), name: 'Chloe Lin' },
      { id: uuid(), name: 'Vinnie Lin' },
    ],
  },
  {
    role: 'Announcers',
    members: [
      { id: uuid(), name: 'Yvonne Wong' },
      { id: uuid(), name: 'Sun-Yu Yang' },
      { id: uuid(), name: 'Brenda Ong' },
      { id: uuid(), name: 'Kevin Wang' },
    ],
  },
  {
    role: 'Interpreter',
    members: [
      { id: uuid(), name: 'Thomas Hsu' },
      { id: uuid(), name: 'Joseph Wu' },
      { id: uuid(), name: 'Qianwei Liu' },
      { id: uuid(), name: 'Rebecca Lin' },
    ],
  },
];

export const MEMBERS: MembersData[] = [
  { id: uuid(), name: 'Shaun Tung' },
  { id: uuid(), name: 'Sun-Yu Yang' },
  { id: uuid(), name: 'Kevin Wang' },
  { id: uuid(), name: 'Yvonne Wong' },
  { id: uuid(), name: 'Shouli Tung' },
  { id: uuid(), name: 'Rebecca Lin' },
  { id: uuid(), name: 'Shenney Lin' },
  { id: uuid(), name: 'Joseph Wu' },
  { id: uuid(), name: 'Brenda Ong' },
  { id: uuid(), name: 'Thomas Hsu' },
  { id: uuid(), name: 'Qianwei Liu' },
  { id: uuid(), name: 'Chloe Lin' },
  { id: uuid(), name: 'Vinnie Lin' },
];
