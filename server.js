const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json())
app.use(express.static("website"));

const projectData = {}
const port = 8000;

app.listen(port, listening);
function listening() {
    console.log(`server running on port : ${port}`);
}

app.get("/getData", function (req, res) {
    console.log(projectData);
    res.send(projectData);
});

app.post("/setData", function (req, res) {
    projectData["temp"] = req.body.temp;
    projectData["date"] = req.body.date;
    projectData["content"] = req.body.content;
    res.sendStatus("200")
});
