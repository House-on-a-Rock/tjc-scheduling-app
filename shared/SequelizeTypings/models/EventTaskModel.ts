import * as Sequelize from 'sequelize';
import { EventAttributes } from './EventModel';
import { TaskAttributes } from './TaskModel';

export interface EventTaskAttributes {
    id?: number;
    eventId?: EventAttributes | EventAttributes['id'];
    taskId?: TaskAttributes | TaskAttributes['id'];
}

export interface EventTaskInstance extends Sequelize.Instance<EventTaskAttributes>, EventTaskAttributes {}
