import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
    LogoutStackParamList,
    DrawerStackParamList,
    ProfileStackParamList,
    SettingsStackParamList,
    CalendarStackParamList,
    HomeStackTabParamList,
    ScheduleStackParamList,
    AuthStackParamList,
} from './stack_param';

/* Drawer */

// LogoutScreen

export type LogoutRouteProp = RouteProp<LogoutStackParamList, 'Logout'>;

export type LogoutStackNavigationProp = CompositeNavigationProp<
    StackNavigationProp<LogoutStackParamList, 'Logout'>,
    StackNavigationProp<DrawerStackParamList>
>;

export type LogoutScreenProps = {
    route: LogoutRouteProp;
    navigation: LogoutStackNavigationProp;
};

// ProfileScreen

export type ProfileRouteProp = RouteProp<ProfileStackParamList, 'Profile'>;

export type ProfileStackNavigationProp = CompositeNavigationProp<
    StackNavigationProp<ProfileStackParamList, 'Profile'>,
    StackNavigationProp<DrawerStackParamList>
>;

export type ProfileScreenProps = {
    route: ProfileRouteProp;
    navigation: ProfileStackNavigationProp;
};

// Settings

export type SettingsRouteProp = RouteProp<SettingsStackParamList, 'Settings'>;

export type SettingsStackNavigationProp = CompositeNavigationProp<
    StackNavigationProp<SettingsStackParamList, 'Settings'>,
    StackNavigationProp<DrawerStackParamList>
>;

export type SettingsScreenProps = {
    route: SettingsRouteProp;
    navigation: SettingsStackNavigationProp;
};

/* Drawer/HomeStack-Tab */

// ScheduleScreen

export type ScheduleRouteProp = RouteProp<CalendarStackParamList, 'Tasks'>;

export type ScheduleScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<ScheduleStackParamList, 'Schedule'>,
    CompositeNavigationProp<
        BottomTabNavigationProp<HomeStackTabParamList>,
        StackNavigationProp<DrawerStackParamList>
    >
>;

export type ScheduleScreenProps = {
    route: CalendarRouteProp;
    navigation: ScheduleScreenNavigationProp;
};

// CalendarScreen
export type CalendarRouteProp = RouteProp<CalendarStackParamList, 'Calendar'>;

export type CalendarScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<CalendarStackParamList, 'Calendar'>,
    CompositeNavigationProp<
        BottomTabNavigationProp<HomeStackTabParamList>,
        StackNavigationProp<DrawerStackParamList>
    >
>;

export type CalendarScreenProps = {
    route: CalendarRouteProp;
    navigation: CalendarScreenNavigationProp;
};

// TasksScreen
export type TasksRouteProp = RouteProp<CalendarStackParamList, 'Tasks'>;

export type TasksScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<CalendarStackParamList, 'Tasks'>,
    CompositeNavigationProp<
        BottomTabNavigationProp<HomeStackTabParamList>,
        StackNavigationProp<DrawerStackParamList>
    >
>;

export type TasksScreenProps = {
    route: TasksRouteProp;
    navigation: TasksScreenNavigationProp;
};

// LoginScreen
export type LoginRouteProp = RouteProp<AuthStackParamList, 'Login'>;

export type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export type LoginScreenProps = {
    route: LoginRouteProp;
    navigation: LoginScreenNavigationProp;
};

// RecoverLoginScreen
export type RecoverLoginRouteProp = RouteProp<AuthStackParamList, 'RecoverLogin'>;

export type RecoverLoginNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'RecoverLogin'
>;

export type RecoverLoginScreenProps = {
    route: RecoverLoginRouteProp;
    navigation: RecoverLoginNavigationProp;
};

// SignUpScreen
export type SignUpRouteProp = RouteProp<AuthStackParamList, 'SignUp'>;

export type SignUpNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

export type SignUpScreenProps = {
    route: SignUpRouteProp;
    navigation: SignUpNavigationProp;
};
