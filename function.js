import * as dotenv from "dotenv";
dotenv.config();


import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory"; 
import { CharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";

// const { ConversationalRetrievalQAChain } = require("langchain/chains");
// const { ChatOpenAI } = require("langchain/chat_models/openai");
// const { BufferMemory } = require("langchain/memory");
// const { HNSWLib } = require("langchain/vectorstores/hnswlib");
// const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
// const { CharacterTextSplitter } = require("langchain/text_splitter");
// const fs = require("fs");


const prompt =`Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`
Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;

const model = new ChatOpenAI({
    temperature:0,
    modelName:"gpt-3.5-turbo",
})


const text = fs.readFileSync("data.txt", "utf8");
const textSplitter = new CharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

const memory =new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
  });


const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
        memory: memory,
        questionGeneratorChainOptions: {
            template: prompt,
          },
    },
    
);




const res1 = await chain.call({
    question:
    "iam navaras",
});

console.log(res1)

const res2 = await chain.call({
    question: "what is my job",
  });
  
  console.log(res2);