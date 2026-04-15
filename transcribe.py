# -*- coding: utf-8 -*-
import threading
import shutil
import os
import subprocess
import time
import base64
from pathlib import Path

try:
    from tkinterdnd2 import DND_FILES, TkinterDnD
    import tkinter as tk
    from tkinter import ttk, messagebox
    HAS_DND = True
except ImportError:
    import tkinter as tk
    from tkinter import ttk, messagebox
    HAS_DND = False


BG    = "#f5f5f5"
BLUE  = "#2962ff"
GREEN = "#2e7d32"

SUPPORTED_EXTENSIONS = {
    ".mp4", ".mkv", ".avi", ".mov", ".wmv", ".webm", ".flv",
    ".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac", ".wma"
}

CONFIG_FILE = Path(__file__).parent / "config.txt"  # stores mode only (not sensitive)


def get_ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"

def is_youtube_url(text):
    return any(x in text for x in ['youtube.com', 'youtu.be'])

def clean_drop_path(raw):
    raw = raw.strip()
    if raw.startswith("{") and raw.endswith("}"):
        raw = raw[1:-1]
    return raw.strip('"')

def load_key(service):
    try:
        import keyring
        return keyring.get_password(f"תמלול_{service}", "api_key") or ""
    except Exception:
        return ""

def save_key(service, key):
    import keyring
    keyring.set_password(f"תמלול_{service}", "api_key", key)

def load_secret(name):
    """Load any secret value from keyring (api keys, endpoint IDs, etc.)"""
    try:
        import keyring
        return keyring.get_password("תמלול_config", name) or ""
    except Exception:
        return ""

def save_secret(name, value):
    import keyring
    keyring.set_password("תמלול_config", name, value)

def load_mode():
    if not CONFIG_FILE.exists():
        return "groq"
    return CONFIG_FILE.read_text(encoding='utf-8').strip() or "groq"

def save_mode(mode):
    CONFIG_FILE.write_text(mode, encoding='utf-8')


