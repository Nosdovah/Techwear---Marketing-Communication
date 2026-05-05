import urllib.request, re, os
html = urllib.request.urlopen('https://techracer.id/').read().decode('utf-8')
images = re.findall(r'src=[\"\']([^\"\']+\.(?:jpg|jpeg|webp))[\"\']', html)
images = list(set([img if img.startswith('http') else 'https://techracer.id/' + img.lstrip('/') for img in images]))

os.makedirs('images', exist_ok=True)
count = 6
for img in images:
    if 'logo' not in img.lower() and 'icon' not in img.lower() and 'frame' not in img.lower() and 'visa' not in img.lower() and 'png' not in img.lower():
        print("Downloading", img)
        try:
            urllib.request.urlretrieve(img, f'images/techracer_web_{count}.jpg')
            count += 1
        except Exception as e:
            print("Failed", img, e)
