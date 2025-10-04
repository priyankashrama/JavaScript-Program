const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const DATA_FILE = 'users.json';

const readUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE));
    } catch {
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

app.get('/users', (req, res) => {
    res.json(readUsers());
});

app.get('/users/:id', (req, res) => {
    const user = readUsers().find(u => u.id === parseInt(req.params.id));
    user ? res.json(user) : res.status(404).json({ message: 'User not found' });
});

app.post('/users', (req, res) => {
    const users = readUsers();
    const newUser = req.body;
    newUser.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        Object.assign(user, req.body);
        writeUsers(users);
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.delete('/users/:id', (req, res) => {
    let users = readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        users = users.filter(u => u.id !== user.id);
        writeUsers(users);
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
