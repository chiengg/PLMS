import os
import re
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # ensure import
    if 'import { FeatureMarker }' not in content:
        content = re.sub(r"(import .*?;?\n)", r"\1import { FeatureMarker } from '@/components/FeatureMarker';\n", content, count=1)

    def replacer(match):
        full_match = match.group(0)
        # heuristic to find title
        text_match = re.search(r'>([^<]+)</(Button|span|a)>', full_match)
        title = text_match.group(1).strip() if text_match else '未命名操作'
        title = re.sub(r'[\r\n\t]', '', title).strip()
        
        # Some cleanup
        if 'Search' in full_match and '搜索' in title:
            title = '搜索'
        elif 'Plus' in full_match and '添加' in title:
            title = '添加'

        if not title:
            title = "交互操作"

        desc = f"交互说明：点击执行{title}操作。"

        if '<FeatureMarker' in full_match:
            return full_match # already wrapped
        
        return f'<FeatureMarker title="{title}" description="{desc}">\n{full_match}\n</FeatureMarker>'

    # Regex for Button
    # Needs to handle nested tags inside Button, so non-greedy up to </Button>
    # This is a bit tricky with regex, we can try matching simple ones
    content = re.sub(r'<Button[^>]*>.*?</Button>', replacer, content, flags=re.DOTALL)
    
    # Regex for span with onClick
    content = re.sub(r'<span[^>]*onClick=[^>]*>.*?</span>', replacer, content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed {filepath}")

for root, dirs, files in os.walk('src/pages'):
    if 'components' in root:
        for file in files:
            if file.endswith('.tsx'):
                process_file(os.path.join(root, file))

