"""Cut the person out of hero-bg.webp (flat grey studio backdrop) -> hero-cutout.webp with alpha.

Background colour is estimated per row from the empty side margins, alpha comes from the
colour distance to that background, and edge pixels are un-mixed from the grey so no halo remains.
"""
import numpy as np
from PIL import Image
from scipy import ndimage

SRC, OUT = 'public/images/hero-bg.webp', 'public/images/hero-cutout.webp'
T0, T1 = 9.0, 30.0  # colour distance: <=T0 is background, >=T1 is fully the person

img = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
h, w, _ = img.shape

# per-row background colour from the left/right margins, smoothed vertically
margins = np.concatenate([img[:, :260], img[:, -220:]], axis=1)
bg_row = ndimage.uniform_filter1d(np.median(margins, axis=1), size=41, axis=0)
bg = np.broadcast_to(bg_row[:, None, :], img.shape)

dist = np.linalg.norm(img - bg, axis=2)
dist = ndimage.median_filter(dist, size=3)  # suppress backdrop texture noise
alpha = np.clip((dist - T0) / (T1 - T0), 0, 1)

# keep only the person: largest connected blob, holes filled, then a soft band around its edge
solid = alpha > 0.5
labels, n = ndimage.label(solid)
person = labels == (np.argmax(ndimage.sum(solid, labels, range(1, n + 1))) + 1)
person = ndimage.binary_fill_holes(person)
core = ndimage.binary_erosion(person, iterations=3)
band = ndimage.binary_dilation(person, iterations=3)
alpha = np.where(core, 1.0, np.where(band, alpha, 0.0))
alpha = ndimage.gaussian_filter(alpha, 0.6)

# un-mix grey from semi-transparent edge pixels: C = a*F + (1-a)*B  ->  F
a = np.clip(alpha, 1e-3, 1)[..., None]
fg = np.clip((img - (1 - a) * bg) / a, 0, 255)
fg = np.where(alpha[..., None] > 0.98, img, fg)

rgba = np.dstack([fg, alpha * 255]).round().astype(np.uint8)
Image.fromarray(rgba, 'RGBA').save(OUT, quality=92, method=6)
print('saved', OUT, f'person covers {person.mean():.1%} of the frame')
