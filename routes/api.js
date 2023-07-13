const express = require("express");
const router = express.Router();


// import { OpenAI } from "langchain";
import {ConversationChain} from "langchain/chains";
// import {PromptTemplate} from "langchain";
// import {LLMChain} from "langchain";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { HumanMessage, } from "langchain/schema";




router.get("/",async function(req,res){

    return res.status(200).json("responce")


});


router.post("/chat",async function(req,res){
    const { prompt } = req.body;

    const model = new ChatOpenAI({
        temperature:0,
        modelName:"gpt-3.5-turbo-0613",
    })
    const memory = new BufferMemory()
    const chain = new ConversationChain({
        llm:model,
        memory:memory
    })
    const responce = await model.call([new HumanMessage(prompt)])
    return res.status(200).json(responce)


});
