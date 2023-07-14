const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const app = express();

const { ConversationalRetrievalQAChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { BufferMemory } = require("langchain/memory");
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
// const {Chroma} = require("langchain/vectorstores/chroma");
// const {MemoryVectorStore} = require("langchain/vectorstores/memory");

const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { CharacterTextSplitter } = require("langchain/text_splitter");
const fs = require("fs");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());




app.post("/api/chat",async function(req,res){
    const { rmessage } = req.body;

    
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
// const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());


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




const responce = await chain.call({question: rmessage,});

        
    res.status(200).json(responce)


});


app.listen(9000, () => {
    console.log( "server running ....");
  });