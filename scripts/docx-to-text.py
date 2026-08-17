"""Extract readable text from a .docx, preserving paragraph and table-cell breaks.

Strips every tag rather than trying to match <w:t>…</w:t> pairs: a self-closing
<w:t/> makes a non-greedy pair match run on and swallow the table markup between
it and the next closing tag.

The repo already keeps requirements-v2.5-EN.txt beside its .docx so the spec is
greppable; these two get the same treatment.
"""
import io
import re
import sys
import zipfile


def text_of(path: str) -> str:
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8")

    xml = xml.replace("<w:tab/>", "\t")
    xml = xml.replace("<w:br/>", "\n")
    # A cell boundary is a column separator; a row and a paragraph end a line.
    xml = re.sub(r"</w:tc>", "\t", xml)
    xml = re.sub(r"</w:tr>", "\n", xml)
    xml = re.sub(r"</w:p>", "\n", xml)
    # Everything else is markup.
    out = re.sub(r"<[^>]+>", "", xml)

    out = (out.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
              .replace("&quot;", '"').replace("&apos;", "'"))
    out = re.sub(r"[ \t]+\n", "\n", out)
    out = re.sub(r"\t{2,}", "\t", out)
    out = re.sub(r"\n{3,}", "\n\n", out)
    return out.strip()


for arg in sys.argv[1:]:
    src, dst = arg.split("->")
    body = text_of(src)
    io.open(dst, "w", encoding="utf-8").write(body + "\n")
    print("%s  (%d chars, %d lines)" % (dst, len(body), body.count("\n") + 1))
