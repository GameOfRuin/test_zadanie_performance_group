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

@Table({ tableName: 'articles' })
export class ArticlesEntity extends Model {
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
  public article: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public tags?: string;

  @Column({
    type: DataType.ENUM(...Object.values(Visibility)),
    allowNull: false,
  })
  public visibility: string;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public authorId: number;

  @BelongsTo(() => UserEntity, { as: 'author', foreignKey: 'authorId' })
  public author: UserEntity;
}
