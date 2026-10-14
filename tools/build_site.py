"""Stage SeedCore's static website and fail on missing public assets; no deployment."""
from pathlib import Path
from tempfile import TemporaryDirectory
import shutil
import sys

# Validation should not add generated Python cache files to this static repo.
sys.dont_write_bytecode = True
from check_site import check

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_FILES = (
    'index.html', 'develop.html', 'diy-showcase.html', 'trading.html',
    'activities.html', 'about.html', 'contact.html', 'sitemap.html', 'sitemap.xml',
    'privacy-policy.html', 'terms-of-service.html', 'resources/index.html',
    'assets/seedcore-logo.svg', 'assets/seedcore-mark.svg', 'css/robotics-central.css', 'js/robotics-central.js',
    # Existing legal pages retain their original styling.
    'css/application-site.css',
    # Vendored browser lab: scripts and worker dependencies must ship together.
    'studio/LICENSE', 'studio/index.html', 'studio/styles.css', 'studio/physics.js',
    'studio/physics-build.js', 'studio/physics-build.json', 'studio/physics-wasm.js',
    'studio/physics-worker-loader.js', 'studio/mini-physics.wasm', 'studio/sim-contracts.js', 'studio/simulation-worker.js', 'studio/app.js',
    # SIM-3 3D Studio & artifacts
    'studio/tree-lab.html', 'studio/tree-lab.js', 'studio/tree-lab-ui.js', 'studio/tree-physics-wasm.js', 'studio/sim-contracts.d.ts',
)

def main():
    missing = [name for name in PUBLIC_FILES if not (ROOT / name).is_file()]
    if missing:
        raise SystemExit('Missing public files: ' + ', '.join(missing))
    metadata = ROOT / '.openai/hosting.json'
    worker = ROOT / 'dist/server/index.js'
    if not metadata.is_file() or not worker.is_file():
        raise SystemExit('Existing hosting metadata and asset worker are required.')

    # Validate before touching the prior build; copy into a fresh staging directory.
    dist = ROOT / 'dist'
    with TemporaryDirectory(prefix='.site-stage-', dir=dist) as temporary:
        staged = Path(temporary) / 'client'
        for name in PUBLIC_FILES:
            target = staged / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / name, target)
        check(staged)
        previous = Path(temporary) / 'previous-client'
        client = dist / 'client'
        if client.exists():
            client.rename(previous)
        try:
            staged.rename(client)
        except OSError:
            if previous.exists():
                previous.rename(client)
            raise
    destination = dist / '.openai'
    destination.mkdir(parents=True, exist_ok=True)
    shutil.copy2(metadata, destination / 'hosting.json')
    print(f'Staged {len(PUBLIC_FILES)} public files in dist/client; asset worker preserved. No deployment performed.')

if __name__ == '__main__':
    main()
