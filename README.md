# zhanghu-zhao.com

Source for Zhanghu Zhao's academic homepage, served by GitHub Pages at
https://zhanghu-zhao.com/. It is plain HTML and CSS with no build step.
The layout is adapted from [Jon Barron's website](https://jonbarron.info/).

- `index.html`: the homepage
- `cv/index.html`: the CV page, which embeds `data/Zhanghu_Zhao_CV_PHD.pdf`
- `stylesheet.css`: styles for both pages, including the light and dark themes
- `theme.js`: sets the theme from sunrise and sunset in Helsinki and runs the toggle

To update the CV, replace the PDF. If the file name changes, update the
three links to it in `cv/index.html`.

After editing `stylesheet.css` or `theme.js`, bump the `?v=` number where
both pages load it, so returning visitors get the new file.

To preview locally, run `python3 -m http.server` here and open
http://localhost:8000/.
