import * as dotenv from "dotenv";
dotenv.config();
import  express  from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// import { OpenAI } from "langchain";
import {ConversationChain} from "langchain/chains";
// import {PromptTemplate} from "langchain";
// import {LLMChain} from "langchain";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { HumanMessage, } from "langchain/schema";


app.get("/",async function(req,res){

    res.status(200).json("responce")


});




app.post("/api/chat",async function(req,res){
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
    res.status(200).json(responce)


});


app.listen(8000, () => {
    console.log( "server running ....");
  });