# Human-AI Interaction Backend
This project contains the backend for the application we develop in the 'Human-AI Interaction' course.

# Getting Started
This project uses `uv` for dependency management. `uv` is a new tool for dependency management that simplifies a lot of things. Please refrain from using `pip`, `conda` or similar.

If you have never heard of `uv` and don't have it installed, you can install it using:
```sh
curl -LsSf https://astral.sh/uv/install.sh | sh                                     # macOS and Linux
```
or
```sh
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"  # Windows
```

## Environment Configuration

Runtime configuration is handled via environment variables prefixed with `HAI_`. Copy the provided template and adjust values for your environment:

```sh
cp .env.template .env
# edit .env to set secrets like HAI_JWT_SECRET, admin credentials, DB URL, etc.
```

The app loads `.env` automatically (see `app/config.py`), so `uv run main.py` and all tests will pick up your configuration without extra flags.

## Adding Dependencies
After installing `uv`, you can install the dependencies using `uv sync` and are good to go.

If you need to add or remove dependencies you can do so by calling `uv add <dependency>` or `uv remove <dependency>`. 
This automatically adds the dependency to `dependencies` in `pyproject.toml` and `uv.lock`. If someone else wants to get the newest state of the project he can just run `uv sync` again.

Refrain from using `pip install`.

## Running Scripts
Scripts can and should be run using `uv run <script-name>`. 

Refrain from using `python <script-name>` or similar.

# Contributions
We enforce consistent formatting using `ruff` and consistent typing using `mypy`. Both will be checked on every Pull Request.
You can check for possible typing errors using:
```sh
uv run mypy .
```
Typing errors need to be fixed **manually**.

You can check for possible formatting errors using:
```sh
uv run ruff format && uv run ruff check --fix
```
If this did not fix all formatting issues, you need to fix the remaining ones manually.
