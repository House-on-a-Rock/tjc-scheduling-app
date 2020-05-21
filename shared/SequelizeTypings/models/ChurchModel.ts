import * as Sequelize from 'sequelize';

export interface ChurchAttributes {
    id?: number;
    name: string;
    address: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ChurchInstance
    extends Sequelize.Instance<ChurchAttributes>,
        ChurchAttributes {}
