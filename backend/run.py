import os
import sys
import time
import webbrowser
import threading
import socket
from pathlib import Path
import base64

BASE_DIR = Path(__file__).resolve().parent
VENV_PY = None

if os.name == "nt":
    cand = BASE_DIR / "venv" / "Scripts" / "python.exe"
else:
    cand = BASE_DIR / "venv" / "bin" / "python"
if cand.exists():
    VENV_PY = str(cand)

python_exec = VENV_PY or sys.executable

def _ensure_icons():
    # Ensure small PNG icons exist under static/images to avoid broken links
    images_dir = BASE_DIR / "analyzer" / "static" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    icons = {
        "stats.png": b"iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAF0lEQVQoU2NkYGD4z8DAwMDEgAEAGmQBjz7iY1EAAAAASUVORK5CYII=",
        "outlier.png": b"iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVQoU2NkYGBg+M/AwMDAwIgBQC4bAZw8o8S6AAAAAElFTkSuQmCC",
        "graph.png": b"iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFElEQVQoU2NkYGBg+M8ABRgYGBgAAEUCAathp5yUAAAAAElFTkSuQmCC",
    }
    for name, b64 in icons.items():
        out_path = images_dir / name
        if not out_path.exists():
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(b64))

def _port_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", port)) != 0

def main():
    _ensure_icons()

    # Prefer 8000, otherwise use 8001
    port = 8000 if _port_free(8000) else 8001
    url = f"http://127.0.0.1:{port}/"

    # Open browser slightly after server start
    def _open():
        time.sleep(2)
        try:
            webbrowser.open(url)
        except Exception:
            pass

    threading.Thread(target=_open, daemon=True).start()

    # Use os.system for simplicity, as requested
    os.chdir(str(BASE_DIR))
    os.system(f"\"{python_exec}\" manage.py runserver 0.0.0.0:{port}")


if __name__ == "__main__":
    main()
