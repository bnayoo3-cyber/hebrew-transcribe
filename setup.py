# -*- coding: utf-8 -*-
import sys
import tkinter as tk
from tkinter import ttk, messagebox
import subprocess
import threading
from pathlib import Path

BG    = "#f5f5f5"
BLUE  = "#2962ff"
GREEN = "#2e7d32"


def run_cmd(cmd):
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        return result.returncode == 0, result.stderr
    except FileNotFoundError:
        return False, f"לא נמצא: {cmd[0]}"

def save_key(service, key):
    import keyring
    keyring.set_password(f"תמלול_{service}", "api_key", key)

def save_secret(name, value):
    import keyring
    keyring.set_password("תמלול_config", name, value)

def load_key(service):
    try:
        import keyring
        return keyring.get_password(f"תמלול_{service}", "api_key") or ""
    except Exception:
        return ""

def load_secret(name):
    try:
        import keyring
        return keyring.get_password("תמלול_config", name) or ""
    except Exception:
        return ""


import base64 as _b64
TRANSCRIBE_PY = _b64.b64decode(
    "IyAtKi0gY29kaW5nOiB1dGYtOCAtKi0KaW1wb3J0IHRocmVhZGluZwppbXBvcnQgc2h1dGlsCmltcG9ydCBvcwppbXBvcnQgc3VicHJvY2VzcwppbXBvcnQgdGltZQppbXBvcnQgYmFzZTY0CmZyb20gcGF0aGxpYiBpbXBvcnQgUGF0aAoKdHJ5OgogICAgZnJvbSB0a2ludGVyZG5kMiBpbXBvcnQgRE5EX0ZJTEVTLCBUa2ludGVyRG5ECiAgICBpbXBvcnQgdGtpbnRlciBhcyB0awogICAgZnJvbSB0a2ludGVyIGltcG9ydCB0dGssIG1lc3NhZ2Vib3gKICAgIEhBU19ETkQgPSBUcnVlCmV4Y2VwdCBJbXBvcnRFcnJvcjoKICAgIGltcG9ydCB0a2ludGVyIGFzIHRrCiAgICBmcm9tIHRraW50ZXIgaW1wb3J0IHR0aywgbWVzc2FnZWJveAogICAgSEFTX0RORCA9IEZhbHNlCgoKQkcgICAgPSAiI2Y1ZjVmNSIKQkxVRSAgPSAiIzI5NjJmZiIKR1JFRU4gPSAiIzJlN2QzMiIKClNVUFBPUlRFRF9FWFRFTlNJT05TID0gewogICAgIi5tcDQiLCAiLm1rdiIsICIuYXZpIiwgIi5tb3YiLCAiLndtdiIsICIud2VibSIsICIuZmx2IiwKICAgICIubXAzIiwgIi53YXYiLCAiLm00YSIsICIuYWFjIiwgIi5vZ2ciLCAiLmZsYWMiLCAiLndtYSIKfQoKQ09ORklHX0ZJTEUgPSBQYXRoKF9fZmlsZV9fKS5wYXJlbnQgLyAiY29uZmlnLnR4dCIgICMgc3RvcmVzIG1vZGUgb25seSAobm90IHNlbnNpdGl2ZSkKCgpkZWYgZ2V0X2ZmbXBlZygpOgogICAgdHJ5OgogICAgICAgIGltcG9ydCBpbWFnZWlvX2ZmbXBlZwogICAgICAgIHJldHVybiBpbWFnZWlvX2ZmbXBlZy5nZXRfZmZtcGVnX2V4ZSgpCiAgICBleGNlcHQgRXhjZXB0aW9uOgogICAgICAgIHJldHVybiAiZmZtcGVnIgoKZGVmIGlzX3lvdXR1YmVfdXJsKHRleHQpOgogICAgcmV0dXJuIGFueSh4IGluIHRleHQgZm9yIHggaW4gWyd5b3V0dWJlLmNvbScsICd5b3V0dS5iZSddKQoKZGVmIGNsZWFuX2Ryb3BfcGF0aChyYXcpOgogICAgcmF3ID0gcmF3LnN0cmlwKCkKICAgIGlmIHJhdy5zdGFydHN3aXRoKCJ7IikgYW5kIHJhdy5lbmRzd2l0aCgifSIpOgogICAgICAgIHJhdyA9IHJhd1sxOi0xXQogICAgcmV0dXJuIHJhdy5zdHJpcCgnIicpCgpkZWYgbG9hZF9rZXkoc2VydmljZSk6CiAgICB0cnk6CiAgICAgICAgaW1wb3J0IGtleXJpbmcKICAgICAgICByZXR1cm4ga2V5cmluZy5nZXRfcGFzc3dvcmQoZiLXqtee15zXldecX3tzZXJ2aWNlfSIsICJhcGlfa2V5Iikgb3IgIiIKICAgIGV4Y2VwdCBFeGNlcHRpb246CiAgICAgICAgcmV0dXJuICIiCgpkZWYgc2F2ZV9rZXkoc2VydmljZSwga2V5KToKICAgIGltcG9ydCBrZXlyaW5nCiAgICBrZXlyaW5nLnNldF9wYXNzd29yZChmIteq157XnNeV15xfe3NlcnZpY2V9IiwgImFwaV9rZXkiLCBrZXkpCgpkZWYgbG9hZF9zZWNyZXQobmFtZSk6CiAgICAiIiJMb2FkIGFueSBzZWNyZXQgdmFsdWUgZnJvbSBrZXlyaW5nIChhcGkga2V5cywgZW5kcG9pbnQgSURzLCBldGMuKSIiIgogICAgdHJ5OgogICAgICAgIGltcG9ydCBrZXlyaW5nCiAgICAgICAgcmV0dXJuIGtleXJpbmcuZ2V0X3Bhc3N3b3JkKCLXqtee15zXldecX2NvbmZpZyIsIG5hbWUpIG9yICIiCiAgICBleGNlcHQgRXhjZXB0aW9uOgogICAgICAgIHJldHVybiAiIgoKZGVmIHNhdmVfc2VjcmV0KG5hbWUsIHZhbHVlKToKICAgIGltcG9ydCBrZXlyaW5nCiAgICBrZXlyaW5nLnNldF9wYXNzd29yZCgi16rXntec15XXnF9jb25maWciLCBuYW1lLCB2YWx1ZSkKCmRlZiBsb2FkX21vZGUoKToKICAgIGlmIG5vdCBDT05GSUdfRklMRS5leGlzdHMoKToKICAgICAgICByZXR1cm4gImdyb3EiCiAgICByZXR1cm4gQ09ORklHX0ZJTEUucmVhZF90ZXh0KGVuY29kaW5nPSd1dGYtOCcpLnN0cmlwKCkgb3IgImdyb3EiCgpkZWYgc2F2ZV9tb2RlKG1vZGUpOgogICAgQ09ORklHX0ZJTEUud3JpdGVfdGV4dChtb2RlLCBlbmNvZGluZz0ndXRmLTgnKQoKCmNsYXNzIFRyYW5zY3JpYmVBcHA6CiAgICBkZWYgX19pbml0X18oc2VsZiwgcm9vdCk6CiAgICAgICAgc2VsZi5yb290ID0gcm9vdAogICAgICAgIHNlbGYucm9vdC50aXRsZSgi157Xoteo15vXqiDXqtee15zXldecIikKICAgICAgICBzZWxmLnJvb3QuZ2VvbWV0cnkoIjQ4MHg0MjAiKQogICAgICAgIHNlbGYucm9vdC5yZXNpemFibGUoRmFsc2UsIEZhbHNlKQogICAgICAgIHNlbGYucm9vdC5jb25maWd1cmUoYmc9QkcpCgogICAgICAgIHNlbGYuc291cmNlID0gIiIKICAgICAgICBzZWxmLm1vZGUgPSB0ay5TdHJpbmdWYXIodmFsdWU9bG9hZF9tb2RlKCkpCiAgICAgICAgc2VsZi5fYnVpbGRfaW5wdXRfdWkoKQoKICAgIGRlZiBfYnVpbGRfaW5wdXRfdWkoc2VsZik6CiAgICAgICAgc2VsZi5pbnB1dF9mcmFtZSA9IHRrLkZyYW1lKHNlbGYucm9vdCwgYmc9QkcpCiAgICAgICAgc2VsZi5pbnB1dF9mcmFtZS5wYWNrKGZpbGw9ImJvdGgiLCBleHBhbmQ9VHJ1ZSkKCiAgICAgICAgdGsuTGFiZWwoc2VsZi5pbnB1dF9mcmFtZSwgdGV4dD0i157Xoteo15vXqiDXqtee15zXldecIiwgZm9udD0oIkFyaWFsIiwgMTUsICJib2xkIiksCiAgICAgICAgICAgICAgICAgYmc9QkcsIGZnPSIjMjIyIikucGFjayhwYWR5PSgxNCwgNikpCgogICAgICAgICMgTW9kZSB0b2dnbGUKICAgICAgICBtb2RlX2ZyYW1lID0gdGsuRnJhbWUoc2VsZi5pbnB1dF9mcmFtZSwgYmc9QkcpCiAgICAgICAgbW9kZV9mcmFtZS5wYWNrKHBhZHk9KDAsIDYpKQogICAgICAgIGZvciB2YWx1ZSwgbGFiZWwgaW4gWygiZ3JvcSIsICJHcm9xICjXoteg158pIiksICgicnVucG9kIiwgIml2cml0LmFpIOKAlCBSdW5Qb2QiKV06CiAgICAgICAgICAgIHRrLlJhZGlvYnV0dG9uKG1vZGVfZnJhbWUsIHRleHQ9bGFiZWwsIHZhcmlhYmxlPXNlbGYubW9kZSwgdmFsdWU9dmFsdWUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ9KCJBcmlhbCIsIDEwKSwgYmc9QkcsIGNvbW1hbmQ9c2VsZi5fb25fbW9kZV9jaGFuZ2UKICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5wYWNrKHNpZGU9ImxlZnQiLCBwYWR4PTE0KQoKICAgICAgICAjIENyZWRlbnRpYWxzIGZyYW1lIChzd2FwcyBiYXNlZCBvbiBtb2RlKQogICAgICAgIHNlbGYuY3JlZHNfZnJhbWUgPSB0ay5GcmFtZShzZWxmLmlucHV0X2ZyYW1lLCBiZz1CRykKICAgICAgICBzZWxmLmNyZWRzX2ZyYW1lLnBhY2socGFkeT0oMCwgOCkpCiAgICAgICAgc2VsZi5fYnVpbGRfY3JlZHMoKQoKICAgICAgICAjIERyb3Agem9uZQogICAgICAgIHNlbGYuZHJvcF9sYWJlbCA9IHRrLkxhYmVsKAogICAgICAgICAgICBzZWxmLmlucHV0X2ZyYW1lLAogICAgICAgICAgICB0ZXh0PSLwn5OEXG5cbteS16jXldeoINen15XXkdelINeV15nXk9eQ15UgLyDXkNeV15PXmdeVINec15vXkNefIiwKICAgICAgICAgICAgZm9udD0oIkFyaWFsIiwgMTEpLCBiZz0id2hpdGUiLCBmZz0iI2FhYSIsCiAgICAgICAgICAgIHdpZHRoPTQ2LCBoZWlnaHQ9NSwgcmVsaWVmPSJncm9vdmUiLCBiZD0yLCBjdXJzb3I9ImhhbmQyIgogICAgICAgICkKICAgICAgICBzZWxmLmRyb3BfbGFiZWwucGFjayhwYWR4PTI4LCBmaWxsPSJ4IikKCiAgICAgICAgaWYgSEFTX0RORDoKICAgICAgICAgICAgc2VsZi5kcm9wX2xhYmVsLmRyb3BfdGFyZ2V0X3JlZ2lzdGVyKERORF9GSUxFUykKICAgICAgICAgICAgc2VsZi5kcm9wX2xhYmVsLmRuZF9iaW5kKCc8PERyb3A+PicsIHNlbGYuX29uX2Ryb3ApCiAgICAgICAgICAgIHNlbGYuZHJvcF9sYWJlbC5kbmRfYmluZCgnPDxEcmFnRW50ZXI+PicsIGxhbWJkYSBlOiBzZWxmLl9zZXRfZHJvcF9zdHlsZSgiaG92ZXIiKSkKICAgICAgICAgICAgc2VsZi5kcm9wX2xhYmVsLmRuZF9iaW5kKCc8PERyYWdMZWF2ZT4+JywgbGFtYmRhIGU6IHNlbGYuX3NldF9kcm9wX3N0eWxlKCJpZGxlIikpCgogICAgICAgICMgRGl2aWRlcgogICAgICAgIGRpdiA9IHRrLkZyYW1lKHNlbGYuaW5wdXRfZnJhbWUsIGJnPUJHKQogICAgICAgIGRpdi5wYWNrKGZpbGw9IngiLCBwYWR4PTI4LCBwYWR5PSg4LCA1KSkKICAgICAgICB0ay5GcmFtZShkaXYsIGJnPSIjY2NjIiwgaGVpZ2h0PTEpLnBhY2soZmlsbD0ieCIsIHNpZGU9ImxlZnQiLCBleHBhbmQ9VHJ1ZSwgcGFkeT02KQogICAgICAgIHRrLkxhYmVsKGRpdiwgdGV4dD0iICDXkNeVINeU15vXoNehINen15nXqdeV16gg15nXldeY15nXldeRICAiLCBmb250PSgiQXJpYWwiLCA4KSwKICAgICAgICAgICAgICAgICBiZz1CRywgZmc9IiM5OTkiKS5wYWNrKHNpZGU9ImxlZnQiKQogICAgICAgIHRrLkZyYW1lKGRpdiwgYmc9IiNjY2MiLCBoZWlnaHQ9MSkucGFjayhmaWxsPSJ4Iiwgc2lkZT0ibGVmdCIsIGV4cGFuZD1UcnVlLCBwYWR5PTYpCgogICAgICAgIHNlbGYudXJsX3ZhciA9IHRrLlN0cmluZ1ZhcigpCiAgICAgICAgdGsuRW50cnkoc2VsZi5pbnB1dF9mcmFtZSwgdGV4dHZhcmlhYmxlPXNlbGYudXJsX3ZhciwKICAgICAgICAgICAgICAgICBmb250PSgiQXJpYWwiLCAxMCksIHJlbGllZj0ic29saWQiLCBiZD0xCiAgICAgICAgICAgICAgICAgKS5wYWNrKGZpbGw9IngiLCBwYWR4PTI4LCBpcGFkeT01KQoKICAgICAgICBzZWxmLnN0YXJ0X2J0biA9IHRrLkJ1dHRvbihzZWxmLmlucHV0X2ZyYW1lLCB0ZXh0PSLXqtee15zXnCIsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udD0oIkFyaWFsIiwgMTIsICJib2xkIiksCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmc9QkxVRSwgZmc9IndoaXRlIiwgcmVsaWVmPSJmbGF0IiwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWR4PTMwLCBwYWR5PTcsIGN1cnNvcj0iaGFuZDIiLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ9c2VsZi5fb25fc3RhcnQpCiAgICAgICAgc2VsZi5zdGFydF9idG4ucGFjayhwYWR5PSgxMCwgMCkpCgogICAgZGVmIF9idWlsZF9jcmVkcyhzZWxmKToKICAgICAgICBmb3IgdyBpbiBzZWxmLmNyZWRzX2ZyYW1lLndpbmZvX2NoaWxkcmVuKCk6CiAgICAgICAgICAgIHcuZGVzdHJveSgpCgogICAgICAgIGlmIHNlbGYubW9kZS5nZXQoKSA9PSAiZ3JvcSI6CiAgICAgICAgICAgIHNlbGYua2V5X3ZhciA9IHRrLlN0cmluZ1Zhcih2YWx1ZT1sb2FkX2tleSgiZ3JvcSIpKQogICAgICAgICAgICBzZWxmLl9rZXlfcm93KHNlbGYuY3JlZHNfZnJhbWUsICLXntek16rXlyBHcm9xIEFQSToiLCBzZWxmLmtleV92YXIpCiAgICAgICAgZWxzZToKICAgICAgICAgICAgc2VsZi5rZXlfdmFyID0gdGsuU3RyaW5nVmFyKHZhbHVlPWxvYWRfa2V5KCJydW5wb2QiKSkKICAgICAgICAgICAgc2VsZi5lbmRwb2ludF92YXIgPSB0ay5TdHJpbmdWYXIodmFsdWU9bG9hZF9zZWNyZXQoInJ1bnBvZF9lbmRwb2ludCIpKQogICAgICAgICAgICBzZWxmLl9rZXlfcm93KHNlbGYuY3JlZHNfZnJhbWUsICJSdW5Qb2QgQVBJIEtleToiLCBzZWxmLmtleV92YXIpCiAgICAgICAgICAgIGVwX3JvdyA9IHRrLkZyYW1lKHNlbGYuY3JlZHNfZnJhbWUsIGJnPUJHKQogICAgICAgICAgICBlcF9yb3cucGFjayhwYWR5PSg0LCAwKSkKICAgICAgICAgICAgdGsuTGFiZWwoZXBfcm93LCB0ZXh0PSJFbmRwb2ludCBJRDogICAgICIsIGZvbnQ9KCJBcmlhbCIsIDkpLCBiZz1CRywgZmc9IiM1NTUiKS5wYWNrKHNpZGU9ImxlZnQiKQogICAgICAgICAgICB0ay5FbnRyeShlcF9yb3csIHRleHR2YXJpYWJsZT1zZWxmLmVuZHBvaW50X3ZhciwKICAgICAgICAgICAgICAgICAgICAgZm9udD0oIkFyaWFsIiwgOSksIHdpZHRoPTIyLCByZWxpZWY9InNvbGlkIiwgYmQ9MQogICAgICAgICAgICAgICAgICAgICApLnBhY2soc2lkZT0ibGVmdCIsIGlwYWR5PTMpCgogICAgZGVmIF9rZXlfcm93KHNlbGYsIHBhcmVudCwgbGFiZWwsIHZhcik6CiAgICAgICAgcm93ID0gdGsuRnJhbWUocGFyZW50LCBiZz1CRykKICAgICAgICByb3cucGFjaygpCiAgICAgICAgdGsuTGFiZWwocm93LCB0ZXh0PWxhYmVsLCBmb250PSgiQXJpYWwiLCA5KSwgYmc9QkcsIGZnPSIjNTU1IikucGFjayhzaWRlPSJsZWZ0IikKICAgICAgICBlbnRyeSA9IHRrLkVudHJ5KHJvdywgdGV4dHZhcmlhYmxlPXZhciwgc2hvdz0iKiIsIGZvbnQ9KCJBcmlhbCIsIDkpLAogICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg9MjQsIHJlbGllZj0ic29saWQiLCBiZD0xKQogICAgICAgIGVudHJ5LnBhY2soc2lkZT0ibGVmdCIsIHBhZHg9KDQsIDQpLCBpcGFkeT0zKQogICAgICAgIGVudHJ5LmJpbmQoIjxDb250cm9sLXY+IiwgbGFtYmRhIGU6ICh2YXIuc2V0KHNlbGYucm9vdC5jbGlwYm9hcmRfZ2V0KCkpLCAiYnJlYWsiKSkKICAgICAgICB0ay5CdXR0b24ocm93LCB0ZXh0PSLXlNeT15HXpyIsIGZvbnQ9KCJBcmlhbCIsIDgpLCByZWxpZWY9ImZsYXQiLCBiZz0iI2RkZCIsCiAgICAgICAgICAgICAgICAgIGN1cnNvcj0iaGFuZDIiLCBjb21tYW5kPWxhbWJkYTogdmFyLnNldChzZWxmLnJvb3QuY2xpcGJvYXJkX2dldCgpKQogICAgICAgICAgICAgICAgICApLnBhY2soc2lkZT0ibGVmdCIpCgogICAgZGVmIF9vbl9tb2RlX2NoYW5nZShzZWxmKToKICAgICAgICBzZWxmLl9idWlsZF9jcmVkcygpCgogICAgZGVmIF9zZXRfZHJvcF9zdHlsZShzZWxmLCBzdGF0ZSk6CiAgICAgICAgc3R5bGVzID0gewogICAgICAgICAgICAiaWRsZSI6ICAoIndoaXRlIiwgICAiI2FhYSIsICAi8J+ThFxuXG7Xkteo15XXqCDXp9eV15HXpSDXldeZ15PXkNeVIC8g15DXldeT15nXlSDXnNeb15DXnyIpLAogICAgICAgICAgICAiaG92ZXIiOiAoIiNlOGVlZmYiLCBCTFVFLCAgICAi8J+ThFxuXG7XqdeX16jXqCDXm9eQ158iKSwKICAgICAgICAgICAgImZpbGUiOiAgKCIjZThmNWU5IiwgR1JFRU4sICAgZiLinJNcblxue1BhdGgoc2VsZi5zb3VyY2UpLm5hbWV9IiBpZiBzZWxmLnNvdXJjZSBlbHNlICLinJMiKSwKICAgICAgICB9CiAgICAgICAgYmcsIGZnLCB0ZXh0ID0gc3R5bGVzW3N0YXRlXQogICAgICAgIHNlbGYuZHJvcF9sYWJlbC5jb25maWcoYmc9YmcsIGZnPWZnLCB0ZXh0PXRleHQpCgogICAgZGVmIF9vbl9kcm9wKHNlbGYsIGV2ZW50KToKICAgICAgICBwYXRoID0gY2xlYW5fZHJvcF9wYXRoKGV2ZW50LmRhdGEpCiAgICAgICAgaWYgbm90IHBhdGg6CiAgICAgICAgICAgIHJldHVybgogICAgICAgIGlmIFBhdGgocGF0aCkuc3VmZml4Lmxvd2VyKCkgbm90IGluIFNVUFBPUlRFRF9FWFRFTlNJT05TOgogICAgICAgICAgICBtZXNzYWdlYm94LnNob3d3YXJuaW5nKCLXodeV15Ig16fXldeR16Ug15zXkCDXoNeq157XmiIsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZiIne1BhdGgocGF0aCkubmFtZX0nINeQ15nXoNeVINen15XXkdelINeV15nXk9eQ15Ug15DXlSDXkNeV15PXmdeVLiIsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50PXNlbGYucm9vdCkKICAgICAgICAgICAgcmV0dXJuCiAgICAgICAgc2VsZi5zb3VyY2UgPSBwYXRoCiAgICAgICAgc2VsZi51cmxfdmFyLnNldCgiIikKICAgICAgICBzZWxmLl9zZXRfZHJvcF9zdHlsZSgiZmlsZSIpCgogICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIwogICAgIyAgUHJvZ3Jlc3MgVUkKICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICMKICAgIGRlZiBfc2hvd19wcm9ncmVzc191aShzZWxmKToKICAgICAgICBzZWxmLmlucHV0X2ZyYW1lLnBhY2tfZm9yZ2V0KCkKICAgICAgICBzZWxmLnByb2dfZnJhbWUgPSB0ay5GcmFtZShzZWxmLnJvb3QsIGJnPUJHKQogICAgICAgIHNlbGYucHJvZ19mcmFtZS5wYWNrKGZpbGw9ImJvdGgiLCBleHBhbmQ9VHJ1ZSkKCiAgICAgICAgdGsuTGFiZWwoc2VsZi5wcm9nX2ZyYW1lLCB0ZXh0PSLXnteq157XnNecLi4uIiwgZm9udD0oIkFyaWFsIiwgMTQsICJib2xkIiksCiAgICAgICAgICAgICAgICAgYmc9QkcsIGZnPSIjMjIyIikucGFjayhwYWR5PSgzMCwgMTIpKQoKICAgICAgICBzZWxmLnN0YXR1c192YXIgPSB0ay5TdHJpbmdWYXIodmFsdWU9Itee16rXl9eZ15wuLi4iKQogICAgICAgIHRrLkxhYmVsKHNlbGYucHJvZ19mcmFtZSwgdGV4dHZhcmlhYmxlPXNlbGYuc3RhdHVzX3ZhciwKICAgICAgICAgICAgICAgICBmb250PSgiQXJpYWwiLCAxMCksIGJnPUJHLCBmZz0iIzU1NSIpLnBhY2soKQoKICAgICAgICBzZWxmLnByb2dyZXNzYmFyID0gdHRrLlByb2dyZXNzYmFyKHNlbGYucHJvZ19mcmFtZSwgbGVuZ3RoPTM4MCwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGU9ImluZGV0ZXJtaW5hdGUiLCBtYXhpbXVtPTEwMCkKICAgICAgICBzZWxmLnByb2dyZXNzYmFyLnBhY2socGFkeT0oMTIsIDQpLCBwYWR4PTQwKQogICAgICAgIHNlbGYucHJvZ3Jlc3NiYXIuc3RhcnQoMTIpCgogICAgZGVmIF91cGRhdGVfc3RhdHVzKHNlbGYsIHRleHQpOgogICAgICAgIHNlbGYucm9vdC5hZnRlcigwLCBsYW1iZGE6IHNlbGYuc3RhdHVzX3Zhci5zZXQodGV4dCkpCgogICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIwogICAgIyAgU3RhcnQKICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICMKICAgIGRlZiBfb25fc3RhcnQoc2VsZik6CiAgICAgICAgdXJsID0gc2VsZi51cmxfdmFyLmdldCgpLnN0cmlwKCkKICAgICAgICBzb3VyY2UgPSB1cmwgaWYgdXJsIGVsc2Ugc2VsZi5zb3VyY2UKCiAgICAgICAgaWYgbm90IHNvdXJjZToKICAgICAgICAgICAgbWVzc2FnZWJveC5zaG93d2FybmluZygi16nXmdedINec15EiLCAi15LXqNeV16gg16fXldeR16Ug15DXlSDXlNeb16DXoSDXp9eZ16nXldeoINeZ15XXmNeZ15XXkS4iLCBwYXJlbnQ9c2VsZi5yb290KQogICAgICAgICAgICByZXR1cm4KCiAgICAgICAga2V5ID0gc2VsZi5rZXlfdmFyLmdldCgpLnN0cmlwKCkKICAgICAgICBpZiBub3Qga2V5OgogICAgICAgICAgICBtZXNzYWdlYm94LnNob3d3YXJuaW5nKCLXl9eh16gg157XpNeq15ciLCAi15TXm9eg16Eg157XpNeq15cgQVBJLiIsIHBhcmVudD1zZWxmLnJvb3QpCiAgICAgICAgICAgIHJldHVybgoKICAgICAgICBtb2RlID0gc2VsZi5tb2RlLmdldCgpCiAgICAgICAgaWYgbW9kZSA9PSAicnVucG9kIiBhbmQgbm90IHNlbGYuZW5kcG9pbnRfdmFyLmdldCgpLnN0cmlwKCk6CiAgICAgICAgICAgIG1lc3NhZ2Vib3guc2hvd3dhcm5pbmcoIteX16HXqCBFbmRwb2ludCIsICLXlNeb16DXoSBFbmRwb2ludCBJRCDXqdecIFJ1blBvZC4iLCBwYXJlbnQ9c2VsZi5yb290KQogICAgICAgICAgICByZXR1cm4KCiAgICAgICAgIyBTYXZlIGNyZWRlbnRpYWxzIChhbGwgZW5jcnlwdGVkIGluIGtleXJpbmcpCiAgICAgICAgc2F2ZV9rZXkobW9kZSwga2V5KQogICAgICAgIGlmIG1vZGUgPT0gInJ1bnBvZCI6CiAgICAgICAgICAgIHNhdmVfc2VjcmV0KCJydW5wb2RfZW5kcG9pbnQiLCBzZWxmLmVuZHBvaW50X3Zhci5nZXQoKS5zdHJpcCgpKQogICAgICAgIHNhdmVfbW9kZShtb2RlKQoKICAgICAgICBzZWxmLnNvdXJjZSA9IHNvdXJjZQogICAgICAgIHNlbGYuX3Nob3dfcHJvZ3Jlc3NfdWkoKQogICAgICAgIHRocmVhZGluZy5UaHJlYWQodGFyZ2V0PXNlbGYuX3RyYW5zY3JpYmVfdGhyZWFkLCBkYWVtb249VHJ1ZSkuc3RhcnQoKQoKICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICMKICAgICMgIEF1ZGlvIGhlbHBlcnMKICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICMKICAgIGRlZiBfZ2V0X2F1ZGlvKHNlbGYpOgogICAgICAgIGlmIG5vdCBpc195b3V0dWJlX3VybChzZWxmLnNvdXJjZSk6CiAgICAgICAgICAgIHJldHVybiBzZWxmLnNvdXJjZSwgTm9uZQoKICAgICAgICBzZWxmLl91cGRhdGVfc3RhdHVzKCLXnteV16jXmdeTINeQ15XXk9eZ15Ug157XmdeV15jXmdeV15EuLi4iKQogICAgICAgIGltcG9ydCB5dF9kbHAKICAgICAgICBvdXRwdXRfZGlyID0gUGF0aC5ob21lKCkgLyAiRGVza3RvcCIgLyAi16rXntec15XXnNeZ150iCiAgICAgICAgdGVtcF9kaXIgPSBvdXRwdXRfZGlyIC8gInRlbXAiCiAgICAgICAgdGVtcF9kaXIubWtkaXIocGFyZW50cz1UcnVlLCBleGlzdF9vaz1UcnVlKQoKICAgICAgICB5ZGxfb3B0cyA9IHsKICAgICAgICAgICAgJ2Zvcm1hdCc6ICdiZXN0YXVkaW8vYmVzdCcsCiAgICAgICAgICAgICdvdXR0bXBsJzogc3RyKHRlbXBfZGlyIC8gJyUoaWQpcy4lKGV4dClzJyksCiAgICAgICAgICAgICdwb3N0cHJvY2Vzc29ycyc6IFt7J2tleSc6ICdGRm1wZWdFeHRyYWN0QXVkaW8nLCAncHJlZmVycmVkY29kZWMnOiAnbXAzJ31dLAogICAgICAgICAgICAnZmZtcGVnX2xvY2F0aW9uJzogZ2V0X2ZmbXBlZygpLAogICAgICAgICAgICAncXVpZXQnOiBUcnVlLAogICAgICAgICAgICAnZXh0cmFjdG9yX2FyZ3MnOiB7J3lvdXR1YmUnOiB7J2pzX3J1bnRpbWVzJzogWydub2RlJ119fSBpZiBzaHV0aWwud2hpY2goJ25vZGUnKSBlbHNlIHt9LAogICAgICAgIH0KICAgICAgICB3aXRoIHl0X2RscC5Zb3V0dWJlREwoeWRsX29wdHMpIGFzIHlkbDoKICAgICAgICAgICAgaW5mbyA9IHlkbC5leHRyYWN0X2luZm8oc2VsZi5zb3VyY2UsIGRvd25sb2FkPVRydWUpCiAgICAgICAgICAgIHRpdGxlID0gaW5mby5nZXQoJ3RpdGxlJywgJ3ZpZGVvJykKICAgICAgICAgICAgdmlkZW9faWQgPSBpbmZvLmdldCgnaWQnLCAndmlkZW8nKQogICAgICAgICAgICBtYXRjaGVzID0gbGlzdCh0ZW1wX2Rpci5nbG9iKGYie3ZpZGVvX2lkfSoiKSkKICAgICAgICAgICAgaWYgbm90IG1hdGNoZXM6CiAgICAgICAgICAgICAgICByYWlzZSBGaWxlTm90Rm91bmRFcnJvcigi15zXkCDXoNee16bXkCDXp9eV15HXpSDXkNeV15PXmdeVINeQ15fXqNeZINeU15TXldeo15PXlCIpCiAgICAgICAgICAgIHJldHVybiBzdHIobWF0Y2hlc1swXSksIHRpdGxlCgogICAgZGVmIF90b19tcDMoc2VsZiwgYXVkaW9fcGF0aCk6CiAgICAgICAgYXVkaW9fcGF0aCA9IFBhdGgoYXVkaW9fcGF0aCkKICAgICAgICBpZiBhdWRpb19wYXRoLnN1ZmZpeC5sb3dlcigpID09ICIubXAzIjoKICAgICAgICAgICAgcmV0dXJuIGF1ZGlvX3BhdGgKICAgICAgICBzZWxmLl91cGRhdGVfc3RhdHVzKCLXntee15nXqCDXnNeQ15XXk9eZ15UuLi4iKQogICAgICAgIG1wM19wYXRoID0gYXVkaW9fcGF0aC53aXRoX3N1ZmZpeCgiLm1wMyIpCiAgICAgICAgc3VicHJvY2Vzcy5ydW4oCiAgICAgICAgICAgIFtnZXRfZmZtcGVnKCksICIteSIsICItaSIsIHN0cihhdWRpb19wYXRoKSwgIi1xOmEiLCAiMyIsICItbWFwIiwgImEiLCBzdHIobXAzX3BhdGgpXSwKICAgICAgICAgICAgY2FwdHVyZV9vdXRwdXQ9VHJ1ZQogICAgICAgICkKICAgICAgICByZXR1cm4gbXAzX3BhdGgKCiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAjCiAgICAjICBHcm9xCiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAjCiAgICBHUk9RX0NIVU5LX01CID0gMjAKCiAgICBkZWYgX3RyYW5zY3JpYmVfZ3JvcShzZWxmLCBhdWRpb19wYXRoKToKICAgICAgICBmcm9tIGdyb3EgaW1wb3J0IEdyb3EKICAgICAgICBjbGllbnQgPSBHcm9xKGFwaV9rZXk9bG9hZF9rZXkoImdyb3EiKSkKICAgICAgICBhdWRpb19wYXRoID0gc2VsZi5fdG9fbXAzKGF1ZGlvX3BhdGgpCgogICAgICAgIHNpemVfbWIgPSBQYXRoKGF1ZGlvX3BhdGgpLnN0YXQoKS5zdF9zaXplIC8gKDEwMjQgKiAxMDI0KQogICAgICAgIGlmIHNpemVfbWIgPD0gc2VsZi5HUk9RX0NIVU5LX01COgogICAgICAgICAgICBjaHVua3MgPSBbUGF0aChhdWRpb19wYXRoKV0KICAgICAgICBlbHNlOgogICAgICAgICAgICBzZWxmLl91cGRhdGVfc3RhdHVzKGYi157XpNem15wg16fXldeR16UgKHtzaXplX21iOi4wZn1NQikg15zXl9ec16fXmdedLi4uIikKICAgICAgICAgICAgY2h1bmtzID0gc2VsZi5fc3BsaXRfYXVkaW8oc3RyKGF1ZGlvX3BhdGgpKQoKICAgICAgICB0ZXh0cyA9IFtdCiAgICAgICAgZm9yIGksIGNodW5rIGluIGVudW1lcmF0ZShjaHVua3MpOgogICAgICAgICAgICBzZWxmLl91cGRhdGVfc3RhdHVzKGYiR3JvcSDXnteq157XnNecINeX15zXpyB7aSsxfS97bGVuKGNodW5rcyl9Li4uIikKICAgICAgICAgICAgd2l0aCBvcGVuKGNodW5rLCAicmIiKSBhcyBmOgogICAgICAgICAgICAgICAgcmVzdWx0ID0gY2xpZW50LmF1ZGlvLnRyYW5zY3JpcHRpb25zLmNyZWF0ZSgKICAgICAgICAgICAgICAgICAgICBmaWxlPShjaHVuay5uYW1lLCBmKSwKICAgICAgICAgICAgICAgICAgICBtb2RlbD0id2hpc3Blci1sYXJnZS12MyIsCiAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2U9ImhlIiwKICAgICAgICAgICAgICAgICAgICByZXNwb25zZV9mb3JtYXQ9InRleHQiCiAgICAgICAgICAgICAgICApCiAgICAgICAgICAgIHRleHRzLmFwcGVuZChyZXN1bHQuc3RyaXAoKSkKCiAgICAgICAgaWYgbGVuKGNodW5rcykgPiAxOgogICAgICAgICAgICBmb3IgYyBpbiBjaHVua3M6CiAgICAgICAgICAgICAgICB0cnk6IGMudW5saW5rKCkKICAgICAgICAgICAgICAgIGV4Y2VwdDogcGFzcwogICAgICAgICAgICB0cnk6IGNodW5rc1swXS5wYXJlbnQucm1kaXIoKQogICAgICAgICAgICBleGNlcHQ6IHBhc3MKCiAgICAgICAgcmV0dXJuICJcbiIuam9pbih0ZXh0cykKCiAgICBkZWYgX3NwbGl0X2F1ZGlvKHNlbGYsIGF1ZGlvX3BhdGgsIGNodW5rX21pbnV0ZXM9OCk6CiAgICAgICAgb3V0X2RpciA9IFBhdGgoYXVkaW9fcGF0aCkucGFyZW50IC8gImNodW5rcyIKICAgICAgICBvdXRfZGlyLm1rZGlyKGV4aXN0X29rPVRydWUpCiAgICAgICAgcGF0dGVybiA9IHN0cihvdXRfZGlyIC8gImNodW5rXyUwM2QubXAzIikKICAgICAgICBzdWJwcm9jZXNzLnJ1bihbCiAgICAgICAgICAgIGdldF9mZm1wZWcoKSwgIi15IiwgIi1pIiwgYXVkaW9fcGF0aCwKICAgICAgICAgICAgIi1mIiwgInNlZ21lbnQiLCAiLXNlZ21lbnRfdGltZSIsIHN0cihjaHVua19taW51dGVzICogNjApLAogICAgICAgICAgICAiLWMiLCAiY29weSIsIHBhdHRlcm4KICAgICAgICBdLCBjYXB0dXJlX291dHB1dD1UcnVlKQogICAgICAgIHJldHVybiBzb3J0ZWQob3V0X2Rpci5nbG9iKCJjaHVua18qLm1wMyIpKQoKICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICMKICAgICMgIFJ1blBvZCAvIGl2cml0LmFpCiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAjCiAgICBkZWYgX3RyYW5zY3JpYmVfcnVucG9kKHNlbGYsIGF1ZGlvX3BhdGgpOgogICAgICAgIGltcG9ydCByZXF1ZXN0cwoKICAgICAgICBrZXkgPSBsb2FkX2tleSgicnVucG9kIikKICAgICAgICBlbmRwb2ludF9pZCA9IGxvYWRfc2VjcmV0KCJydW5wb2RfZW5kcG9pbnQiKQogICAgICAgIGF1ZGlvX3BhdGggPSBzZWxmLl90b19tcDMoYXVkaW9fcGF0aCkKCiAgICAgICAgc2VsZi5fdXBkYXRlX3N0YXR1cygi157Xotec15Qg16fXldeR16Ug15zXqdeo16ogaXZyaXQuYWkuLi4iKQogICAgICAgIHdpdGggb3BlbihhdWRpb19wYXRoLCAicmIiKSBhcyBmOgogICAgICAgICAgICBhdWRpb19iNjQgPSBiYXNlNjQuYjY0ZW5jb2RlKGYucmVhZCgpKS5kZWNvZGUoInV0Zi04IikKCiAgICAgICAgaGVhZGVycyA9IHsKICAgICAgICAgICAgIkF1dGhvcml6YXRpb24iOiBmIkJlYXJlciB7a2V5fSIsCiAgICAgICAgICAgICJDb250ZW50LVR5cGUiOiAiYXBwbGljYXRpb24vanNvbiIKICAgICAgICB9CiAgICAgICAgcGF5bG9hZCA9IHsKICAgICAgICAgICAgImlucHV0IjogewogICAgICAgICAgICAgICAgInN0cmVhbWluZyI6IEZhbHNlLAogICAgICAgICAgICAgICAgInRyYW5zY3JpYmVfYXJncyI6IHsKICAgICAgICAgICAgICAgICAgICAiYmxvYiI6IGF1ZGlvX2I2NCwKICAgICAgICAgICAgICAgICAgICAibGFuZ3VhZ2UiOiAiaGUiCiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICB9CgogICAgICAgICMgU3VibWl0IGpvYiAoYXN5bmMpCiAgICAgICAgcmVzcCA9IHJlcXVlc3RzLnBvc3QoCiAgICAgICAgICAgIGYiaHR0cHM6Ly9hcGkucnVucG9kLmFpL3YyL3tlbmRwb2ludF9pZH0vcnVuIiwKICAgICAgICAgICAgaGVhZGVycz1oZWFkZXJzLCBqc29uPXBheWxvYWQsIHRpbWVvdXQ9NjAKICAgICAgICApCiAgICAgICAgcmVzcC5yYWlzZV9mb3Jfc3RhdHVzKCkKICAgICAgICBqb2JfaWQgPSByZXNwLmpzb24oKVsiaWQiXQoKICAgICAgICAjIFBvbGwgdW50aWwgZG9uZQogICAgICAgIGVsYXBzZWQgPSAwCiAgICAgICAgd2hpbGUgVHJ1ZToKICAgICAgICAgICAgc2VsZi5fdXBkYXRlX3N0YXR1cyhmItee16rXntec15wuLi4gKHtlbGFwc2VkfdepJykiKQogICAgICAgICAgICB0aW1lLnNsZWVwKDUpCiAgICAgICAgICAgIGVsYXBzZWQgKz0gNQogICAgICAgICAgICBzdGF0dXNfcmVzcCA9IHJlcXVlc3RzLmdldCgKICAgICAgICAgICAgICAgIGYiaHR0cHM6Ly9hcGkucnVucG9kLmFpL3YyL3tlbmRwb2ludF9pZH0vc3RhdHVzL3tqb2JfaWR9IiwKICAgICAgICAgICAgICAgIGhlYWRlcnM9aGVhZGVycywgdGltZW91dD0zMAogICAgICAgICAgICApCiAgICAgICAgICAgIHN0YXR1c19yZXNwLnJhaXNlX2Zvcl9zdGF0dXMoKQogICAgICAgICAgICBkYXRhID0gc3RhdHVzX3Jlc3AuanNvbigpCiAgICAgICAgICAgIHN0YXR1cyA9IGRhdGEuZ2V0KCJzdGF0dXMiLCAiIikKCiAgICAgICAgICAgIGlmIHN0YXR1cyA9PSAiQ09NUExFVEVEIjoKICAgICAgICAgICAgICAgIGJyZWFrCiAgICAgICAgICAgIGlmIHN0YXR1cyBpbiAoIkZBSUxFRCIsICJDQU5DRUxMRUQiKToKICAgICAgICAgICAgICAgIHJhaXNlIFJ1bnRpbWVFcnJvcihmIteU16nXqNeqINeg15vXqdecOiB7ZGF0YS5nZXQoJ2Vycm9yJywgc3RhdHVzKX0iKQoKICAgICAgICAjIFBhcnNlIHNlZ21lbnRzCiAgICAgICAgb3V0cHV0ID0gZGF0YS5nZXQoIm91dHB1dCIsIHt9KQogICAgICAgIHJlc3VsdF9pdGVtcyA9IG91dHB1dC5nZXQoInJlc3VsdCIsIFtdKQogICAgICAgIHRleHRzID0gW10KICAgICAgICBmb3IgaXRlbSBpbiByZXN1bHRfaXRlbXM6CiAgICAgICAgICAgIGlmIGl0ZW0uZ2V0KCJ0eXBlIikgPT0gInNlZ21lbnRzIjoKICAgICAgICAgICAgICAgIGZvciBzZWcgaW4gaXRlbS5nZXQoImRhdGEiLCBbXSk6CiAgICAgICAgICAgICAgICAgICAgdCA9IHNlZy5nZXQoInRleHQiLCAiIikuc3RyaXAoKQogICAgICAgICAgICAgICAgICAgIGlmIHQ6CiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRzLmFwcGVuZCh0KQoKICAgICAgICByZXR1cm4gIiAiLmpvaW4odGV4dHMpCgogICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIwogICAgIyAgVGhyZWFkCiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAjCiAgICBkZWYgX3RyYW5zY3JpYmVfdGhyZWFkKHNlbGYpOgogICAgICAgIHRyeToKICAgICAgICAgICAgb3V0cHV0X2RpciA9IFBhdGguaG9tZSgpIC8gIkRlc2t0b3AiIC8gIteq157XnNeV15zXmdedIgogICAgICAgICAgICBvdXRwdXRfZGlyLm1rZGlyKGV4aXN0X29rPVRydWUpCgogICAgICAgICAgICBhdWRpb19wYXRoLCB0aXRsZSA9IHNlbGYuX2dldF9hdWRpbygpCgogICAgICAgICAgICBpZiBzZWxmLm1vZGUuZ2V0KCkgPT0gImdyb3EiOgogICAgICAgICAgICAgICAgdGV4dCA9IHNlbGYuX3RyYW5zY3JpYmVfZ3JvcShhdWRpb19wYXRoKQogICAgICAgICAgICBlbHNlOgogICAgICAgICAgICAgICAgdGV4dCA9IHNlbGYuX3RyYW5zY3JpYmVfcnVucG9kKGF1ZGlvX3BhdGgpCgogICAgICAgICAgICBvdXRfbmFtZSA9ICh0aXRsZSBvciBQYXRoKHNlbGYuc291cmNlKS5zdGVtKSArICIudHh0IgogICAgICAgICAgICBmb3IgY2ggaW4gcidcLzoqPyI8PnwnOgogICAgICAgICAgICAgICAgb3V0X25hbWUgPSBvdXRfbmFtZS5yZXBsYWNlKGNoLCAiXyIpCiAgICAgICAgICAgIG91dF9maWxlID0gb3V0cHV0X2RpciAvIG91dF9uYW1lCiAgICAgICAgICAgIG91dF9maWxlLndyaXRlX3RleHQodGV4dCwgZW5jb2Rpbmc9J3V0Zi04LXNpZycpCgogICAgICAgICAgICBpZiBpc195b3V0dWJlX3VybChzZWxmLnNvdXJjZSkgYW5kIGF1ZGlvX3BhdGggIT0gc2VsZi5zb3VyY2U6CiAgICAgICAgICAgICAgICB0cnk6IG9zLnJlbW92ZShhdWRpb19wYXRoKQogICAgICAgICAgICAgICAgZXhjZXB0OiBwYXNzCgogICAgICAgICAgICBzZWxmLnJvb3QuYWZ0ZXIoMCwgbGFtYmRhOiBzZWxmLl9maW5pc2goc3RyKG91dF9maWxlKSwgTm9uZSkpCgogICAgICAgIGV4Y2VwdCBFeGNlcHRpb24gYXMgZToKICAgICAgICAgICAgZXJyID0gc3RyKGUpCiAgICAgICAgICAgIHNlbGYucm9vdC5hZnRlcigwLCBsYW1iZGE6IHNlbGYuX2ZpbmlzaChOb25lLCBlcnIpKQoKICAgIGRlZiBfZmluaXNoKHNlbGYsIG91dHB1dF9wYXRoLCBlcnJvcik6CiAgICAgICAgc2VsZi5wcm9ncmVzc2Jhci5zdG9wKCkKICAgICAgICBpZiBlcnJvcjoKICAgICAgICAgICAgbWVzc2FnZWJveC5zaG93ZXJyb3IoItep15LXmdeQ15QiLCBmIteQ15nXqNei15Qg16nXkteZ15DXlDpcbntlcnJvcn0iLCBwYXJlbnQ9c2VsZi5yb290KQogICAgICAgICAgICBzZWxmLnJvb3QuZGVzdHJveSgpCiAgICAgICAgZWxzZToKICAgICAgICAgICAgbWVzc2FnZWJveC5zaG93aW5mbygi16HXmdeV150hIiwgZiLXlNeq157XnNeV15wg16DXqdee16g6XG57b3V0cHV0X3BhdGh9IiwgcGFyZW50PXNlbGYucm9vdCkKICAgICAgICAgICAgb3Muc3RhcnRmaWxlKG91dHB1dF9wYXRoKQogICAgICAgICAgICBzZWxmLnJvb3QuZGVzdHJveSgpCgoKZGVmIG1haW4oKToKICAgIGlmIEhBU19ETkQ6CiAgICAgICAgcm9vdCA9IFRraW50ZXJEbkQuVGsoKQogICAgZWxzZToKICAgICAgICByb290ID0gdGsuVGsoKQogICAgVHJhbnNjcmliZUFwcChyb290KQogICAgcm9vdC5tYWlubG9vcCgpCgoKaWYgX19uYW1lX18gPT0gIl9fbWFpbl9fIjoKICAgIG1haW4oKQo="
).decode("utf-8")

