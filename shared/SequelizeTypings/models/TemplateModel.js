import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface TemplateAttributes extends CommonSequelizeAttributes {
  name: string;
  churchId?: number;
  data: any;
}

export interface TemplateInstance
  extends Sequelize.Instance<TemplateAttributes>,
    TemplateAttributes {}
