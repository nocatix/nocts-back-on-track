#!/usr/bin/env python3
"""
Extract hobbies data from Hobbies.js and add to translation files.
Uses ast.literal_eval for more robust parsing.
"""

import json
import os
import re
import ast

# Read Hobbies.js
with open('/var/home/marcel/Repo/nocts-back-on-track/client/src/pages/Hobbies.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract hobbies array
start = content.find('const hobbies = [')
end = content.find('];', start) + 1
array_str = content[start + len('const hobbies = '):end]

# Remove comments
array_str = re.sub(r'//.*?$', '', array_str, flags=re.MULTILINE)

# Convert to Python dict syntax
# 1. Replace unquoted keys with quoted keys
array_str = re.sub(r'(\w+):', r'"\1":', array_str)

# 2. Replace single quotes with double quotes, handling escaped quotes
# Use a more sophisticated approach
def fix_quotes(text):
    result = []
    in_string = False
    escape = False
    quote_char = None
    i = 0
    while i < len(text):
        char = text[i]
        if escape:
            result.append(char)
            escape = False
        elif char == '\\':
            result.append(char)
            escape = True
        elif char == "'" and not in_string:
            # Start of single-quoted string, convert to double quote
            result.append('"')
            in_string = True
            quote_char = "'"
        elif char == "'" and in_string and quote_char == "'":
            # End of single-quoted string
            result.append('"')
            in_string = False
            quote_char = None
        elif char == '"' and not in_string:
            # Double quote outside string - convert to backslash escape
            result.append('\\"')
        elif char == '"' and in_string and quote_char == "'":
            # Double quote inside single-quoted string - needs escaping
            result.append('\\"')
        else:
            result.append(char)
        i += 1
    return ''.join(result)

array_str = fix_quotes(array_str)

# 3. Replace trailing commas
array_str = re.sub(r',(\s*[\}\]])', r'\1', array_str)

try:
    hobbies = ast.literal_eval(array_str)
    print(f"✓ Successfully extracted {len(hobbies)} hobbies")
except (ValueError, SyntaxError) as e:
    print(f"✗ Parse error: {e}")
    print(f"\nFirst 500 chars of converted string:")
    print(array_str[:500])
    exit(1)

# Create UI translations
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
        { "value": "all", "label": "All Hobbies" },
        { "value": "solo", "label": "😊 Solo", "subtext": "(do alone)" },
        { "value": "social", "label": "👥 Social", "subtext": "(with others)" },
        { "value": "outdoor", "label": "🌳 Outdoor" },
        { "value": "indoor", "label": "🏠 Indoor" },
        { "value": "free", "label": "💰 Free" },
        { "value": "paid", "label": "💵 Paid" }
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
    
    print(f"✓ Updated {lang}/common.json with hobbies section")

print("\n✓ All language files updated with hobbies translations!")
