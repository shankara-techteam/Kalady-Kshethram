import os
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Update Header Glassmorphism
    old_header = 'class="w-full top-0 sticky bg-surface/80 backdrop-blur-md border-b border-sandalwood/25 z-50 transition-all duration-300"'
    new_header = 'class="w-full top-0 sticky bg-surface/85 backdrop-blur-xl border-b border-sandalwood/20 z-50 transition-all duration-500 shadow-[0_4px_32px_rgba(87,0,0,0.04)]"'
    content = content.replace(old_header, new_header)

    # 2. Update Dropdown Menu Glassmorphism and Animation
    old_dropdown = 'class="absolute left-0 mt-2 w-48 rounded-xl bg-surface/95 backdrop-blur-md border border-sandalwood/25 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 py-1.5"'
    new_dropdown = 'class="absolute left-0 mt-2 w-48 rounded-xl bg-surface/95 backdrop-blur-xl border border-sandalwood/20 shadow-[0_12px_40px_rgba(87,0,0,0.08)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-400 ease-out transform translate-y-4 group-hover:translate-y-0 z-50 py-1.5"'
    content = content.replace(old_dropdown, new_dropdown)

    # 3. Add Ambient Glow CSS and Better Hover Cards
    ambient_glow_css = """
        /* Premium Polish Enhancements */
        .ambient-glow-bg {
            background: radial-gradient(circle at 50% 0%, rgba(87,0,0,0.03) 0%, transparent 70%);
        }
        .hover-card-trigger {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease, box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-card-trigger:hover {
            transform: translateY(-8px) scale(1.01);
            box-shadow: 0 20px 40px rgba(87, 0, 0, 0.08);
            border-color: rgba(194, 178, 128, 0.5);
        }
"""
    # Replace old hover-card-trigger with the new one, and insert ambient-glow
    # Let's just find </style> and inject before it
    if "/* Premium Polish Enhancements */" not in content:
        content = content.replace("</style>", ambient_glow_css + "</style>")
        
        # Remove the old hover-card-trigger CSS if it exists
        old_hover_trigger = """        .hover-card-trigger {
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .hover-card-trigger:hover {
            transform: translateY(-8px);
        }"""
        content = content.replace(old_hover_trigger, "")
        
        old_hover_trigger2 = """.hover-card-trigger {
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .hover-card-trigger:hover {
            transform: translateY(-8px);
        }"""
        content = content.replace(old_hover_trigger2, "")


    # 4. Enhance buttons scaling
    # Replace hover:scale-105 active:scale-95 with smoother hover:scale-[1.02] active:scale-[0.98] on standard buttons
    # Wait, some buttons are small, 1.05 might be fine. But on larger buttons like Donate, it was 1.03.
    content = content.replace("hover:scale-105 active:scale-95", "hover:scale-[1.03] active:scale-[0.97] hover:shadow-lg hover:shadow-primary/10")
    content = content.replace("hover:scale-[1.03] active:scale-[0.97]", "hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_8px_16px_rgba(87,0,0,0.1)]")
    # Clean up double shadow if happened
    content = content.replace("hover:shadow-lg hover:shadow-primary/10 hover:shadow-[0_8px_16px_rgba(87,0,0,0.1)]", "hover:shadow-[0_8px_16px_rgba(87,0,0,0.12)]")

    # 5. Add ambient glow to heroes
    # For index.html: <section id="home" class="relative min-h-[90vh] ...
    # We can just add ambient-glow-bg to <main> or the top section
    content = content.replace("<main>", "<main class=\"ambient-glow-bg\">")
    
    with open(filepath, 'w') as f:
        f.write(content)

for filepath in glob.glob("*.html"):
    process_file(filepath)
    print(f"Processed {filepath}")
