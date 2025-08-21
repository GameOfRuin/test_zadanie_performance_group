import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Visibility } from '../migrations/dictionary';
import { UserEntity } from './user.entity';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'articles' })
export class ArticleEntity extends Model {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public text: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  public tags?: string[];

  @Column({
    type: DataType.ENUM(...Object.values(Visibility)),
    allowNull: false,
  })
  public visibility: Visibility;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public authorId: number;

  @BelongsTo(() => UserEntity, { as: 'author', foreignKey: 'authorId' })
  public author: UserEntity;
}
