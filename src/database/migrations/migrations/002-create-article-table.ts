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
        Tables.articles,
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
          [Columns.title]: {
            type: DataType.STRING,
            allowNull: false,
          },
          [Columns.tags]: {
            type: DataType.STRING,
            allowNull: false,
          },
          [Columns.description]: {
            type: DataType.STRING,
            allowNull: true,
          },
          [Columns.article]: {
            type: DataType.STRING,
            allowNull: false,
          },
          [Columns.authorId]: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
              model: Tables.users,
              key: Columns.id,
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
      return queryInterface.dropTable(Tables.articles, { transaction });
    },
  ),
};
