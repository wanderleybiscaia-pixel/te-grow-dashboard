"""Helpers to build Plotly figures from dataframes."""
import plotly.express as px


def build_plotly_figure(df, x, ys, chart_type="line", height=400, width=800):
    # simple dispatcher
    if not isinstance(ys, list):
        ys = [ys]
    if chart_type == "line":
        fig = px.line(df, x=x, y=ys)
    elif chart_type == "bar":
        fig = px.bar(df, x=x, y=ys)
    elif chart_type == "scatter":
        if len(ys) >= 2:
            fig = px.scatter(df, x=x, y=ys[0])
        else:
            fig = px.scatter(df, x=x, y=ys)
    else:
        fig = px.line(df, x=x, y=ys)
    fig.update_layout(height=height, width=width)
    return fig
