"""Simple OpenAI client wrapper for schema/visualization suggestions."""
import os
import json
from dotenv import load_dotenv
import openai

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY


class OpenAIClient:
    def __init__(self, model="gpt-4"):
        self.model = model

    def suggest_visualization(self, df_head):
        """Given a pandas DataFrame (head), ask the model to suggest a visualization JSON."""
        # convert to simple JSON
        try:
            sample = df_head.to_json(orient="records")
        except Exception:
            sample = str(df_head)
        prompt = (
            "You are a helpful assistant that receives a JSON array of records (a small table sample). "
            "Return a JSON object with keys: columns (list of {name,type}), suggested_chart (line/bar/scatter), "
            "x_column (name), y_columns (list), and a short rationale. Only return JSON.\n\n"
            f"Data sample: {sample[:3000]}"
        )
        resp = openai.ChatCompletion.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.0,
        )
        text = resp["choices"][0]["message"]["content"]
        # attempt to parse JSON
        try:
            return json.loads(text)
        except Exception:
            return {"raw": text}
