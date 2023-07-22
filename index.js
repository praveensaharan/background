const express = require("express");
const Jimp = require("jimp");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/generate-image", (req, res) => {
  // Get the name and color from query parameters
  const { name, color } = req.query;

  // Create a new image with the specified background color
  const image = new Jimp(200, 200, "#" + color); // Add a "#" prefix to the color value

  // Load the font
  const fontType = name.length >= 2 ? name.slice(0, 2).toUpperCase() : "-";
  Jimp.loadFont(Jimp.FONT_SANS_64_WHITE)
    .then((font) => {
      // Draw the text on the image
      const text = fontType;
      const textWidth = Jimp.measureText(font, text);
      const textHeight = Jimp.measureTextHeight(font, text);
      const x = (image.bitmap.width - textWidth) / 2;
      const y = (image.bitmap.height - 0.55 * textHeight) / 2;
      image.print(font, x, y, text);

      // Send the image as a response
      return new Promise((resolve, reject) => {
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          if (err) {
            console.error("Error generating image:", err);
            reject(err);
          } else {
            res.set("Content-Type", Jimp.MIME_PNG);
            res.send(buffer);
            resolve();
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error generating image:", error);
      res.status(500).send("Error generating image");
    });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
