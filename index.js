const express = require("express");
const bodyParser = require("body-parser");
const chatGPT = require("./src/services/ChatGPT.js");

const app = express();

const port = process.env.PORT || 9003;

app.use(express.static(__dirname + "/build"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/', async function(req, res){

    res.json({
        message: "server is up and running"
    });
});

app.listen(port, () => {
    console.log("server running on port 9003");
});