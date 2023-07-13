import { OpenAI } from "langchain";
import {PromptTemplate} from "langchain";
import {LLMChain} from "langchain";

import * as dotenv from "dotenv";
dotenv.config();



const template = "Who are you {question}"
const promptTemplate = new PromptTemplate({
    template:template,
    inputVariables:["question"]
})


const model = new OpenAI({
    
    temparature:0.9
})

const res = await model.call("Who are you")

console.log(res)