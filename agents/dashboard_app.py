# agents/dashboard_app.py
# Streamlit app: dashboard com upload/carga de SQLite, plot interativo (Plotly) e downloads (CSV/HTML/PNG)
# Uso:
# - Executar: streamlit run agents/dashboard_app.py
# - Requisitos: streamlit, pandas, plotly, kaleido

import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
import io
import os

st.set_page_config(page_title="TE Grow Dashboard", layout="wide")
st.title("TE Grow — Dashboard")

st.markdown("Carregue um CSV ou selecione um banco SQLite para visualizar e exportar gráficos.")

# Fonte de dados: upload CSV ou arquivo SQLite local (configurável)
data_source = st.radio("Fonte de dados:", ("Upload CSV", "Arquivo SQLite (no repositório ou caminho)"))

df = None

if data_source == "Upload CSV":
    uploaded = st.file_uploader("Envie um arquivo CSV", type=["csv"])
    if uploaded is not None:
        df = pd.read_csv(uploaded)
        st.success(f"CSV carregado: {uploaded.name} — {len(df)} linhas")
else:
    sqlite_path = st.text_input("Caminho do arquivo SQLite (ex: data/dados.db)", value="data/dados.db")
    if st.button("Carregar SQLite"):
        if os.path.exists(sqlite_path):
            try:
                conn = sqlite3.connect(sqlite_path)
                tables = pd.read_sql("SELECT name FROM sqlite_master WHERE type='table';", conn)
                table_list = tables['name'].tolist()
                st.write("Tabelas encontradas:", table_list)
                table_choice = st.selectbox("Escolha a tabela", table_list)
                if table_choice:
                    df = pd.read_sql(f"SELECT * FROM `{table_choice}` LIMIT 20000", conn)
                    st.success(f"Tabela '{table_choice}' carregada — {len(df)} linhas")
                conn.close()
            except Exception as e:
                st.error(f"Erro ao abrir SQLite: {e}")
        else:
            st.warning(f"Arquivo não encontrado em: {sqlite_path}")

if df is None:
    st.info("Aguardando dados (CSV enviado ou SQLite carregado).")
    st.stop()

# Visualizar dados
if st.checkbox("Mostrar tabela de dados"):
    st.dataframe(df)

# Selecione colunas para plot
numeric_cols = df.select_dtypes(include=["number"]).columns.tolist()
all_cols = df.columns.tolist()

if not numeric_cols:
    st.error("Não há colunas numéricas para plotar.")
    st.stop()

col1, col2 = st.columns([2,1])
with col1:
    x_col = st.selectbox("Eixo X (qualquer coluna)", all_cols, index=0)
    y_col = st.selectbox("Eixo Y (coluna numérica)", numeric_cols, index=0)
    color_col = st.selectbox("Color (opcional)", [None] + all_cols, index=0)
    chart_type = st.selectbox("Tipo de gráfico", ["line", "scatter", "bar", "area"]) 

with col2:
    sample_size = st.slider("Amostra (0 = tudo)", min_value=0, max_value=min(50000, len(df)), value=0, step=100)
    if sample_size > 0:
        plot_df = df.sample(sample_size, random_state=1)
    else:
        plot_df = df.copy()
    st.write(f"Linhas para plot: {len(plot_df)}")

# Gerar figura com Plotly
try:
    if chart_type == "line":
        fig = px.line(plot_df, x=x_col, y=y_col, color=color_col, title=f"{chart_type} - {y_col} vs {x_col}")
    elif chart_type == "scatter":
        fig = px.scatter(plot_df, x=x_col, y=y_col, color=color_col, title=f"{chart_type} - {y_col} vs {x_col}")
    elif chart_type == "bar":
        fig = px.bar(plot_df, x=x_col, y=y_col, color=color_col, title=f"{chart_type} - {y_col} vs {x_col}")
    elif chart_type == "area":
        fig = px.area(plot_df, x=x_col, y=y_col, color=color_col, title=f"{chart_type} - {y_col} vs {x_col}")
    else:
        fig = px.line(plot_df, x=x_col, y=y_col, color=color_col)
except Exception as e:
    st.error(f"Erro ao criar figura: {e}")
    st.stop()

st.plotly_chart(fig, use_container_width=True)

# Download: CSV
csv_bytes = plot_df.to_csv(index=False).encode("utf-8")
st.download_button("Download dos dados (CSV)", data=csv_bytes, file_name="dados_plot.csv", mime="text/csv")

# Download: HTML interativo
html_bytes = fig.to_html(include_plotlyjs="cdn").encode("utf-8")
st.download_button("Download do gráfico interativo (HTML)", data=html_bytes, file_name="grafico_interativo.html", mime="text/html")

# Download: PNG (requer kaleido)
st.markdown("### Download PNG (requer 'kaleido' instalado no ambiente do Streamlit)")
try:
    png_bytes = fig.to_image(format="png", engine="kaleido")
    st.download_button("Download imagem (PNG)", data=png_bytes, file_name="grafico.png", mime="image/png")
except Exception as e:
    st.warning("Exportação PNG não disponível. Instale 'kaleido' no ambiente (pip install kaleido) ou veja logs do servidor.")
    st.write(e)

st.caption("Observação: para exportar PNG no servidor, garanta que 'kaleido' esteja instalado no mesmo ambiente de execução do Streamlit.")
