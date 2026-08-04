# PowerShell quick setup for Windows (run in repository root, PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
echo "Edite .env e insira OPENAI_API_KEY"
