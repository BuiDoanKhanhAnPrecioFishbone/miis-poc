# -*- coding: utf-8 -*-
import io,sys,re
p='app/globals.css'
s=io.open(p,encoding='utf-8',newline='').read()
sets={
 'A':("#F0E9FC","#6E40C9","#55279E","#43217A"),
 'B':("#F3EAFB","#7B3FCC","#5F2AA0","#4A2280"),
}
c100,c500,c700,c800 = sets[sys.argv[1]]
s=re.sub(r'--mi-ai-100: #[0-9A-Fa-f]{6};', f'--mi-ai-100: {c100};', s, 1)
s=re.sub(r'--mi-ai-500: #[0-9A-Fa-f]{6};', f'--mi-ai-500: {c500};', s, 1)
s=re.sub(r'--mi-ai-700: #[0-9A-Fa-f]{6};', f'--mi-ai-700: {c700};', s, 1)
s=re.sub(r'--mi-ai-800: #[0-9A-Fa-f]{6};', f'--mi-ai-800: {c800};', s, 1)
if len(sys.argv)>2 and sys.argv[2]=='violet':
    s=s.replace('''    var(--mi-ai-500) 55%,
    var(--mi-slate-800) 100%''','''    var(--mi-ai-500) 100%''')
io.open(p,'w',encoding='utf-8',newline='').write(s)
print('set',sys.argv[1:])
