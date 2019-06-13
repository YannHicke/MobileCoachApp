const PlainTextTemplate = function ({ pageContent, pageHeader }) {
  const plainTextContent = `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <link href="css/normalize.css" rel="stylesheet" media="all">
      <link href="css/styles.css" rel="stylesheet" media="all">
      ${pageHeader}
    </head>
    <body>
      ${pageContent}
    </body>
    </html>`

  return plainTextContent
}

export default PlainTextTemplate