class TranscribeApp:
    def __init__(self, root):
        self.root = root
        self.root.title("מערכת תמלול")
        self.root.geometry("480x420")
        self.root.resizable(False, False)
        self.root.configure(bg=BG)

        self.source = ""
        self.mode = tk.StringVar(value=load_mode())
        self._build_input_ui()

    def _build_input_ui(self):
        self.input_frame = tk.Frame(self.root, bg=BG)
        self.input_frame.pack(fill="both", expand=True)

        tk.Label(self.input_frame, text="מערכת תמלול", font=("Arial", 15, "bold"),
                 bg=BG, fg="#222").pack(pady=(14, 6))

        # Mode toggle
        mode_frame = tk.Frame(self.input_frame, bg=BG)
        mode_frame.pack(pady=(0, 6))
        for value, label in [("groq", "Groq (ענן)"), ("runpod", "ivrit.ai — RunPod")]:
            tk.Radiobutton(mode_frame, text=label, variable=self.mode, value=value,
                           font=("Arial", 10), bg=BG, command=self._on_mode_change
                           ).pack(side="left", padx=14)

        # Credentials frame (swaps based on mode)
        self.creds_frame = tk.Frame(self.input_frame, bg=BG)
        self.creds_frame.pack(pady=(0, 8))
        self._build_creds()

        # Drop zone
        self.drop_label = tk.Label(
            self.input_frame,
            text="📄\n\nגרור קובץ וידאו / אודיו לכאן",
            font=("Arial", 11), bg="white", fg="#aaa",
            width=46, height=5, relief="groove", bd=2, cursor="hand2"
        )
        self.drop_label.pack(padx=28, fill="x")

        if HAS_DND:
            self.drop_label.drop_target_register(DND_FILES)
            self.drop_label.dnd_bind('<<Drop>>', self._on_drop)
            self.drop_label.dnd_bind('<<DragEnter>>', lambda e: self._set_drop_style("hover"))
            self.drop_label.dnd_bind('<<DragLeave>>', lambda e: self._set_drop_style("idle"))

        # Divider
        div = tk.Frame(self.input_frame, bg=BG)
        div.pack(fill="x", padx=28, pady=(8, 5))
        tk.Frame(div, bg="#ccc", height=1).pack(fill="x", side="left", expand=True, pady=6)
        tk.Label(div, text="  או הכנס קישור יוטיוב  ", font=("Arial", 8),
                 bg=BG, fg="#999").pack(side="left")
        tk.Frame(div, bg="#ccc", height=1).pack(fill="x", side="left", expand=True, pady=6)

        self.url_var = tk.StringVar()
        tk.Entry(self.input_frame, textvariable=self.url_var,
                 font=("Arial", 10), relief="solid", bd=1
                 ).pack(fill="x", padx=28, ipady=5)

        self.start_btn = tk.Button(self.input_frame, text="תמלל",
                                   font=("Arial", 12, "bold"),
                                   bg=BLUE, fg="white", relief="flat",
                                   padx=30, pady=7, cursor="hand2",
                                   command=self._on_start)
        self.start_btn.pack(pady=(10, 0))

    def _build_creds(self):
        for w in self.creds_frame.winfo_children():
            w.destroy()

        if self.mode.get() == "groq":
            self.key_var = tk.StringVar(value=load_key("groq"))
            self._key_row(self.creds_frame, "מפתח Groq API:", self.key_var)
        else:
            self.key_var = tk.StringVar(value=load_key("runpod"))
            self.endpoint_var = tk.StringVar(value=load_secret("runpod_endpoint"))
            self._key_row(self.creds_frame, "RunPod API Key:", self.key_var)
            ep_row = tk.Frame(self.creds_frame, bg=BG)
            ep_row.pack(pady=(4, 0))
            tk.Label(ep_row, text="Endpoint ID:     ", font=("Arial", 9), bg=BG, fg="#555").pack(side="left")
            tk.Entry(ep_row, textvariable=self.endpoint_var,
                     font=("Arial", 9), width=22, relief="solid", bd=1
                     ).pack(side="left", ipady=3)

    def _key_row(self, parent, label, var):
        row = tk.Frame(parent, bg=BG)
        row.pack()
        tk.Label(row, text=label, font=("Arial", 9), bg=BG, fg="#555").pack(side="left")
        entry = tk.Entry(row, textvariable=var, show="*", font=("Arial", 9),
                         width=24, relief="solid", bd=1)
        entry.pack(side="left", padx=(4, 4), ipady=3)
        entry.bind("<Control-v>", lambda e: (var.set(self.root.clipboard_get()), "break"))
        tk.Button(row, text="הדבק", font=("Arial", 8), relief="flat", bg="#ddd",
                  cursor="hand2", command=lambda: var.set(self.root.clipboard_get())
                  ).pack(side="left")

    def _on_mode_change(self):
        self._build_creds()

    def _set_drop_style(self, state):
        styles = {
            "idle":  ("white",   "#aaa",  "📄\n\nגרור קובץ וידאו / אודיו לכאן"),
            "hover": ("#e8eeff", BLUE,    "📄\n\nשחרר כאן"),
            "file":  ("#e8f5e9", GREEN,   f"✓\n\n{Path(self.source).name}" if self.source else "✓"),
        }
        bg, fg, text = styles[state]
        self.drop_label.config(bg=bg, fg=fg, text=text)

    def _on_drop(self, event):
        path = clean_drop_path(event.data)
        if not path:
            return
        if Path(path).suffix.lower() not in SUPPORTED_EXTENSIONS:
            messagebox.showwarning("סוג קובץ לא נתמך",
                                   f"'{Path(path).name}' אינו קובץ וידאו או אודיו.",
                                   parent=self.root)
            return
        self.source = path
        self.url_var.set("")
        self._set_drop_style("file")

    # ------------------------------------------------------------------ #
    #  Progress UI
    # ------------------------------------------------------------------ #
    def _show_progress_ui(self):
        self.input_frame.pack_forget()
        self.prog_frame = tk.Frame(self.root, bg=BG)
        self.prog_frame.pack(fill="both", expand=True)

        tk.Label(self.prog_frame, text="מתמלל...", font=("Arial", 14, "bold"),
                 bg=BG, fg="#222").pack(pady=(30, 12))

        self.status_var = tk.StringVar(value="מתחיל...")
        tk.Label(self.prog_frame, textvariable=self.status_var,
                 font=("Arial", 10), bg=BG, fg="#555").pack()

        self.progressbar = ttk.Progressbar(self.prog_frame, length=380,
                                           mode="indeterminate", maximum=100)
        self.progressbar.pack(pady=(12, 4), padx=40)
        self.progressbar.start(12)

    def _update_status(self, text):
        self.root.after(0, lambda: self.status_var.set(text))

    # ------------------------------------------------------------------ #
    #  Start
    # ------------------------------------------------------------------ #
    def _on_start(self):
        url = self.url_var.get().strip()
        source = url if url else self.source

        if not source:
            messagebox.showwarning("שים לב", "גרור קובץ או הכנס קישור יוטיוב.", parent=self.root)
            return

        key = self.key_var.get().strip()
        if not key:
            messagebox.showwarning("חסר מפתח", "הכנס מפתח API.", parent=self.root)
            return

        mode = self.mode.get()
        if mode == "runpod" and not self.endpoint_var.get().strip():
            messagebox.showwarning("חסר Endpoint", "הכנס Endpoint ID של RunPod.", parent=self.root)
            return

        # Save credentials (all encrypted in keyring)
        save_key(mode, key)
        if mode == "runpod":
            save_secret("runpod_endpoint", self.endpoint_var.get().strip())
        save_mode(mode)

        self.source = source
        self._show_progress_ui()
        threading.Thread(target=self._transcribe_thread, daemon=True).start()

    # ------------------------------------------------------------------ #
    #  Audio helpers
    # ------------------------------------------------------------------ #
    def _get_audio(self):
        if not is_youtube_url(self.source):
            return self.source, None

        self._update_status("מוריד אודיו מיוטיוב...")
        import yt_dlp
        output_dir = Path.home() / "Desktop" / "תמלולים"
        temp_dir = output_dir / "temp"
        temp_dir.mkdir(parents=True, exist_ok=True)

        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': str(temp_dir / '%(id)s.%(ext)s'),
            'postprocessors': [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3'}],
            'ffmpeg_location': get_ffmpeg(),
            'quiet': True,
            'extractor_args': {'youtube': {'js_runtimes': ['node']}} if shutil.which('node') else {},
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(self.source, download=True)
            title = info.get('title', 'video')
            video_id = info.get('id', 'video')
            matches = list(temp_dir.glob(f"{video_id}*"))
            if not matches:
                raise FileNotFoundError("לא נמצא קובץ אודיו אחרי ההורדה")
            return str(matches[0]), title

    def _to_mp3(self, audio_path):
        audio_path = Path(audio_path)
        if audio_path.suffix.lower() == ".mp3":
            return audio_path
        self._update_status("ממיר לאודיו...")
        mp3_path = audio_path.with_suffix(".mp3")
        subprocess.run(
            [get_ffmpeg(), "-y", "-i", str(audio_path), "-q:a", "3", "-map", "a", str(mp3_path)],
            capture_output=True
        )
        return mp3_path

    # ------------------------------------------------------------------ #
    #  Groq
    # ------------------------------------------------------------------ #
    GROQ_CHUNK_MB = 20

    def _transcribe_groq(self, audio_path):
        from groq import Groq
        client = Groq(api_key=load_key("groq"))
        audio_path = self._to_mp3(audio_path)

        size_mb = Path(audio_path).stat().st_size / (1024 * 1024)
        if size_mb <= self.GROQ_CHUNK_MB:
            chunks = [Path(audio_path)]
        else:
            self._update_status(f"מפצל קובץ ({size_mb:.0f}MB) לחלקים...")
            chunks = self._split_audio(str(audio_path))

        texts = []
        for i, chunk in enumerate(chunks):
            self._update_status(f"Groq מתמלל חלק {i+1}/{len(chunks)}...")
            with open(chunk, "rb") as f:
                result = client.audio.transcriptions.create(
                    file=(chunk.name, f),
                    model="whisper-large-v3",
                    language="he",
                    response_format="text"
                )
            texts.append(result.strip())

        if len(chunks) > 1:
            for c in chunks:
                try: c.unlink()
                except: pass
            try: chunks[0].parent.rmdir()
            except: pass

        return "\n".join(texts)

    def _split_audio(self, audio_path, chunk_minutes=8):
        out_dir = Path(audio_path).parent / "chunks"
        out_dir.mkdir(exist_ok=True)
        pattern = str(out_dir / "chunk_%03d.mp3")
        subprocess.run([
            get_ffmpeg(), "-y", "-i", audio_path,
            "-f", "segment", "-segment_time", str(chunk_minutes * 60),
            "-c", "copy", pattern
        ], capture_output=True)
        return sorted(out_dir.glob("chunk_*.mp3"))

    # ------------------------------------------------------------------ #
    #  RunPod / ivrit.ai
    # ------------------------------------------------------------------ #
    RUNPOD_CHUNK_MB = 3.5  # max blob size per request

    def _transcribe_runpod(self, audio_path):
        import requests

        key = load_key("runpod")
        endpoint_id = load_secret("runpod_endpoint")

        # Convert to low-bitrate mp3 (64kbps is enough for speech, keeps files small)
        audio_path = Path(audio_path)
        self._update_status("ממיר לאודיו...")
        mp3_path = audio_path.with_suffix(".mp3")
        subprocess.run(
            [get_ffmpeg(), "-y", "-i", str(audio_path), "-b:a", "64k", "-map", "a", str(mp3_path)],
            capture_output=True
        )
        audio_path = mp3_path

        size_mb = audio_path.stat().st_size / (1024 * 1024)
        if size_mb > self.RUNPOD_CHUNK_MB:
            chunks = self._split_audio(str(audio_path), chunk_minutes=4)
        else:
            chunks = [audio_path]

        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }

        all_texts = []
        for i, chunk in enumerate(chunks):
            self._update_status(f"שולח חלק {i+1}/{len(chunks)} לשרת ivrit.ai...")
            with open(chunk, "rb") as f:
                audio_b64 = base64.b64encode(f.read()).decode("utf-8")

            payload = {
                "input": {
                    "model": "ivrit-ai/whisper-large-v3-turbo-ct2",
                    "streaming": False,
                    "transcribe_args": {
                        "blob": audio_b64,
                        "language": "he"
                    }
                }
            }

            resp = requests.post(
                f"https://api.runpod.ai/v2/{endpoint_id}/run",
                headers=headers, json=payload, timeout=60
            )
            if not resp.ok:
                raise RuntimeError(f"RunPod שגיאה {resp.status_code}: {resp.text[:200]}")
            job_id = resp.json()["id"]

            # Poll until done
            elapsed = 0
            while True:
                self._update_status(f"מתמלל חלק {i+1}/{len(chunks)}... ({elapsed}ש')")
                time.sleep(5)
                elapsed += 5
                status_resp = requests.get(
                    f"https://api.runpod.ai/v2/{endpoint_id}/status/{job_id}",
                    headers=headers, timeout=30
                )
                status_resp.raise_for_status()
                data = status_resp.json()
                status = data.get("status", "")
                if status == "COMPLETED":
                    break
                if status in ("FAILED", "CANCELLED"):
                    raise RuntimeError(f"השרת נכשל: {data.get('error', status)}")

            output = data.get("output", {})
            result_items = output.get("result", [])
            for item in result_items:
                if item.get("type") == "segments":
                    for seg in item.get("data", []):
                        t = seg.get("text", "").strip()
                        if t:
                            all_texts.append(t)

        # Cleanup chunks
        if len(chunks) > 1:
            for c in chunks:
                try: c.unlink()
                except: pass
            try: chunks[0].parent.rmdir()
            except: pass

        return " ".join(all_texts)


    def _transcribe_thread(self):
        try:
            output_dir = Path.home() / "Desktop" / "תמלולים"
            output_dir.mkdir(exist_ok=True)

            audio_path, title = self._get_audio()

            if self.mode.get() == "groq":
                text = self._transcribe_groq(audio_path)
            else:
                text = self._transcribe_runpod(audio_path)

            out_name = (title or Path(self.source).stem) + ".txt"
            for ch in r'\/:*?"<>|':
                out_name = out_name.replace(ch, "_")
            out_file = output_dir / out_name
            out_file.write_text(text, encoding='utf-8-sig')

            if is_youtube_url(self.source) and audio_path != self.source:
                try: os.remove(audio_path)
                except: pass

            self.root.after(0, lambda: self._finish(str(out_file), None))

        except Exception as e:
            err = str(e)
            self.root.after(0, lambda: self._finish(None, err))

    def _finish(self, output_path, error):
        self.progressbar.stop()
        if error:
            messagebox.showerror("שגיאה", f"אירעה שגיאה:\n{error}", parent=self.root)
            self.root.destroy()
        else:
            messagebox.showinfo("סיום!", f"התמלול נשמר:\n{output_path}", parent=self.root)
            os.startfile(output_path)
            self.root.destroy()


def main():
    if HAS_DND:
        root = TkinterDnD.Tk()
    else:
        root = tk.Tk()
    TranscribeApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
