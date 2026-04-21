import Replicate from "replicate";
import { ReplicateStream, StreamingTextResponse } from "ai";
// Note: runtime is NOT set to "edge" so that local Ollama (localhost) connections work

const VERSIONS = {
  "yorickvp/llava-13b":
    "e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358",
  "nateraw/salmonn":
    "ad1d3f9d2bd683628242b68d890bef7f7bd97f738a7c2ccbf1743a594c723d83",
  "lucataco/videollama3-7b":
    "34a1f45f7068f7121a5b47c91f2d7e06c298850767f76f96660450a0a3bd5bbe",
};

export async function POST(req) {
  const params = await req.json();

  // ── Local Ollama provider ─────────────────────────────────────────────────
  if (params.provider === "ollama") {
    try {
      return await runOllama({ ...params });
    } catch (err) {
      const errMsg = err?.message || String(err);
      if (errMsg.toLowerCase().includes("fetch failed") || errMsg.toLowerCase().includes("econnrefused")) {
        return new Response(
          JSON.stringify({
            error: "ollama_offline",
            detail: "Não foi possível conectar ao Ollama. Certifique-se de que ele está rodando com 'ollama serve'.",
          }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // ── Replicate (cloud) provider ────────────────────────────────────────────
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for");
  if (!ip) {
    console.error("IP address is null");
    return new Response("IP address could not be retrieved", { status: 500 });
  }

  params.replicateClient = new Replicate({
    auth: params.replicateApiToken,
    userAgent: "llama-chat",
  });

  let response;
  try {
    if (params.video) {
      response = await runVideoLlama(params);
    } else if (params.image) {
      response = await runLlava(params);
    } else if (params.audio) {
      response = await runSalmonn(params);
    } else {
      response = await runLlama(params);
    }

    const stream = await ReplicateStream(response);
    return new StreamingTextResponse(stream);
  } catch (err) {
    const errMsg = err?.message || String(err);
    if (errMsg.includes("402") || errMsg.toLowerCase().includes("insufficient credit")) {
      return new Response(
        JSON.stringify({
          error: "insufficient_credit",
          detail: "Sua conta no Replicate não tem créditos suficientes. Acesse https://replicate.com/account/billing para adicionar saldo.",
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }
    if (errMsg.includes("429") || errMsg.toLowerCase().includes("too many requests")) {
      const retryMatch = errMsg.match(/"retry_after":(\d+)/);
      const retryAfter = retryMatch ? retryMatch[1] : "alguns";
      return new Response(
        JSON.stringify({
          error: "rate_limited",
          detail: `Muitas requisições. Aguarde ${retryAfter} segundos antes de tentar novamente.`,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    console.error("API Error:", errMsg);
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ── Ollama (local) ─────────────────────────────────────────────────────────
async function runOllama({ ollamaUrl, ollamaModel, prompt, systemPrompt, maxTokens, temperature, topP, image }) {
  const baseUrl = (ollamaUrl || "http://localhost:11434").replace(/\/$/, "");
  const model = ollamaModel || "llama3";

  console.log("running ollama locally:", model, "at", baseUrl);

  // Extract base64 from data URI if image is provided
  let imagesPayload;
  if (image) {
    const base64 = image.includes(",") ? image.split(",")[1] : image;
    imagesPayload = [base64];
    console.log("ollama: image attached, using vision mode");
  }

  const res = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
      stream: true,
      ...(imagesPayload ? { images: imagesPayload } : {}),
      options: {
        temperature,
        top_p: topP,
        num_predict: maxTokens,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }

  // Transform Ollama's NDJSON stream into a plain text stream
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) { controller.close(); break; }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete line
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.response) {
              controller.enqueue(encoder.encode(json.response));
            }
            if (json.done) { controller.close(); return; }
          } catch { /* skip malformed lines */ }
        }
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// ── Replicate helpers ──────────────────────────────────────────────────────
async function runLlama({ replicateClient, model, prompt, systemPrompt, maxTokens, temperature, topP }) {
  console.log("running llama");
  console.log("model", model);
  console.log("maxTokens", maxTokens);

  return await replicateClient.predictions.create({
    model: model,
    stream: true,
    input: {
      prompt: `${prompt}`,
      ...(model.includes("llama3")
        ? { max_tokens: maxTokens }
        : { max_new_tokens: maxTokens }),
      temperature: temperature,
      repetition_penalty: 1,
      top_p: topP,
    },
  });
}

async function runLlava({ replicateClient, prompt, maxTokens, temperature, topP, image }) {
  console.log("running llava");

  return await replicateClient.predictions.create({
    stream: true,
    input: {
      prompt: `${prompt}`,
      top_p: topP,
      temperature: temperature,
      max_tokens: maxTokens,
      image: image,
    },
    version: VERSIONS["yorickvp/llava-13b"],
  });
}

async function runSalmonn({ replicateClient, prompt, maxTokens, temperature, topP, audio }) {
  console.log("running salmonn");

  return await replicateClient.predictions.create({
    stream: true,
    input: {
      prompt: `${prompt}`,
      top_p: topP,
      temperature: temperature,
      max_length: maxTokens,
      wav_path: audio,
    },
    version: VERSIONS["nateraw/salmonn"],
  });
}

async function runVideoLlama({ replicateClient, prompt, maxTokens, temperature, topP, video }) {
  console.log("running videollama");

  return await replicateClient.predictions.create({
    stream: true,
    input: {
      prompt: `${prompt}`,
      video: video,
    },
    version: VERSIONS["lucataco/videollama3-7b"],
  });
}
