# -*- coding: utf-8 -*-
"""Append items 2–20 to instr_whatif_data.json using googletrans (Spanish from build_what_if_google.PAIRS)."""
from __future__ import annotations

import json
import re
import time
from pathlib import Path

from googletrans import Translator

from build_what_if_google import DEST, PAIRS, protect_urls_emails, restore

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "instr_whatif_data.json"


def translate_block(t: Translator, text: str, dest: str) -> str:
    prot, ph = protect_urls_emails(text)
    tr = t.translate(prot, src="es", dest=dest)
    time.sleep(0.22)
    return restore(tr.text, ph)


def main() -> None:
    base = json.loads(DATA.read_text(encoding="utf-8"))
    assert len(base["items"]) >= 1
    translator = Translator()
    start_n = base["items"][-1]["n"] + 1
    for idx, (es_q, es_a) in enumerate(PAIRS, start=1):
        if idx < start_n:
            continue
        qmap = {"esp": es_q}
        amap = {"esp": es_a}
        for key, gdest in DEST:
            qmap[key] = translate_block(translator, es_q, gdest)
        for key, gdest in DEST:
            amap[key] = translate_block(translator, es_a, gdest)
        base["items"].append({"n": idx, "q": qmap, "a": amap})
        print("Appended", idx)
        DATA.write_text(json.dumps(base, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
