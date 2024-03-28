require("dotenv").config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
  
exports.getTextDescription = async function(prompt, gpt_model) {
    try{
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { 
                    role: 'user', 
                    content: prompt
                }
            ],
            model: gpt_model,
        });

        return chatCompletion.choices[0].message.content;
    }
    catch(err){
        if (err instanceof OpenAI.APIError) {
            console.log(err.status);
            console.log(err.name);
            console.log(err.error.message);
            return err.error.message;
        } else {
            return err.error.message;
        }
    };
}

exports.getImageDescription = async function(prompt, image_url, gpt_model) {
    console.log("inside");
    console.log(prompt);
    console.log(image_url);
    console.log(gpt_model);

    try{
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
        });
        
        return chatCompletion.choices[0].message.content;
    }
    catch(err){
        if (err instanceof OpenAI.APIError) {
            console.log(err.status);
            console.log(err.name);
            console.log(err.error.message);
            return err.error.message;
        } else {
            return err.error.message;
        }
    };
};