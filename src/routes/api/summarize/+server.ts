import { json } from '@sveltejs/kit';
import { OpenAI } from 'openai';
import { API_KEY, ENV, MODEL_VER } from '$env/static/private';
import { encoding_for_model } from "tiktoken";
const TOKEN_LIMIT = 2000;

export async function POST({ request } : any) {
  const contents = await request.json();
  console.debug("POST to api/summarizer")
  const result = await summarizeText(contents.input)
	return json({result: result}, { status: 200 });
}

function partitionInput(input: string, partitionSize: number = TOKEN_LIMIT) {
  let partitions = [];
  const inputLength =  input.length;
  for (let i = 0; i < inputLength; i += partitionSize) {
    partitions.push(input.substring(i, i + partitionSize));
  }

  return partitions;
}

async function summarizeText(input: string, temperature: number = 0.5, maxTokens: number = TOKEN_LIMIT) {
  const encoding = encoding_for_model("gpt-3.5-turbo");
  const numberOfTokens = encoding.encode(input).length;
  
  console.debug("input token length", numberOfTokens);
  console.debug("input character length:", input.length);

  if (numberOfTokens <= TOKEN_LIMIT) {
    return await summarize(input, temperature, maxTokens);
  } else {
    console.log("Token limit exceeded. Splitting input...");
    let result = "";
    // 1 token ~= 4 characters
    const partitionedText = partitionInput(input, maxTokens * 4);

    console.log('number of partitions:', partitionedText.length);    
    for (const partition of partitionedText) {
      result += await summarize(partition, temperature, maxTokens);
    }
    return result;
  }
}

async function summarize(input: string, temperature: number = 0.5, maxTokens: number = TOKEN_LIMIT) {
  const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: ENV === "LOCAL" ? true : false
  });
  let result = null;

  if (input) {
    const response = await openai.chat.completions.create({
      model: MODEL_VER,
      messages: [
        {
          role: "system",
          content:
            `Please summarize the following by making it much more shorter to read and easier to understand: ${input}`,
        },
      ],
      temperature: temperature,
      max_tokens: maxTokens,
    });
    result = response.choices.at(0)?.message.content;
    console.debug("usage: ", response.usage);
  } else {
    console.warn("Nothing to summarize.")
  }
  return result;
}