#!/usr/bin/env python3
"""
Update all language files with new translation keys from English.
"""

import json
import os

locales_path = '/var/home/marcel/Repo/nocts-back-on-track/client/public/locales'
languages = ['en', 'en-simple', 'de', 'es', 'fr', 'ru', 'zh', 'ja', 'ar']

# Read the English file
en_file_path = os.path.join(locales_path, 'en', 'common.json')
with open(en_file_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Extract sections we want to sync
sections_to_sync = ['mainMenu', 'diary', 'meditation', 'hobbies', 'weight', 'mood', 'achievements', 'selfAssessment']

# Update each language file
for lang in languages:
    lang_file_path = os.path.join(locales_path, lang, 'common.json')
    
    # Read existing content
    with open(lang_file_path, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
    
    # Update sections (use English as placeholder if it's not English)
    for section in sections_to_sync:
        lang_data[section] = en_data[section]
    
    # Write back
    with open(lang_file_path, 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Updated {lang}/common.json with mainMenu, diary, meditation, hobbies, and weight sections")

print("\nAll language files updated with new translation keys!")
