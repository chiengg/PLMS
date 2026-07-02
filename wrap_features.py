import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # ensure import
    if 'import { FeatureMarker }' not in content:
        content = re.sub(r"(import .*?;?\n)", r"\1import { FeatureMarker } from '@/components/FeatureMarker';\n", content, count=1)

    # We need to find all <Button>...</Button>
    # and <span ...onClick...>...</span>
    # and <a ...onClick...>...</a>
    # that are NOT already inside <FeatureMarker>
    
    # A simple way to avoid double wrapping is to temporarily hide existing FeatureMarkers
    # But since we reverted everything, there are no FeatureMarkers in these files (except the ones we added which are gone, and maybe some existing ones).
    
    # Let's find existing FeatureMarkers and replace them with a placeholder
    markers = []
    def marker_replacer(match):
        markers.append(match.group(0))
        return f"___MARKER_{len(markers)-1}___"
    
    # Match <FeatureMarker ...> ... </FeatureMarker>
    # This requires a recursive regex or a parser, but assuming no nested FeatureMarkers:
    content = re.sub(r'<FeatureMarker[^>]*>.*?</FeatureMarker>', marker_replacer, content, flags=re.DOTALL)

    def button_replacer(match):
        full_match = match.group(0)
        
        # Extract inner text to guess title
        # Remove nested tags for title
        inner_text = re.sub(r'<[^>]+>', '', full_match).strip()
        title = inner_text if inner_text else "交互操作"
        title = re.sub(r'[\r\n\t]', '', title).strip()
        
        # Heuristics
        if 'Search' in full_match and not inner_text:
            title = '搜索'
        elif 'Plus' in full_match and not inner_text:
            title = '添加'
        elif 'Chevron' in full_match and not inner_text:
            title = '展开/收起'
            
        desc = f"交互说明：点击执行{title}操作。"
        
        # Some custom descriptions
        if '删除' in title:
            desc = "交互说明：点击删除选中的数据项，操作不可恢复。"
        elif '编辑' in title or '修改' in title:
            desc = "交互说明：点击打开编辑弹窗，修改当前项信息。"
        elif '添加' in title or '新增' in title:
            desc = "交互说明：点击打开新增弹窗，录入新数据。"
        elif '搜索' in title or '查询' in title:
            desc = "交互说明：根据设置的筛选条件执行搜索，更新列表数据。"
        elif '取消' in title or '关闭' in title:
            desc = "交互说明：放弃当前操作并关闭弹窗。"
        elif '保存' in title or '确定' in title or '确认' in title:
            desc = "交互说明：校验表单数据并提交保存。"
        elif '导入' in title:
            desc = "交互说明：点击上传文件并批量导入数据。"
        elif '导出' in title:
            desc = "交互说明：点击将当前列表数据导出为Excel文件。"
            
        return f'<FeatureMarker title="{title}" description="{desc}">\n{full_match}\n</FeatureMarker>'

    # Match <Button ...> ... </Button> (assuming no nested Buttons)
    content = re.sub(r'<Button[^>]*>.*?</Button>', button_replacer, content, flags=re.DOTALL)
    
    # Match <span ... onClick ...> ... </span>
    content = re.sub(r'<span[^>]*onClick=[^>]*>.*?</span>', button_replacer, content, flags=re.DOTALL)
    
    # Match <a ... onClick ...> ... </a>
    content = re.sub(r'<a[^>]*onClick=[^>]*>.*?</a>', button_replacer, content, flags=re.DOTALL)

    # Restore FeatureMarkers
    for i, marker in enumerate(markers):
        content = content.replace(f"___MARKER_{i}___", marker)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Processed {filepath}")

for root, dirs, files in os.walk('src/pages'):
    if 'components' in root:
        for file in files:
            if file.endswith('.tsx'):
                process_file(os.path.join(root, file))

