require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI. Copy .env.example to .env.');
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    created_at: { type: Number, default: () => Date.now() },
    updated_at: { type: Number, default: () => Date.now() },
  },
  { versionKey: false },
);

const User = mongoose.model('User', userSchema);

const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
  try {
    const now = Date.now();
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age,
      created_at: now,
      updated_at: now,
    });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.patch('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated_at: Date.now(),
      },
      { new: true, runValidators: true },
    );
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('Connection error:', err);
    process.exit(1);
  });
