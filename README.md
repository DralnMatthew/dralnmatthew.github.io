# zhanghu-zhao.com

Source for Zhanghu Zhao's academic homepage, served by GitHub Pages at
https://zhanghu-zhao.com/. It is plain HTML and CSS with no build step.
The layout is adapted from [Jon Barron's website](https://jonbarron.info/).

- `index.html`: the homepage (the About tab)
- `publications/index.html`: the Publications tab
- `cv/index.html`: the CV tab, which embeds `data/Zhanghu_Zhao_CV_PHD.pdf`
- `stylesheet.css`: styles for all three pages, including the light and dark
  themes
- `theme.js`: sets the theme from sunrise and sunset in Helsinki and runs the toggle

The three pages share the same header (photo, name, intro, contact links)
and the row of tabs under it: About, Publications, CV. Each tab is a
link to its page, and the current page's tab carries
`aria-current="page"`. The header and the tabs are copied into each of
the three files, so a change to either goes in all three. When you add a
page, add its tab to all three files as well.

To update the CV, replace the PDF. If the file name changes, update the
three links to it in `cv/index.html`.

The publication list lives on `publications/index.html`. Each
publication has a title and three link slots (Paper, Code, Project
page), all `<a>` elements. One without an `href` renders as an inert,
dashed "soon" placeholder; add the `href` to publish it, or delete a
slot that will never be used. Keep the year in the venue text (for
example "NeurIPS 2026"), because the year column is hidden on phones.
Give each paper an `id` so that News items on the homepage can link to
it with `publications/#id`.

After editing `stylesheet.css` or `theme.js`, bump the `?v=` number where
the three pages load it, so returning visitors get the new file.

To preview locally, run `python3 -m http.server` here and open
http://localhost:8000/.
