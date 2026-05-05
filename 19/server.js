require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const { Sequelize, DataTypes } = require('sequelize');

if (!process.env.DATABASE_URL) {
  console.error(
    'Missing DATABASE_URL. Copy .env.example to .env and set your connection string.',
  );
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error:', err));

const User = sequelize.define(
  'User',
  {
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    age: { type: DataTypes.INTEGER, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    underscored: true,
  },
);

sequelize.sync({ force: true });

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

app.patch('/users/:id', async (req, res) => {
  try {
    const user = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.send({ message: 'User deleted' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