class SetupApp:
    def __init__(self, root):
        self.root = root
        self.root.title("התקנת מערכת תמלול")
        self.root.geometry("500x500")
        self.root.resizable(False, False)
        self.root.configure(bg=BG)
        self.mode = tk.StringVar(value="groq")
        self._build_ui()

    def _build_ui(self):
        tk.Label(self.root, text="התקנת מערכת תמלול", font=("Arial", 16, "bold"),
                 bg=BG, fg="#222").pack(pady=(20, 4))
        tk.Label(self.root, text="פעם אחת בלבד", font=("Arial", 10), bg=BG, fg="#666").pack()

        # --- Mode selection ---
        mode_frame = tk.LabelFrame(self.root, text=" בחר שירות תמלול ",
                                   font=("Arial", 10), bg=BG, padx=12, pady=8)
        mode_frame.pack(fill="x", padx=24, pady=(14, 0))

        tk.Radiobutton(mode_frame, text="Groq  (ענן, חינמי, מהיר)",
                       variable=self.mode, value="groq",
                       font=("Arial", 10), bg=BG, command=self._on_mode_change
                       ).pack(anchor="w")
        tk.Radiobutton(mode_frame, text="ivrit.ai  (RunPod, מדויק לעברית)",
                       variable=self.mode, value="runpod",
                       font=("Arial", 10), bg=BG, command=self._on_mode_change
                       ).pack(anchor="w", pady=(4, 0))

        # Credentials area
        self.creds_outer = tk.Frame(self.root, bg=BG)
        self.creds_outer.pack(fill="x", padx=24, pady=(10, 0))
        self.creds_frame = tk.LabelFrame(self.creds_outer, text=" פרטי חיבור ",
                                         font=("Arial", 10), bg=BG, padx=12, pady=8)
        self.creds_frame.pack(fill="x")
        self._build_creds()

        # --- Steps ---
        steps_container = tk.Frame(self.root, bg=BG)
        steps_container.pack(fill="x", padx=24, pady=(12, 6))
        self.step_labels = []
        for step in ["בדיקת Python", "התקנת חבילות", "בדיקת Node.js (יוטיוב)", "שמירת מפתח (מוצפן)", "כתיבת קבצי אפליקציה"]:
            row = tk.Frame(steps_container, bg=BG)
            row.pack(fill="x", pady=1)
            icon = tk.Label(row, text="○", font=("Arial", 11), bg=BG, fg="#aaa", width=2)
            icon.pack(side="left")
            lbl = tk.Label(row, text=step, font=("Arial", 10), bg=BG, fg="#888", anchor="w")
            lbl.pack(side="left")
            self.step_labels.append((icon, lbl))

        pb_frame = tk.Frame(self.root, bg=BG)
        pb_frame.pack(fill="x", padx=24, pady=(0, 4))
        self.progress = ttk.Progressbar(pb_frame, length=452, mode="determinate",
                                        maximum=100, value=0)
        self.progress.pack(fill="x")

        status_row = tk.Frame(self.root, bg=BG)
        status_row.pack(fill="x", padx=24, pady=(0, 6))
        self.status_var = tk.StringVar(value="")
        tk.Label(status_row, textvariable=self.status_var, font=("Arial", 9),
                 bg=BG, fg="#555", anchor="w").pack(side="left")

        self.btn = tk.Button(self.root, text="התחל התקנה", font=("Arial", 12, "bold"),
                             bg=BLUE, fg="white", relief="flat",
                             padx=20, pady=8, cursor="hand2",
                             command=self.start_install)
        self.btn.pack()

    def _build_creds(self):
        for w in self.creds_frame.winfo_children():
            w.destroy()

        if self.mode.get() == "groq":
            tk.Label(self.creds_frame,
                     text="מפתח חינמי: console.groq.com → API Keys",
                     font=("Arial", 9), bg=BG, fg="#888").pack(anchor="w", pady=(0, 4))
            self.key_var = tk.StringVar(value=load_key("groq"))
            self._key_row("מפתח Groq API:", self.key_var)
        else:
            tk.Label(self.creds_frame,
                     text="המפתחות יישמרו מוצפנים בכספת Windows.",
                     font=("Arial", 9), bg=BG, fg="#888").pack(anchor="w", pady=(0, 4))
            self.key_var = tk.StringVar(value=load_key("runpod"))
            self.endpoint_var = tk.StringVar(value=load_secret("runpod_endpoint"))
            self._key_row("RunPod API Key:", self.key_var)
            self._plain_row("Endpoint ID:      ", self.endpoint_var)

    def _key_row(self, label, var):
        row = tk.Frame(self.creds_frame, bg=BG)
        row.pack(fill="x", pady=2)
        tk.Label(row, text=label, font=("Arial", 9), bg=BG, width=16, anchor="w").pack(side="left")
        entry = tk.Entry(row, textvariable=var, show="*", font=("Arial", 9),
                         width=28, relief="solid", bd=1)
        entry.pack(side="left", padx=(4, 4), ipady=3)
        entry.bind("<Control-v>", lambda e: (var.set(self.root.clipboard_get()), "break"))
        tk.Button(row, text="הדבק", font=("Arial", 8), relief="flat", bg="#ddd",
                  cursor="hand2", command=lambda: var.set(self.root.clipboard_get())
                  ).pack(side="left")

    def _plain_row(self, label, var):
        row = tk.Frame(self.creds_frame, bg=BG)
        row.pack(fill="x", pady=2)
        tk.Label(row, text=label, font=("Arial", 9), bg=BG, width=16, anchor="w").pack(side="left")
        tk.Entry(row, textvariable=var, font=("Arial", 9),
                 width=28, relief="solid", bd=1).pack(side="left", ipady=3)

    def _on_mode_change(self):
        self._build_creds()

    def set_step(self, index, state):
        if index >= len(self.step_labels):
            return
        icon, lbl = self.step_labels[index]
        styles = {
            "pending": ("○", "#aaa",    "#888"),
            "active":  ("◉", BLUE,      "#333"),
            "done":    ("✓", GREEN,     GREEN),
            "warning": ("⚠", "#f57c00", "#f57c00"),
            "error":   ("✗", "#c62828", "#c62828"),
        }
        sym, icon_color, text_color = styles[state]
        icon.config(text=sym, fg=icon_color)
        lbl.config(fg=text_color)

    def update_status(self, text):
        self.root.after(0, lambda: self.status_var.set(text))

    def update_step(self, index, state):
        self.root.after(0, lambda: self.set_step(index, state))

    def progress_start(self):
        def _run():
            self.progress.config(mode="indeterminate")
            self.progress.start(12)
        self.root.after(0, _run)

    def progress_done(self, pct):
        def _run():
            self.progress.stop()
            self.progress.config(mode="determinate", value=pct)
        self.root.after(0, _run)

    def start_install(self):
        key = self.key_var.get().strip()
        if not key:
            messagebox.showwarning("חסר מפתח", "הכנס מפתח API לפני ההתקנה.")
            return
        if self.mode.get() == "runpod" and not self.endpoint_var.get().strip():
            messagebox.showwarning("חסר Endpoint", "הכנס Endpoint ID של RunPod.")
            return
        self.btn.config(state="disabled", text="מתקין...")
        threading.Thread(target=self.install_thread, daemon=True).start()

    def install_thread(self):
        mode = self.mode.get()

        # Step 1 — Python
        self.update_step(0, "active")
        self.update_status("בודק Python...")
        self.progress_start()
        ok, _ = run_cmd([sys.executable, "--version"])
        if not ok:
            self.progress_done(0); self.update_step(0, "error")
            self.update_status("Python לא נמצא"); return
        self.progress_done(20); self.update_step(0, "done")

        # Step 2 — Packages
        self.update_step(1, "active")
        pkgs = ["groq", "yt-dlp", "tkinterdnd2", "imageio-ffmpeg", "keyring", "requests"]
        self.update_status(f"מתקין חבילות...")
        self.progress_start()
        ok, err = run_cmd([sys.executable, "-m", "pip", "install", *pkgs, "--upgrade", "--quiet"])
        if not ok:
            self.progress_done(20); self.update_step(1, "error")
            self.update_status(f"שגיאה: {err[:80]}"); return
        self.progress_done(40); self.update_step(1, "done")

        # Step 3 — Node.js
        self.update_step(2, "active")
        self.update_status("בודק Node.js...")
        self.progress_start()
        ok, _ = run_cmd(["node", "--version"])
        self.progress_done(60)
        self.update_step(2, "done" if ok else "warning")
        if not ok:
            self.root.after(0, self._ask_install_node)

        # Step 4 — Save keys
        self.update_step(3, "active")
        self.update_status("שומר מפתחות בכספת Windows...")
        self.progress_start()
        try:
            save_key(mode, self.key_var.get().strip())
            if mode == "runpod":
                save_secret("runpod_endpoint", self.endpoint_var.get().strip())
            # Save mode to config.txt
            here = Path(__file__).parent
            (here / "config.txt").write_text(mode, encoding="utf-8")
            self.progress_done(80); self.update_step(3, "done")
        except Exception as e:
            self.progress_done(60); self.update_step(3, "error")
            self.update_status(f"שגיאה: {str(e)[:60]}"); return

        # Step 5 — Write app files
        self.update_step(4, "active")
        self.update_status("כותב קבצי אפליקציה...")
        self.progress_start()
        try:
            here = Path(__file__).parent
            here.joinpath("transcribe.py").write_text(TRANSCRIBE_PY, encoding="utf-8")
            here.joinpath("תמלל.bat").write_text(
                "@echo off\nchcp 65001 > nul\npython \"%~dp0transcribe.py\"\n",
                encoding="utf-8"
            )
            self.progress_done(100); self.update_step(4, "done")
        except Exception as e:
            self.progress_done(80); self.update_step(4, "error")
            self.update_status(f"שגיאה: {str(e)[:60]}"); return

        self.update_status("")
        self.root.after(0, self.show_done)

    def _ask_install_node(self):
        import webbrowser
        if messagebox.askyesno("Node.js נדרש",
                               "לתמלול סרטוני יוטיוב נדרש Node.js.\n\nלפתוח דף הורדה?"):
            webbrowser.open("https://nodejs.org/en/download")

    def show_done(self):
        self.btn.config(text="✓ ההתקנה הושלמה!", bg=GREEN)
        messagebox.showinfo("הושלם!", "ההתקנה הושלמה.\n\nפתח את תמלל.bat כדי להתחיל.")
        self.root.destroy()


if __name__ == "__main__":
    root = tk.Tk()
    app = SetupApp(root)
    root.mainloop()
