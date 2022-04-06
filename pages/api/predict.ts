// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const banana = require("@banana-dev/banana-dev");

type Data =
  | {
      error: Record<string, any>;
    }
  | { message: string; res: Record<string, any> };

interface BananaResponse {
  id: string;
  message: string;
  created: number;
  apiVersion: string;
  modelOutputs: { input: string; output: string }[];
  callId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.query);
  if (req.query.psk !== process.env.PSK) {
    res.status(400).json({ error: { message: "Invalid PSK" } });
    console.log("Invalid PSK");
    return;
  }

  // TODO: if time, make length/temperature configurable with 3 options
  const modelParameters = {
    text: JSON.parse(req.body).text,
    length: 100,
    temperature: 0.35,
    batchSize: 1,
  };
  console.log(modelParameters);

  const out = (await banana.run(
    process.env.BANANA_API_KEY!,
    "gptj",
    modelParameters
  )) as BananaResponse;
  console.log(out);

  if (out?.message !== "success") {
    res.status(500).json({ error: out });
    return;
  }
  const o = out.modelOutputs[0].output;
  console.log(o);
  res.status(200).json({ message: o, res: out });
  return;
}
