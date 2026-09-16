"""Stage the existing public portfolio for its Sites asset worker; no deployment."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
# Preserve the portfolio's established deployment surface. Historical pages
# remain in the source repository and are not added to the public build.
PUBLIC_FILES = (
    'index.html', 'about.html', 'contact.html', 'privacy-policy.html',
    'terms-of-service.html', 'sitemap.html', 'sitemap.xml', 'resources/index.html',
    'assets/seedcore-logo.svg', 'css/application-site.css', 'css/entrance.css',
    'js/application-site.js', 'images/seedcore-application-city-crafts.jpg',
    'images/seedcore-application-city.jpg', 'images/seedcore-blender-entrance.png',
)
for name in PUBLIC_FILES:
    target = ROOT / 'dist/client' / name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / name, target)
metadata = ROOT / 'dist/.openai'
metadata.mkdir(parents=True, exist_ok=True)
shutil.copy2(ROOT / '.openai/hosting.json', metadata / 'hosting.json')
assert (ROOT / 'dist/server/index.js').is_file(), 'Existing Sites asset worker is required.'
print('Portfolio staged in dist/client; existing asset worker preserved.')
