const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var studentArray = require('./InitialData');
var idCounter = studentArray.length + 1;

app.get('/api/student', (req, res) => {
    res.json(studentArray);
});

app.get('/api/student/:id', (req, res) => {
    var student = studentArray.find(s => s.id == req.params.id);
    if (!student) return res.status(404).send('The student with the given ID was not found.');
    res.json(student);
});

app.post('/api/student', (req, res) => {
    if (!req.body.name || !req.body.currentClass || !req.body.division) return res.status(400).send('Name, current class, and division are required.');
    var student = {
        id: idCounter++,
        name: req.body.name,
        currentClass: req.body.currentClass,
        division: req.body.division
    };
    studentArray.push(student);
    res.json({ id: student.id });
});

app.put('/api/student/:id', (req, res) => {
    var student = studentArray.find(s => s.id == req.params.id);
    if (!student) return res.status(404).send('The student with the given ID was not found.');
    if (!req.body.name) return res.status(400).send('Name is required for update.');
    student.name = req.body.name;
    res.json(student);
});

app.delete('/api/student/:id', (req, res) => {
    var studentIndex = studentArray.findIndex(s => s.id == req.params.id);
    if (studentIndex === -1) return res.status(404).send('The student with the given ID was not found.');
    studentArray.splice(studentIndex, 1);
    res.send(`Student with id ${req.params.id} was deleted.`);
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
