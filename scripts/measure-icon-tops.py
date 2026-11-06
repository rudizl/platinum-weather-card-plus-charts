#!/usr/bin/env python3
"""Where the drawing of each built-in icon starts, as the card draws it (#40).

Each icon is drawn as the big icon is, in a box of 140 by 120 with the picture contained and centred, on the background of a dark
card, at four times the resolution; the top is the first row whose colour differs from the background by more than 60 (the sum of
the three channels). An animated icon is sampled over ten frames and its highest point kept, so that a part that rises while it moves
is not cut by a raise. The sun (clear-day) starts at 2.5 px; an icon that starts lower than that by more than a pixel is raised by a
viewBox. Needs Python 3, Playwright with Chromium, and Pillow; not part of the build.

    python3 scripts/measure-icon-tops.py s  [ICON_DIR] [OUT.json]   # the static icons, one frame each
    python3 scripts/measure-icon-tops.py a1 [ICON_DIR] [OUT.json]   # the first half of the animated ones
    python3 scripts/measure-icon-tops.py a2 [ICON_DIR] [OUT.json]   # the second half (each part fits in a few minutes)
"""
import asyncio, json, os, io, re, sys
from playwright.async_api import async_playwright
from PIL import Image
D=sys.argv[2] if len(sys.argv)>2 else '/tmp/m2/dist'; OUT=sys.argv[3] if len(sys.argv)>3 else '/tmp/svgbox.json'; DSF=4
BG=(28,28,28)
# the box of the big icon, as the card draws it: 140 by 120, the picture contained and centred, on the background of a dark card
HTML='''<html><body style="margin:0;background:rgb(28,28,28)"><img id="i" src="file://{f}" style="width:140px;height:120px;object-fit:contain;object-position:center;display:block"></body></html>'''
async def main():
    part=sys.argv[1]
    try: out=json.load(open(OUT))
    except Exception: out={}
    names=sorted(x for x in os.listdir(D) if x.startswith('a-') and x.endswith('.svg'))
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':140,'height':120}, device_scale_factor=DSF)
        for f in sorted(os.listdir(D)):
            if not f.endswith('.svg') or f[:2] not in ('a-','s-') or f in out: continue
            if part=='s' and not f.startswith('s-'): continue
            if part in ('a1','a2') and (not f.startswith('a-') or (names.index(f) < len(names)//2) != (part=='a1')): continue
            os.makedirs('/tmp/svgpage',exist_ok=True); page=f'/tmp/svgpage/{f}.html'; open(page,'w').write(HTML.format(f=os.path.join(D,f)))
            pg=await ctx.new_page(); await pg.goto('file://'+page)
            if not await pg.evaluate("()=>{const i=document.getElementById('i'); return i.complete && i.naturalWidth>0}"): raise SystemExit('did not load '+f)
            tops=[]
            for k in (range(1) if f.startswith('s-') else range(10)):
                await asyncio.sleep(0.3 if f.startswith('a-') else 0.1)
                im=Image.open(io.BytesIO(await pg.screenshot())).convert('RGB'); W,H=im.size; px=im.load(); top=None
                for y in range(H):
                    if any(sum(abs(px[x,y][c]-BG[c]) for c in range(3))>60 for x in range(0,W,1)): top=y; break
                if top is not None: tops.append(top/DSF)
            await pg.close()
            out[f]={'top':min(tops),'first':tops[0]}
        await b.close()
    json.dump(out,open(OUT,'w'),indent=0); print('measured',len(out))
asyncio.run(main())
