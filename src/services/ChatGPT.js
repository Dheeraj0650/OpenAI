require("dotenv").config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
  
exports.getTextDescription = async function(prompt, gpt_model) {

    const chatCompletion = await openai.chat.completions.create({
        messages: [
            { 
                role: 'user', 
                content: 'Say this is a test' 
            }
        ],
        model: gpt_model,
    })
    .catch(async (err) => {
        if (err instanceof OpenAI.APIError) {
            console.log(err.status);
            console.log(err.name);
            console.log(err.headers);
        } else {
        throw err;
        }
    });

    return chatCompletion.choices[0].message.content;
}

exports.getImageDescription = async function(prompt, image_url, gpt_model) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text", 
                        "text": prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                        },
                    },
                ],
            }
        ],
        model: gpt_model,
    })    
    .catch(async (err) => {
        if (err instanceof OpenAI.APIError) {
            console.log(err.status);
            console.log(err.name);
            console.log(err.headers);
        } else {
            throw err;
        }
    });;

    return chatCompletion.choices[0].message.content;
}