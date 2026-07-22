#!/usr/bin/env python3
"""Test API response format"""
import sys, json, re
sys.path.insert(0, r'C:/Users/dell/.workbuddy/skills/agnes-ai-api/scripts')
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from agnes_api import chat_completion

prompt = """你是资深高考数学命题专家。请生成 3 道高考数学单项选择题，考查三角恒等变换。

要求：
1. 每道题4个选项，只有一个正确答案
2. 难度1-5
3. 数学公式用 LaTeX 格式，用 $...$ 包裹

严格输出 JSON 数组格式（不要输出任何其他内容）：
[{"module": "triangle", "pointId": "trig-formulas", "type": "single-choice", "difficulty": 1, "content": "题干", "options": ["A","B","C","D"], "answer": 0, "explanation": "解析"}]"""

result = chat_completion(
    model='agnes-2.0-flash',
    messages=[{'role': 'user', 'content': prompt}],
    temperature=0.8,
)
content = result['choices'][0]['message']['content']
print('=== RAW RESPONSE (first 800 chars) ===')
print(content[:800])
print('=== END ===')
print()

# Try different parsing approaches
# 1. Direct parse
try:
    data = json.loads(content)
    print(f'Direct parse OK: {len(data)} questions')
except:
    print('Direct parse failed')

# 2. Strip markdown code blocks
cleaned = re.sub(r'^```(?:json)?\s*\n?', '', content.strip())
cleaned = re.sub(r'\n?```\s*$', '', cleaned).strip()
try:
    data = json.loads(cleaned)
    print(f'Stripped markdown OK: {len(data)} questions')
except:
    print('Stripped markdown parse failed')

# 3. Regex find JSON array
match = re.search(r'\[[\s\S]*\]', content)
if match:
    try:
        data = json.loads(match.group())
        print(f'Regex match OK: {len(data)} questions')
    except json.JSONDecodeError as e:
        print(f'Regex match parse error: {e}')
        # Show the problematic area
        text = match.group()
        pos = e.pos if hasattr(e, 'pos') else 0
        print(f'Error near position {pos}:')
        print(f'  Context: ...{text[max(0,pos-50):pos+50]}...')
else:
    print('No JSON array found in response')
    print(f'Response length: {len(content)} chars')
