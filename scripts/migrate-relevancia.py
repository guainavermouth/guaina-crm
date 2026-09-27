#!/usr/bin/env python3
"""Extract relevancia from notas into the relevancia column, then clean notas."""

import json
import os
import re
import subprocess
import sys

URL = os.environ["VITE_SUPABASE_URL"] + "/rest/v1/leads"
KEY = os.environ["VITE_SUPABASE_ANON_KEY"]
H = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

RE_EXPLICIT = re.compile(
    r"Auditoria\s+27/09/2026\s*·\s*Relevancia\s+(alta|media|baja)\s*:\s*",
    re.I,
)
RE_NUEVO = re.compile(r"^Nuevo\s*\(Auditoria\s+27/09/2026\)\s*·\s*", re.I)


def call(method, url, body=None):
    cmd = ["curl", "-sS", "--fail-with-body", "-X", method, url]
    for k, v in H.items():
        cmd += ["-H", f"{k}: {v}"]
    if body is not None:
        cmd += ["--data-binary", "@-"]
        out = subprocess.run(cmd, input=json.dumps(body).encode(), capture_output=True)
    else:
        out = subprocess.run(cmd, capture_output=True)
    if out.returncode != 0:
        raise RuntimeError(out.stdout.decode() + out.stderr.decode())
    return json.loads(out.stdout or b"[]")


def parse(notas: str, status: str):
    notas = (notas or "").strip()
    if not notas:
        return None, notas

    m = RE_EXPLICIT.search(notas)
    if m:
        rel = m.group(1).lower()
        cleaned = RE_EXPLICIT.sub("", notas, count=1).strip()
        # Drop leftover audit stamp if notes become empty-ish
        cleaned = re.sub(r"^Auditoria\s+27/09/2026\s*·\s*", "", cleaned).strip()
        return rel, cleaned

    if RE_NUEVO.match(notas):
        cleaned = RE_NUEVO.sub("", notas).strip()
        return "alta", cleaned

    if status == "Descartado" and "Descartado en Auditoria" in notas:
        return "baja", notas

    return None, notas


def main():
    # Probe column
    probe = subprocess.run(
        [
            "curl", "-sS", f"{URL}?select=id,relevancia&limit=1",
            "-H", f"apikey: {KEY}",
            "-H", f"Authorization: Bearer {KEY}",
        ],
        capture_output=True,
    )
    body = probe.stdout.decode()
    if "relevancia" in body and ("Could not find" in body or "PGRST" in body):
        print("ERROR: falta la columna relevancia. Corré scripts/add-relevancia.sql en el SQL Editor.")
        print(body)
        sys.exit(1)
    if probe.returncode != 0 or "Could not find" in body:
        print("ERROR: no se pudo leer relevancia.")
        print(body)
        sys.exit(1)

    leads = call("GET", f"{URL}?select=id,nombre,status,notas,relevancia&order=nombre.asc")
    updated = 0
    for lead in leads:
        rel, cleaned = parse(lead.get("notas") or "", lead.get("status") or "")
        patch = {}
        if rel and lead.get("relevancia") != rel:
            patch["relevancia"] = rel
        if cleaned != (lead.get("notas") or "").strip():
            patch["notas"] = cleaned
        if not patch:
            continue
        call("PATCH", f"{URL}?id=eq.{lead['id']}", patch)
        updated += 1
        print(f"OK {lead['nombre']}: rel={patch.get('relevancia', lead.get('relevancia'))}")

    print(f"\nUpdated {updated}/{len(leads)}")


if __name__ == "__main__":
    main()
