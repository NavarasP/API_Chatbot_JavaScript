import * as dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";

import * as fs from "fs";
import { CharacterTextSplitter } from "langchain/text_splitter";



const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
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
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

// const vectorStore = await HNSWLib.fromTexts(
//   [
//     "Mitochondria are the powerhouse of the cell",
//     "Foo is red",
//     "Bar is red",
//     "Buildings are made out of brick",
//     "Mitochondria are made of lipids",
//   ],
//   [{ id: 2 }, { id: 1 }, { id: 3 }, { id: 4 }, { id: 5 }],
//   new OpenAIEmbeddings()
// );


const text = fs.readFileSync("data.txt", "utf8");
const textSplitter = new CharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());



const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
    }),
    questionGeneratorChainOptions: {
      template: CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT,
    },
  }
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