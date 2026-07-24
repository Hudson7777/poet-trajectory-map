import re

src = open('/Users/haoran/Documents/claude-outputs/文人轨迹地图-方案B-手绘水墨风.html').read()
svg = re.search(r'<svg[^>]*>(.*)</svg>', src, re.S).group(1)
defs = re.search(r'<defs>.*?</defs>', svg, re.S).group(0)
land = re.search(r'<g filter="url\(#brush\)">.*?</g>\s*</g>', svg, re.S).group(0)
rivers = re.findall(r'<path d="M[^"]*" fill="none" stroke="#(?:5f7a6e|48655a)"[^>]*/>', svg)
mountains = re.findall(r'<path d="M[^"]*" fill="none" stroke="#3a332a"[^>]*/>', svg)

out = (
    defs + '\n'
    + '<rect width="1650" height="1130" fill="#f6f1e3"/>\n'
    + land + '\n'
    + '\n'.join(rivers) + '\n'
    + '\n'.join(mountains) + '\n'
)
open('data/geo/tang/basemap.svg', 'w').write(out)
print('basemap.svg written')
