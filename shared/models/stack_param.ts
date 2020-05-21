// ParamList
export type DrawerStackParamList = {
    HomeStack: undefined;
    ProfileStack: undefined;
    SettingsStack: undefined;
    LogoutStack: undefined;
};

export type LogoutStackParamList = {
    Logout: undefined;
};

export type ProfileStackParamList = {
    Profile: undefined;
};

export type SettingsStackParamList = {
    Settings: undefined;
};

// HomeStack / Tab

export type HomeStackTabParamList = {
    CalendarStack: undefined;
    ScheduleStack: undefined;
};

export type CalendarStackParamList = {
    Calendar: undefined;
    Tasks: { name: string; taskDetails: [] };
};

export type ScheduleStackParamList = {
    Schedule: undefined;
};

// Auth

export type AuthStackParamList = {
    Login: undefined;
    RecoverLogin: undefined;
    SignUp: undefined;
};
