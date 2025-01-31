import { useState } from "react";

const OLLAMA_API_URL = "http://localhost:11434/api/generate";

export function useOllama() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async (prompt: string, model: string = "llama2") => {
    setLoading(true);
    try {
      const res = await fetch(OLLAMA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false
        }),
      });

      const data = await res.json();
      setResponse(data.response);
      return data.response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { response, sendPrompt, loading };
}