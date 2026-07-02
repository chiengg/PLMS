import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    if 'import { FeatureMarker }' not in content:
        content = re.sub(r"(import .*?;?\n)", r"\1import { FeatureMarker } from '@/components/FeatureMarker';\n", content, count=1)

    def button_replacer(match):
        full_match = match.group(0)
        
        # Extract inner text
        title_match = re.search(r'>\s*([^<>]+?)\s*</(?:Button|span|a|button)>', full_match)
        if title_match:
            title = title_match.group(1).strip()
        else:
            title = "交互操作"
            
        title = re.sub(r'[\r\n\t]', '', title).strip()
        
        if 'Search' in full_match and not title:
            title = '搜索'
        elif 'Plus' in full_match and not title:
            title = '添加'
        elif 'Chevron' in full_match and not title:
            title = '展开/收起'
            
        if not title:
            title = "交互操作"
            
        desc = f"交互说明：点击执行{title}操作。"
        
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
            
        # indent
        lines = full_match.split('\n')
        indent = len(lines[-1]) - len(lines[-1].lstrip())
        spaces = ' ' * indent
            
        return f'<FeatureMarker title="{title}" description="{desc}">\n{spaces}{full_match}\n{spaces}</FeatureMarker>'

    # Match <Button ...> ... </Button>
    content = re.sub(r'<Button[^>]*>.*?</Button>', button_replacer, content, flags=re.DOTALL)
    
    # Match <button ...> ... </button>
    content = re.sub(r'<button[^>]*>.*?</button>', button_replacer, content, flags=re.DOTALL)
    
    # Match <span ... onClick ...> ... </span>
    content = re.sub(r'<span[^>]*onClick=[^>]*>.*?</span>', button_replacer, content, flags=re.DOTALL)
    
    # Match <a ... onClick ...> ... </a>
    content = re.sub(r'<a[^>]*onClick=[^>]*>.*?</a>', button_replacer, content, flags=re.DOTALL)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Processed {filepath}")

for root, dirs, files in os.walk('src/pages'):
    if 'components' in root:
        for file in files:
            if file.endswith('.tsx'):
                process_file(os.path.join(root, file))

