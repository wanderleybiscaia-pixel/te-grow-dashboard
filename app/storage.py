"""Simple SQLite storage for tables and source tracking."""
import os
import pandas as pd
from sqlalchemy import create_engine, text


class Storage:
    def __init__(self, database_url="sqlite:///./data/app_data.db"):
        self.database_url = database_url
        self.engine = create_engine(database_url, connect_args={"check_same_thread": False})
        # ensure sources table
        with self.engine.connect() as conn:
            conn.execute(text("CREATE TABLE IF NOT EXISTS sources (id INTEGER PRIMARY KEY, filename TEXT UNIQUE, created_at TEXT)"))

    def save_table(self, filename, df: pd.DataFrame):
        # save DataFrame to a table named after sanitized filename
        safe_name = "tbl_" + os.path.splitext(os.path.basename(filename))[0].replace("-", "_").replace(".", "_")
        try:
            df.to_sql(safe_name, self.engine, if_exists="append", index=False)
        except Exception:
            # try to coerce types
            df = df.astype(str)
            df.to_sql(safe_name, self.engine, if_exists="append", index=False)
        # register source
        with self.engine.begin() as conn:
            conn.execute(text("INSERT OR IGNORE INTO sources (filename, created_at) VALUES (:f, datetime('now'))"), {"f": filename})

    def list_sources(self):
        with self.engine.connect() as conn:
            res = conn.execute(text("SELECT filename, created_at FROM sources ORDER BY created_at DESC"))
            return [f"{r['filename']} — {r['created_at']}" for r in res]
