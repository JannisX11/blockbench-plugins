import opentype from "opentype.js";
// Credits to https://github.com/gero3/facetype.js/blob/gh-pages/javascripts/main.js
// (Modified)

export function convertOpenTypeBufferToThreeJS(buffer) {
  return convertOpenTypeToThreeJS(opentype.parse(buffer));
}
export function convertOpenTypeToThreeJS(font) {
  const scale = (1000 * 100) / ((font.unitsPerEm || 2048) * 72);
  const result = {};
  result.glyphs = {};

  for (const key in font.glyphs.glyphs) {
	const glyph = font.glyphs.glyphs[key];

    const unicodes = [];
    if (glyph.unicode !== undefined) {
      unicodes.push(glyph.unicode);
    }
    for (const unicode of glyph.unicodes) {
      if (unicodes.indexOf(unicode) == -1) {
        unicodes.push(unicode);
      }
    }

    for (const unicode of unicodes) {
      var token = {};
      token.ha = Math.round(glyph.advanceWidth * scale);

      const { x1: xMin, y1: xMax } = glyph.getPath().getBoundingBox();
      token.x_min = Math.round(xMin * scale);
      token.x_max = Math.round(xMax * scale);
      token.o = "";
      glyph.path.commands.forEach(function (command, i) {
        if (command.type.toLowerCase() === "c") {
          command.type = "b";
        }
        token.o += command.type.toLowerCase();
        token.o += " ";
        if (command.x !== undefined && command.y !== undefined) {
          token.o += Math.round(command.x * scale);
          token.o += " ";
          token.o += Math.round(command.y * scale);
          token.o += " ";
        }
        if (command.x1 !== undefined && command.y1 !== undefined) {
          token.o += Math.round(command.x1 * scale);
          token.o += " ";
          token.o += Math.round(command.y1 * scale);
          token.o += " ";
        }
        if (command.x2 !== undefined && command.y2 !== undefined) {
          token.o += Math.round(command.x2 * scale);
          token.o += " ";
          token.o += Math.round(command.y2 * scale);
          token.o += " ";
        }
      });
      result.glyphs[String.fromCharCode(unicode)] = token;
    }
  }

  result.familyName = font.familyName;
  result.ascender = Math.round(font.ascender * scale);
  result.descender = Math.round(font.descender * scale);
  result.underlinePosition = Math.round(
    font.tables.post.underlinePosition * scale
  );
  result.underlineThickness = Math.round(
    font.tables.post.underlineThickness * scale
  );
  result.boundingBox = {
    yMin: Math.round(font.tables.head.yMin * scale),
    xMin: Math.round(font.tables.head.xMin * scale),
    yMax: Math.round(font.tables.head.yMax * scale),
    xMax: Math.round(font.tables.head.xMax * scale),
  };
  result.resolution = 1000;
  result.original_font_information = font.tables.name;

  if (font.styleName?.toLowerCase().indexOf("bold") > -1) {
    result.cssFontWeight = "bold";
  } else {
    result.cssFontWeight = "normal";
  }

  if (font.styleName?.toLowerCase().indexOf("italic") > -1) {
    result.cssFontStyle = "italic";
  } else {
    result.cssFontStyle = "normal";
  }

  return result;
}
