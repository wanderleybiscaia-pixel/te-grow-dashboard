"""Streamlit app: upload documentos, extrai, sugere dashboard e exibe gráficos."""
import os
from pathlib import Path
import streamlit as st
import pandas as pd
from dotenv import load_dotenv
from app.document_parsers import parse_file
from app.openai_client import OpenAIClient
from app.visualization import build_plotly_figure
from app.storage import Storage

load_dotenv()

DATA_FOLDER = os.getenv("DATA_FOLDER", "./data")
DB_URL = os.getenv("DATABASE_URL", "sqlite:///./data/app_data.db")

st.set_page_config(page_title="Doc → Dashboard", layout="wide")
st.title("Doc → Dashboard (protótipo)")

storage = Storage(DB_URL)
openai_client = OpenAIClient()

uploaded = st.file_uploader("Envie PDF / DOCX / XLSX / PPTX", accept_multiple_files=True)

if uploaded:
    all_tables = []
    for f in uploaded:
        st.write(f"Processando: {f.name}")
        parsed = parse_file(f)
        text_preview = parsed.get("text", "")
        if text_preview:
            st.text_area(f"Texto extraído — {f.name}", value=text_preview[:4000], height=200)
        tables = parsed.get("tables", [])
        for i, tbl in enumerate(tables):
            st.write(f"Tabela {i+1} de {f.name}")
            st.dataframe(tbl.head())
            all_tables.append({"file": f.name, "table": tbl})
            # persist basic table in sqlite
            storage.save_table(f.name, tbl)

    if all_tables:
        # For simplicity, concatenate tables that have compatible columns
        dfs = [t["table"] for t in all_tables]
        try:
            df = pd.concat(dfs, ignore_index=True)
        except Exception:
            # if concat fails, pick first
            df = dfs[0]
        st.subheader("Dados combinados")
        st.dataframe(df.head())

        # Ask OpenAI for simple schema suggestion (non-blocking)
        with st.spinner("Gerando sugestão de visualização com OpenAI..."):
            try:
                suggestion = openai_client.suggest_visualization(df.head(100))
            except Exception as e:
                suggestion = {"error": str(e)}
        st.write("Sugestão do modelo:", suggestion)

        cols = list(df.columns)
        if cols:
            left, right = st.columns([2, 1])
            with left:
                x = st.selectbox("Eixo X", cols)
                y = st.multiselect("Eixo(s) Y", cols, default=[c for c in cols if pd.api.types.is_numeric_dtype(df[c])][:1])
                chart_type = st.selectbox("Tipo de gráfico", ["line", "bar", "scatter"])
                height = st.slider("Altura (px)", 200, 1200, 400)
                width = st.slider("Largura (px)", 200, 1600, 800)
                if st.button("Gerar gráfico"):
                    fig = build_plotly_figure(df, x, y, chart_type, height=height, width=width)
                    st.plotly_chart(fig, use_container_width=False)
            with right:
                st.markdown("### Fontes")
                files = storage.list_sources()
                for s in files:
                    st.write(s)
else:
    st.info("Envie um ou mais arquivos para começar.")
