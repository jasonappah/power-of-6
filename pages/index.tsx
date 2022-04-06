import type { NextPage } from "next";
import Head from "next/head";
import NProgress from "nprogress";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [res, setRes] = useState<
    { time: Date; input: string; output: string }[]
  >([]);
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Cannon Bard Theory</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          The Cannon-Bard Theory... <a href="https://banana.dev">with AI?</a>
        </h1>

        <p>
          Enter a scenario and let the AI model try to predict potential
          emotions and actions. An example has been provided in the box below.
        </p>

        <textarea ref={inputRef} defaultValue="I punch you." />
        <button
          onClick={async () => {
            NProgress.start();
            if (inputRef.current) {
              const input = inputRef.current.value;
              // const prompt = `You are an AI tasked with predicting a human's response to given text. How does the following scenario make you feel?\n\n${input}`;
              const prompt = `Q: You are an AI tasked with predicting a human's emotional response to given text. What would you do in response to the following scenario?\n\n${input}\n\nA:`;
              const req = await fetch(`/api/predict/?psk=${router.query.psk}`, {
                body: JSON.stringify({
                  text: prompt,
                }),
                method: "POST",
              });
              const output = await req.json();
              if (output.error) {
                alert(JSON.stringify(output.error));
              } else {
                setRes([
                  { time: new Date(), input, output: output.message },
                  ...res,
                ]);
              }
            }
            NProgress.done();
          }}
        >
          Predict!
        </button>

        <hr></hr>
        <h2>Responses</h2>
        {res.length > 0 ? (
          res.map((r) => (
            <>
              <h3>
                {r.time.toLocaleDateString()} {r.time.toLocaleTimeString()}
              </h3>
              <h4>Prompt: {r.input}</h4>
              <p>{r.output}</p>
            </>
          ))
        ) : (
          <p>
            <i>
              No predictions yet. Enter a prompt and press &apos;Predict&apos;.
            </i>
          </p>
        )}
      </main>

      <footer>
        <p>
          DISCLAIMER: I take no responsibility for unexpected results produced
          by the model as I have limited control of its outputs.
        </p>
        <a href="https://jasonaa.me" target="_blank" rel="noreferrer">
          Built by Jason Antwi-Appah
        </a>
      </footer>
    </div>
  );
};

export default Home;
