import * as Sequelize from 'sequelize';

export interface EventAttributes {
    id?: number;
    time: Date;
    tag: string;
}

export interface EventInstance extends Sequelize.Instance<EventAttributes>, EventAttributes {}
