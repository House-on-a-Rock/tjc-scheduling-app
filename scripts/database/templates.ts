export const templates = [
  {
    churchId: 2,
    name: 'Weekly Services',
    data: [
      {
        name: 'Friday Evening Service',
        day: 'Friday',
        events: [
          { role: 'Usher (pass these in as roleIds)', time: '7:00 PM' },
          { role: 'Hymn Leading', time: '7:45 PM' },
          { role: 'Piano', time: '7:45 PM' },
          { role: 'Sermon Speaker', time: '8:00 PM' },
          { role: 'Interpreter', time: '8:00 PM' },
        ],
      },
      {
        name: 'Saturday Morning Service',
        day: 'Saturday',
        events: [
          { role: 'Usher', time: '10:15 AM' },
          { role: 'Hymn Leading', time: '10:45 AM' },
          { role: 'Piano', time: '10:45 AM' },
          { role: 'Sermon Speaker', time: '11:00 AM' },
          { role: 'Interpreter', time: '11:00 AM' },
          { role: 'Announcer', time: '12:00 PM' },
          { role: 'Grace', time: '12:00 PM' },
        ],
      },
      {
        name: 'Saturday Afternoon Service',
        day: 'Saturday',
        events: [
          { role: 'Hymn Leading', time: '1:45 PM' },
          { role: 'Piano', time: '1:45 PM' },
          { role: 'Sermon Speaker', time: '2:00 PM' },
          { role: 'Interpreter', time: '2:00 PM' },
        ],
      },
    ],
  },
  {
    churchId: 2,
    name: 'RE Schedule template',
    data: 'will this work?2',
  },
  {
    churchId: 2,
    name: 'Weekday Services template',
    data: 'will this work?3',
  },
  {
    churchId: 2,
    name: 'SSC Schedule template',
    data: 'will this work?4',
  },
  {
    churchId: 2,
    name: 'ESSC Schedule template',
    data: 'will this work?5',
  },
];
