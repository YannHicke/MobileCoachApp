const generatePages = function (pages) {
  let htmlContent = ''
  const pageBegin = '<div class="swiper-slide">'
  const pageEnd = '</div>'
  for (let i = 0; i < pages.length; i++) {
    htmlContent += pageBegin + pages[i].content + pageEnd
  }

  return htmlContent
}

const SliderPageTemplate = function ({ pages, pageHeader }) {
  const sliderPageContent = `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <link href="css/normalize.css" rel="stylesheet" media="all">
      <link href="css/swiper.min.css" rel="stylesheet" media="all">
      <link href="css/styles.css" rel="stylesheet" media="all">
      <link href="css/swiper-styles.css" rel="stylesheet" media="all">
      ${pageHeader}
    </head>
    <body>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          ${generatePages(pages)}
        </div>
        <div class="pagination-container">
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <script src="js/swiper.min.js"></script>
      <script src="js/sliderPage.js"></script>
    </body>
  </html>`

  return sliderPageContent
}

export default SliderPageTemplate
