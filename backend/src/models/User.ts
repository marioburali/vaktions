import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';

// atributos existentes na tabela "users"
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  occupation?: string;
  hiredAt: Date;
  availableVacationDays: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// O Optional indica quais campos não são obrigatórios na criação
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'user';
  public occupation!: string;
  public hiredAt!: Date;
  public availableVacationDays!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },

    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    hiredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    availableVacationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
