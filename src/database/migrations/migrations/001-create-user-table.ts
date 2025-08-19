import { QueryInterface, Transaction } from 'sequelize';
import { DataType, Sequelize } from 'sequelize-typescript';
import { Columns, Tables } from '../dictionary';
import { wrapWithTransaction } from '../transaction-wrapper';

module.exports = {
  up: wrapWithTransaction(
    async (
      transaction: Transaction,
      queryInterface: QueryInterface,
      sequelize: Sequelize,
    ): Promise<void> => {
      return queryInterface.createTable(
        Tables.users,
        {
          [Columns.id]: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          [Columns.createdAt]: {
            type: DataType.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()'),
          },
          [Columns.updatedAt]: {
            type: DataType.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()'),
          },
          [Columns.name]: {
            type: DataType.STRING,
            allowNull: false,
          },
          [Columns.email]: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
          },
          [Columns.password]: {
            type: DataType.STRING,
            allowNull: false,
          },
        },
        { transaction },
      );
    },
  ),

  down: wrapWithTransaction(
    async (
      transaction: Transaction,
      queryInterface: QueryInterface,
      sequelize: Sequelize,
    ): Promise<void> => {
      return queryInterface.dropTable(Tables.users, { transaction });
    },
  ),
};
