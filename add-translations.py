#!/usr/bin/env python3
"""
Script to add PreparationPlan translations to all language files.
Reads the English version and copies to all other language files.
"""

import json
import os

# Path to locale files
locales_path = '/var/home/marcel/Repo/nocts-back-on-track/client/public/locales'
languages = ['en', 'en-simple', 'de', 'es', 'fr', 'ru', 'zh', 'ja', 'ar']

# Read the English file
en_file_path = os.path.join(locales_path, 'en', 'common.json')
with open(en_file_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Extract the preparationPlan section
prep_plan = en_data.get('preparationPlan', {})

# Add to each language file
for lang in languages:
    lang_file_path = os.path.join(locales_path, lang, 'common.json')
    
    # Read existing content
    with open(lang_file_path, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
    
    # Add/update preparationPlan section
    lang_data['preparationPlan'] = prep_plan
    
    # Write back
    with open(lang_file_path, 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Updated {lang}/common.json")

print("\nAll language files updated successfully!")
print("Note: Translation content is in English. Professional translators should review and update for each language.")
