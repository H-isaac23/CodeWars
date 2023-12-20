const { exec } = require('child_process');
const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.get('/single', (req, res) => {
    res.status(200).send({ message: 'OK' });
});

app.post('/single', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).send({ message: 'Code not provided', status: false });
    }
    console.log(code);
    const filePath = 'temp.py';
    fs.writeFile(filePath, code, (err) => {
        if (err) {
            console.error(`Error writing file: ${err}`);
            return res.status(500).send({ message: 'Internal server error', status: false });
        }

        const command = `python ${filePath}`;

        const pythonProcess = exec(command, (error, stdout, stderr) => {
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Error deleting file: ${unlinkErr}`);
                }
            });

            if (error) {
                console.error(`Error executing Python script: ${error}`);
                return res.status(500).send({ message: 'Internal server error', status: false });
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).send({ message: 'Internal server error', status: false });
            }
            return res.status(200).send({ message: stdout, status: true });
        });
    });
});

app.listen(3003, () => {
    console.log('Server running on port 3003');
});
