import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';

// Atributos
export interface VacationAttributes {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  approvedAt?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Atributos opcionais
export interface VacationCreationAttributes
  extends Optional<
    VacationAttributes,
    | 'id'
    | 'status'
    | 'requestedAt'
    | 'approvedAt'
    | 'notes'
    | 'createdAt'
    | 'updatedAt'
  > {}

// Classe que representa a linha da tabela
class Vacation
  extends Model<VacationAttributes, VacationCreationAttributes>
  implements VacationAttributes
{
  public id!: number;
  public userId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public totalDays!: number;
  public status!: 'pending' | 'approved' | 'rejected' | 'completed';
  public requestedAt!: Date;
  public approvedAt!: Date | null;
  public notes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializa o model ligando com a tabela vacations
Vacation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    requestedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'Vacation',
    tableName: 'vacations',
    timestamps: true,
  }
);

export default Vacation;
