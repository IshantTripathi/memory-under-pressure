"""
Build script to generate competition submission PDFs for Memory Under Pressure:
- docs/concept_summary.pdf (1-page briefing)
- docs/memory-under-pressure-blog.pdf (19-section educational monograph)

Uses Microsoft Edge / Chromium headless print-to-pdf engine.
"""

import os
import re
import subprocess
import sys

def find_edge_binary():
    candidates = [
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
        'msedge',
        'google-chrome',
        'chromium',
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return 'msedge'

def render_pdf(html_path, pdf_path, edge_bin):
    abs_html = os.path.abspath(html_path)
    abs_pdf = os.path.abspath(pdf_path)
    os.makedirs(os.path.dirname(abs_pdf), exist_ok=True)
    
    cmd = [
        edge_bin,
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        f'--print-to-pdf={abs_pdf}',
        abs_html
    ]
    print(f"Rendering: {html_path} -> {pdf_path}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error rendering {html_path}: {res.stderr}")
        return False
        
    if os.path.exists(abs_pdf):
        with open(abs_pdf, 'rb') as f:
            content = f.read()
        pages = len(re.findall(rb'/Type\s*/Page\b', content))
        print(f"  Success: {len(content):,} bytes, {pages} page(s)")
        return True
    return False

def main():
    edge_bin = find_edge_binary()
    print(f"Using browser binary: {edge_bin}")
    
    tasks = [
        ('scripts/templates/concept_summary.html', 'docs/concept_summary.pdf'),
        ('scripts/templates/blog.html', 'docs/memory-under-pressure-blog.pdf'),
    ]
    
    for html_file, pdf_file in tasks:
        if not os.path.exists(html_file):
            print(f"Missing template: {html_file}")
            sys.exit(1)
        ok = render_pdf(html_file, pdf_file, edge_bin)
        if not ok:
            sys.exit(1)
            
    print("\nAll submission PDFs generated successfully!")

if __name__ == '__main__':
    main()
