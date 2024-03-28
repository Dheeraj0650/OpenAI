const express = require("express");
const bodyParser = require("body-parser");
const chatGPT = require("./src/services/chat-gpt.js");
const canvas_service = require("./src/services/canvas-service.js");

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

app.post('/getImageDescription', async function(req, res){
    try{
        const body = req.body;
        const response = await chatGPT.getImageDescription("Create a textual description of the image with all of the information in it for a screen reader. Include word for word any words or sentences in the image.", body.image_url, body.model);
        res.send(response);
    }
    catch(err){
        res.send({error:"true", message: err.message});
    }
});

app.post('/getTextDescription', async function(req, res){
    try{
        const body = req.body;
        var url;

        if('canvas_page' in body){
            url = body.canvas_page.split(";")[0]
        }
        else if('assignment_url' in body){
            url = body.assignment_url.split(";")[0]
        }
        else if('topic_url' in body){
            url = body.topic_url.split(";")[0]
        }

        // let url = body.canvas_page.split(";")[0]
        const page = await canvas_service.curlGet(url);

        let message = `The image (i.e ${body.image_url}) description is ${body.img_desc} and the page where image present is ${page.body}. get me description of the image based on the context of the page where it present and to add it as an alternative text to image element. Give it in a single paragraph`
        let response = await chatGPT.getTextDescription(message, "gpt-3.5-turbo-1106");

        res.send(response);
    }   
    catch(err){
        res.send({error:"true", message: err.message});
    }
    // res.send('The image is a photograph of a red Tesla Model S, an all-electric vehicle, displayed at a slight angle showcasing its front and side profile. The vehicle is parked on a surface that appears to be compact sand or dirt, with vegetated dunes in the background under an overcast sky. The distinctive Tesla emblem, a stylized "T", is positioned centrally on the hood, and the car has tinted windows, black side-view mirrors, and a panoramic sunroof. The license plate features the words "ZERO EMISSIONS" and the wheels are a dark color with a multi-spoke pattern.')
});

app.listen(port, () => {
    console.log("server running on port 9003");
});