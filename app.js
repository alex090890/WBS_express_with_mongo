const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser'); // Require body-parser module
const cors = require('cors');
const { body } = require('express-validator');
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = process.env.PORT || 3000;
app.use(express.json());

const { MongoClient } = require("mongodb");
const { Schema } = require('mongoose');

const uri = "mongodb+srv://alexprofteach:LelXsU5uJBN1pdDj@cluster0.hpm4bkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log(uri);

const client = new MongoClient(uri);
const dbname = "users";


const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to database: ${dbname}`);
  } catch (e) {
    console.error(e);
  }
};

const main = async () => {
    await connectToDatabase();
    const database = client.db(dbname);
    const collection = database.collection("users");
    const user = { name: "John", last_name: "Doe", email: "john@doe.com" };
    const result = await collection.insertOne(user);
    console.log(`New user created with the following id: ${result.insertedId}`);  
};

main();

mongoose.connect(uri);


const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

const Student = mongoose.model('Student', StudentSchema);
app.post('/students', async (req, res) => {
  const { name, first_name, email } = req.body;

  try {
    const newStudent = new Student({ name, first_name, email });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/students', async (req, res) => {
  try {
    await Student.updateMany({ name: 'John' }, { $set: { name: 'Bob' } });
    res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});