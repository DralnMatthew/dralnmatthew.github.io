// Render page 1 of a PDF figure to an opaque PNG.
//
// macOS only, nothing to install: it runs as JavaScript for Automation
// and draws through PDFKit, CoreGraphics and ImageIO, so a vector figure
// is rasterised at the requested size rather than scaled up from a
// small bitmap.
//
//   osascript -l JavaScript imbue/_tools/pdf2png.js <in.pdf> <out.png> <width>
//       The figure at <width> pixels wide, height from its aspect ratio.
//
//   osascript -l JavaScript imbue/_tools/pdf2png.js <in.pdf> <out.png> <W> <H> [margin]
//       The figure fitted, centred, on a white W x H canvas with at
//       least [margin] pixels on every side (used for the social card).

ObjC.import("Foundation");
ObjC.import("PDFKit");
ObjC.import("CoreGraphics");
ObjC.import("ImageIO");

const CROP_BOX = 1; // kPDFDisplayBoxCropBox
const ALPHA_NONE_SKIP_LAST = 5; // kCGImageAlphaNoneSkipLast: opaque RGB, no alpha channel

function run(argv) {
  if (argv.length < 3) {
    throw new Error("usage: pdf2png.js <in.pdf> <out.png> <width> [<height> [<margin>]]");
  }
  const src = argv[0];
  const dst = argv[1];

  const doc = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(src));
  if (doc.isNil()) throw new Error("cannot open " + src);
  const page = doc.pageAtIndex(0);
  const box = page.boundsForBox(CROP_BOX);
  const fw = box.size.width;
  const fh = box.size.height;

  // Pixel size of the output and where the figure lands in it.
  const W = Math.round(Number(argv[2]));
  let H, scale, dx = 0, dy = 0;
  if (argv.length >= 4) {
    H = Math.round(Number(argv[3]));
    const margin = argv.length >= 5 ? Number(argv[4]) : 0;
    scale = Math.min((W - 2 * margin) / fw, (H - 2 * margin) / fh);
    dx = (W - fw * scale) / 2;
    dy = (H - fh * scale) / 2;
  } else {
    scale = W / fw;
    H = Math.round(fh * scale);
  }

  // White, opaque sRGB canvas: figures read the same in both page themes
  // and the PNG carries no alpha channel it does not need.
  const ctx = $.CGBitmapContextCreate(
    null, W, H, 8, 0,
    $.CGColorSpaceCreateWithName($.kCGColorSpaceSRGB),
    ALPHA_NONE_SKIP_LAST
  );
  $.CGContextSetRGBFillColor(ctx, 1, 1, 1, 1);
  $.CGContextFillRect(ctx, $.CGRectMake(0, 0, W, H));
  $.CGContextTranslateCTM(ctx, dx, dy);
  $.CGContextScaleCTM(ctx, scale, scale);
  // drawWithBox maps the crop box's own origin to (0, 0), so no extra shift.
  page.drawWithBoxToContext(CROP_BOX, ctx);

  const dest = $.CGImageDestinationCreateWithURL(
    $.NSURL.fileURLWithPath(dst), $("public.png"), 1, null
  );
  $.CGImageDestinationAddImage(dest, $.CGBitmapContextCreateImage(ctx), null);
  if (!$.CGImageDestinationFinalize(dest)) throw new Error("cannot write " + dst);
  return dst + "  " + W + "x" + H;
}
