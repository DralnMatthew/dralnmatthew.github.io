// Re-arrange the panels of PDF figures into new PNGs: the phone layouts of
// the wide figures, and the schematic on the social card.
//
// macOS only, nothing to install: like pdf2png.js it runs as JavaScript for
// Automation and draws the vector PDF through PDFKit and CoreGraphics, so
// every panel is rasterised at its final size instead of cut out of a
// bitmap.
//
//   osascript -l JavaScript imbue/_tools/pdflayout.js imbue/_tools/layouts.json [name ...]
//
// layouts.json lists one entry per output PNG; give names to build only
// those. Paths in it are relative to layouts.json itself. An entry:
//
//   "name": { "src": "../_source/fig/overview.pdf",
//             "out": "../static/images/overview-mobile.png",
//             "width": 1200,          canvas width in pixels
//             "pad": 24,              white margin on every side
//             "gap": 40,              between rows
//             "hgap": 32,             between tiles of one row
//             "groups": { "plots": { "maxWidth": 1000 } },
//             "rows": [ { "tiles": [[x0, y0, x1, y1], ...], "group": "plots" }, ... ] }
//
// A tile is a rectangle of the figure in fractions of the page, measured
// from the top-left corner, or { "crop": [...], "erase": [[...], ...] } to
// paint parts of it white again, for where a neighbouring panel reaches
// into the rectangle. A row may set its own "hgap", and "gap" for the
// space above it (to set a y-axis strip cut from one panel right next to
// another panel, or to keep the lines of a legend together). Each row is
// centred. All rows of one group share one scale, the largest at which every
// row of the group fits in the canvas (or in the group's maxWidth), so
// lettering is the same size across them; rows without a group form a group
// of their own.

ObjC.import("Foundation");
ObjC.import("PDFKit");
ObjC.import("CoreGraphics");
ObjC.import("ImageIO");

const CROP_BOX = 1; // kPDFDisplayBoxCropBox
const ALPHA_NONE_SKIP_LAST = 5; // kCGImageAlphaNoneSkipLast: opaque RGB, no alpha channel

function resolve(base, rel) {
  const path = rel.charAt(0) === "/" ? $(rel) : $(base).stringByAppendingPathComponent(rel);
  return path.stringByStandardizingPath.js;
}

function build(name, spec, base) {
  const src = resolve(base, spec.src);
  const out = resolve(base, spec.out);
  const doc = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(src));
  if (doc.isNil()) throw new Error(name + ": cannot open " + src);
  const page = doc.pageAtIndex(0);
  const box = page.boundsForBox(CROP_BOX);
  const fw = box.size.width;
  const fh = box.size.height;

  const W = spec.width;
  const pad = spec.pad || 0;
  const gap = spec.gap || 0;
  const hgap = spec.hgap || 0;
  const groups = spec.groups || {};

  // Tile sizes in PDF points, and the scale (pixels per point) of each group.
  const rows = spec.rows.map(function (row, i) {
    // a rectangle in fractions of the page, from the top-left, in PDF points
    function rect(f) {
      return { x: f[0] * fw, y: (1 - f[3]) * fh, w: (f[2] - f[0]) * fw, h: (f[3] - f[1]) * fh };
    }
    const tiles = row.tiles.map(function (t) {
      const tile = rect(Array.isArray(t) ? t : t.crop);
      tile.erase = (t.erase || []).map(rect);
      return tile;
    });
    return {
      tiles: tiles,
      group: row.group || "row" + i,
      hgap: row.hgap === undefined ? hgap : row.hgap,
      w: tiles.reduce(function (s, t) { return s + t.w; }, 0),
      h: Math.max.apply(null, tiles.map(function (t) { return t.h; })),
    };
  });
  const scale = {};
  rows.forEach(function (r) {
    const room = Math.min(W - 2 * pad, (groups[r.group] || {}).maxWidth || Infinity);
    const s = (room - r.hgap * (r.tiles.length - 1)) / r.w;
    scale[r.group] = Math.min(scale[r.group] || Infinity, s);
  });

  rows.forEach(function (r, i) {
    r.above = i === 0 ? 0 : spec.rows[i].gap === undefined ? gap : spec.rows[i].gap;
  });
  let H = 2 * pad;
  rows.forEach(function (r) { H += r.above + r.h * scale[r.group]; });
  H = Math.round(H);

  const ctx = $.CGBitmapContextCreate(
    null, W, H, 8, 0,
    $.CGColorSpaceCreateWithName($.kCGColorSpaceSRGB),
    ALPHA_NONE_SKIP_LAST
  );
  $.CGContextSetRGBFillColor(ctx, 1, 1, 1, 1);
  $.CGContextFillRect(ctx, $.CGRectMake(0, 0, W, H));
  // plain coverage antialiasing: font smoothing would thicken glyphs past
  // their outlines, into the edge of the neighbouring tile
  $.CGContextSetAllowsFontSmoothing(ctx, false);
  $.CGContextSetShouldSmoothFonts(ctx, false);

  let top = pad; // from the top edge, in pixels
  rows.forEach(function (r) {
    const s = scale[r.group];
    top += r.above;
    let left = (W - (r.w * s + r.hgap * (r.tiles.length - 1))) / 2;
    r.tiles.forEach(function (t) {
      const dw = t.w * s;
      const dh = t.h * s;
      // CoreGraphics counts y from the bottom; tiles sit vertically centred in their row
      const bottom = H - top - (r.h * s + dh) / 2;
      $.CGContextSaveGState(ctx);
      $.CGContextClipToRect(ctx, $.CGRectMake(left, bottom, dw, dh));
      $.CGContextTranslateCTM(ctx, left - t.x * s, bottom - t.y * s);
      $.CGContextScaleCTM(ctx, s, s);
      // drawWithBox maps the crop box's own origin to (0, 0)
      page.drawWithBoxToContext(CROP_BOX, ctx);
      $.CGContextSetRGBFillColor(ctx, 1, 1, 1, 1);
      t.erase.forEach(function (e) {
        $.CGContextFillRect(ctx, $.CGRectMake(e.x, e.y, e.w, e.h));
      });
      $.CGContextRestoreGState(ctx);
      left += dw + r.hgap;
    });
    top += r.h * s;
  });

  const dest = $.CGImageDestinationCreateWithURL(
    $.NSURL.fileURLWithPath(out), $("public.png"), 1, null
  );
  $.CGImageDestinationAddImage(dest, $.CGBitmapContextCreateImage(ctx), null);
  if (!$.CGImageDestinationFinalize(dest)) throw new Error(name + ": cannot write " + out);
  return spec.out + "  " + W + "x" + H;
}

function run(argv) {
  if (argv.length < 1) throw new Error("usage: pdflayout.js <layouts.json> [name ...]");
  const specPath = resolve($.NSFileManager.defaultManager.currentDirectoryPath.js, argv[0]);
  const text = $.NSString.stringWithContentsOfFileEncodingError(specPath, $.NSUTF8StringEncoding, null);
  if (text.isNil()) throw new Error("cannot read " + specPath);
  const all = JSON.parse(text.js);
  const base = $(specPath).stringByDeletingLastPathComponent.js;
  const names = argv.length > 1 ? argv.slice(1) : Object.keys(all);
  return names.map(function (n) {
    if (!all[n]) throw new Error("no layout named " + n);
    return build(n, all[n], base);
  }).join("\n");
}
