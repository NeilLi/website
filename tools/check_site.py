"""Check staged local HTML links, fragments, dependencies, and sitemap routes."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import sys
import xml.etree.ElementTree as ET

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.links = []
        self.duplicates = []
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        ident = attrs.get('id')
        if ident:
            if ident in self.ids:
                self.duplicates.append(ident)
            self.ids.add(ident)
        for key in ('href', 'src'):
            if attrs.get(key):
                self.links.append(attrs[key])

    handle_startendtag = handle_starttag

def check(root):
    root = root.resolve()
    docs = {p: Document(p.read_text()) for p in root.rglob('*.html')}
    problems = []
    def resolve(source, url):
        parsed = urlsplit(url)
        if parsed.scheme or parsed.netloc:
            return
        path = unquote(parsed.path)
        target = ((root / path.lstrip('/')) if path.startswith('/') else source.parent / path).resolve() if path else source
        if not target.is_relative_to(root):
            problems.append(f'{source.relative_to(root)}: path outside build: {url}')
            return
        if target.is_dir():
            target = target / 'index.html'
        if not target.is_file():
            problems.append(f'{source.relative_to(root)}: missing {url}')
        elif parsed.fragment and target in docs and unquote(parsed.fragment) not in docs[target].ids:
            problems.append(f'{source.relative_to(root)}: missing fragment {url}')
    for source, doc in docs.items():
        for ident in doc.duplicates:
            problems.append(f'{source.relative_to(root)}: duplicate id {ident}')
        for url in doc.links:
            resolve(source, url)
    for source in root.rglob('*.css'):
        for url in re.findall(r'url\([\'"]?([^\)\'\"]+)', source.read_text()):
            resolve(source, url)
    for worker in (root / 'studio').glob('*.js'):
        for arguments in re.findall(r'importScripts\((.*?)\)', worker.read_text()):
            for url in re.findall(r"['\"]([^'\"]+)['\"]", arguments):
                resolve(worker, url)
        for url in re.findall(r"request\.open\('GET','([^']+)'", worker.read_text()):
            resolve(worker, url)
    for location in ET.parse(root / 'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
        resolve(root / 'sitemap.xml', urlsplit(location.text).path)
    if problems:
        raise SystemExit('\n'.join(problems))
    print(f'PASS: {len(docs)} pages; local links, fragments, stylesheet/worker dependencies, and sitemap routes.')

if __name__ == '__main__':
    check(Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / 'dist/client')
