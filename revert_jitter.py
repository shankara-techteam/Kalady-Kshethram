import os
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Revert header class
    bad_header = 'class="w-full top-0 sticky bg-surface/85 backdrop-blur-xl border-b border-sandalwood/20 z-50 transition-all duration-500 shadow-[0_4px_32px_rgba(87,0,0,0.04)]"'
    good_header = 'class="w-full top-0 sticky bg-surface/80 backdrop-blur-md border-b border-sandalwood/25 z-50 transition-all duration-300"'
    content = content.replace(bad_header, good_header)

    # 2. Revert <main> class
    content = content.replace('<main class="ambient-glow-bg">', '<main>')
    
    # 3. Clean up the ambient-glow-bg CSS (just to be safe)
    if ".ambient-glow-bg {" in content:
        ambient_glow_css = """        .ambient-glow-bg {
            background: radial-gradient(circle at 50% 0%, rgba(87,0,0,0.03) 0%, transparent 70%);
        }"""
        content = content.replace(ambient_glow_css, "")

    with open(filepath, 'w') as f:
        f.write(content)

for filepath in glob.glob("*.html"):
    process_file(filepath)
    print(f"Processed {filepath}")
