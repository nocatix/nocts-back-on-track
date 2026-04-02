#!/usr/bin/env python3
"""
Extract hobbies data from Hobbies.js and add translations to all language files.
"""

import json
import os
import re

# Read Hobbies.js
hobbies_file = '/var/home/marcel/Repo/nocts-back-on-track/client/src/pages/Hobbies.js'
with open(hobbies_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract hobbies array using regex
hobbies_match = re.search(r'const hobbies = \[(.*?)\];', content, re.DOTALL)
if not hobbies_match:
    print("Could not find hobbies array")
    exit(1)

hobbies_js = hobbies_match.group(1)

# Convert JavaScript object syntax to Python dict syntax
# Replace single quotes with double quotes for JSON compatibility
hobbies_py = hobbies_js

# Remove comments
hobbies_py = re.sub(r'//.*$', '', hobbies_py, flags=re.MULTILINE)

# Add quotes around keys (convert JS object keys to JSON)
hobbies_py = re.sub(r'(\w+):', r'"\1":', hobbies_py)

# Replace single quotes with double quotes
hobbies_py = hobbies_py.replace("'", '"')

# Replace trailing commas
hobbies_py = re.sub(r',(\s*[\]\}])', r'\1', hobbies_py)

# Wrap in array brackets if needed
hobbies_py = '[' + hobbies_py + ']'

try:
    hobbies = json.loads(hobbies_py)
except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")
    print(f"Content preview: {hobbies_py[:500]}")
    exit(1)

print(f"Extracted {len(hobbies)} hobbies successfully")

# Create hobbies translations structure
hobbies_translation = {
    "pageTitle": "Discover New Hobbies",
    "subtitle": "Building recovery through engaging activities that bring joy, purpose, and connection",
    "whyHobbiesTitle": "Why Hobbies Matter in Recovery",
    "benefits": [
        {
            "emoji": "⏰",
            "title": "Fill Your Time",
            "description": "Hobbies occupy the time you'd normally spend using. Boredom is dangerous—engagement is safety."
        },
        {
            "emoji": "😊",
            "title": "Release Dopamine",
            "description": "Hobbies give your brain the pleasure it was seeking from addiction—naturally and healthily."
        },
        {
            "emoji": "🎯",
            "title": "Build Purpose",
            "description": "Working toward mastery or goals gives life meaning beyond just \"not using.\""
        },
        {
            "emoji": "🤝",
            "title": "Create Community",
            "description": "Social hobbies connect you to others who share your interests, building healthy relationships."
        },
        {
            "emoji": "💪",
            "title": "Build Confidence",
            "description": "Learning and improving at something creates real achievement and self-respect."
        },
        {
            "emoji": "🧠",
            "title": "Healthy Escape",
            "description": "Hobbies provide mental escape without harmful consequences—pure enjoyment."
        }
    ],
    "filterTitle": "Filter Hobbies",
    "filterOptions": [
        {"value": "all", "label": "All Hobbies"},
        {"value": "solo", "label": "😊 Solo", "subtext": "(do alone)"},
        {"value": "social", "label": "👥 Social", "subtext": "(with others)"},
        {"value": "outdoor", "label": "🌳 Outdoor"},
        {"value": "indoor", "label": "🏠 Indoor"},
        {"value": "free", "label": "💰 Free"},
        {"value": "paid", "label": "💵 Paid"}
    ],
    "categoryLabels": {
        "solo": "😊 Solo",
        "social": "👥 Social",
        "outdoor": "🌳 Outdoor",
        "indoor": "🏠 Indoor",
        "free": "💰 Free",
        "paid": "💵 Paid"
    },
    "recoveryBenefitsTitle": "✨ Recovery Benefits",
    "getStartedTitle": "🚀 Get Started",
    "finalTitle": "Start Exploring",
    "finalMessages": [
        "Pick ONE hobby that genuinely sounds interesting to you. Don't overthink it. Just one.",
        "Try it this week. Give it a real chance. You don't have to be good at it—you just have to do it.",
        "The goal isn't perfection. The goal is engagement, joy, and a life worth living sober."
    ],
    "hobbies": hobbies
}

# Update all language files
locales_path = '/var/home/marcel/Repo/nocts-back-on-track/client/public/locales'
languages = ['en', 'en-simple', 'de', 'es', 'fr', 'ru', 'zh', 'ja', 'ar']

for lang in languages:
    lang_file = os.path.join(locales_path, lang, 'common.json')
    
    with open(lang_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Add or update hobbies section
    data['hobbies'] = hobbies_translation
    
    # Write back
    with open(lang_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Updated {lang}/common.json with hobbies section ({len(hobbies)} hobbies)")

print("\nAll language files updated with hobbies translations!")
