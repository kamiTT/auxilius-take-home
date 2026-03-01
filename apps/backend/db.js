const Sequelize = require('sequelize');

const sequelize = new Sequelize.Sequelize(
  process.env.PGDATABASE || 'auxilius_tasks',
  process.env.PGUSER || 'postgres',
  process.env.PGPASSWORD || 'postgres',
  {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    dialect: 'postgres',
    logging: false
  }
);

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.DataTypes.ENUM('to do', 'in progress', 'done'),
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: Sequelize.DataTypes.DATE,
      field: 'updated_at'
    }
  },
  {
    tableName: 'tasks',
    timestamps: true
  }
);

const User = sequelize.define(
  'User',
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: 'users',
    timestamps: false
  }
);

const toPlain = (item) => item.get({ plain: true });

const resultRows = (items) => items.map(toPlain);

const listTasks = async () => {
  const items = await Task.findAll({ order: [['createdAt', 'DESC']] });
  return { rows: resultRows(items) };
};

const getTaskById = async (id) => {
  const item = await Task.findByPk(id);
  return { rows: item ? [toPlain(item)] : [] };
};

const createTask = async (task) => {
  const item = await Task.create({
    title: task.title,
    description: task.description || null,
    status: task.status || 'to do'
  });
  return { rows: [toPlain(item)] };
};

const updateTask = async (id, fields) => {
  const item = await Task.findByPk(id);
  if (!item) {
    return { rows: [] };
  }
  const updated = await item.update(fields);
  return { rows: [toPlain(updated)] };
};

const deleteTask = async (id) => {
  const count = await Task.destroy({ where: { id } });
  return { rowCount: count };
};

const listUsers = async () => {
  const items = await User.findAll({ order: [['username', 'ASC']] });
  return { rows: resultRows(items) };
};

const getUserById = async (id) => {
  const item = await User.findByPk(id);
  return { rows: item ? [toPlain(item)] : [] };
};

const createUser = async (user) => {
  const [item, created] = await User.findOrCreate({
    where: { username: user.username },
    defaults: { username: user.username }
  });

  return { rows: [toPlain(item)], created };
};

const updateUser = async (id, fields) => {
  const item = await User.findByPk(id);
  if (!item) {
    return { rows: [] };
  }
  const updated = await item.update(fields);
  return { rows: [toPlain(updated)] };
};

const deleteUser = async (id) => {
  const count = await User.destroy({ where: { id } });
  return { rowCount: count };
};

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  sequelize
};
