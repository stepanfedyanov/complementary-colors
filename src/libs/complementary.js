import chroma from 'chroma-js'
import { APCAcontrast, sRGBtoY } from 'apca-w3'

const SATURATION_STEP = 0.6
const LIGHTNESS = 0.7
const MINIMUM_CONTRAST = 30

const getRandomElementOfArray = (puttedColors, colors) => {
  const elementToReturn = colors[Math.floor(Math.random() * colors.length)]

  if (puttedColors.includes(elementToReturn)) return getRandomElementOfArray(puttedColors, colors)

  return elementToReturn
}

const sortByLightness = (colorsArray) => {
  const arrayToSort = [...colorsArray]

  arrayToSort.sort((a, b) => chroma(b).luminance() - chroma(a).luminance())

  return arrayToSort
}

/**
 * Очистить цвета до 27 цветов
 */
export const getArrayWithColors = (arrayColors, num = 27) => {
  console.log('array with colors', arrayColors)
  let colors = []

  arrayColors.forEach(() => {
    if (colors.length <= num) {
      const randomColor = getRandomElementOfArray(colors, arrayColors)
      colors.push(randomColor)
    }
  })

  return sortByLightness(colors)
}

/**
 * Возвращает массив с чистыми цветами без повторений и "похожестей"
 */
export const clearArrayFromEquelColors = (colorsArray) => {
  let colorsToReturn = [...colorsArray]

  colorsToReturn = colorsToReturn.filter((color, index) => {
    let haveSameColors = false

    colorsToReturn.forEach((colorToComparison, idx) => {
      if (index !== idx && chroma.deltaE(colorToComparison, color) < 0.5) {
        haveSameColors = true
      }
    })

    return !haveSameColors
  })

  return colorsToReturn
}

/**
 * Получить инфо о разнице в оригинальном цвете
 */
export const getContrastInfo = (colorsArray) => {
  let colorsToReturn = [...colorsArray]

  colorsToReturn = colorsToReturn.filter((color, index) => {
    colorsToReturn.forEach((colorToComparison, idx) => {
      console.log(
        '%c Oh my heavens! ',
        `background: ${colorToComparison}; color: ${color}`,
        index !== idx && chroma.deltaE(colorToComparison, color) < 0.9
      )
      console.log('deltaE', chroma.deltaE(colorToComparison, color))
      console.log('distance', index !== idx && chroma.distance(colorToComparison, color) < 3.5)
      // console.log('in for each', index !== idx && chroma.distance(colorToComparison, color) < 10)
      // if (index !== idx && chroma.deltaE(colorToComparison, color) < 10) {
      //   haveSameColors = true
      // }
    })
  })
}

/**
 * Возвращает HSL из RGB
 */
export const rgbToHsl = (rgb) => {
  return chroma(rgb).hsl()
}

/**
 * Возвращает значение контрастности по APCA
 * Берет два цвета в формате HSL
 */
export const getContrastValue = (color1, color2) => {
  const color1RGB = chroma(color1[0], color1[1], color1[2], 'hsl').rgba()
  const color2RGB = chroma(color2[0], color2[1], color2[2], 'hsl').rgba()

  return APCAcontrast(sRGBtoY(color1RGB), sRGBtoY(color2RGB))
}

/**
 * Возвращает 27 комплиментарных цветов к цвету по контрастности
 * Берет HSL оригинального цвета
 * Берет параметры шагов HSL
 * (опционально) Берет минимальное значение контрастности (по умолчанию 30)
 * (опционально) Берет количество цветов (по умолчанию 27)
 */
export const getContrastPalette = (
  originalHSL,
  stepsHSL = [1, SATURATION_STEP, LIGHTNESS],
  minimalContrast = MINIMUM_CONTRAST,
  maximumColorsCount = Infinity
) => {
  console.log('[getContastPalette] initilize')

  let colorsToReturn = []

  for (let H = 0; H <= 360; H += stepsHSL[0]) {
    for (let S = 1; S > 0; S -= stepsHSL[1]) {
      for (let L = 1; L > 0; L -= stepsHSL[2]) {
        if (
          colorsToReturn.length < maximumColorsCount &&
          Math.abs(getContrastValue([H, +S.toFixed(1), +L.toFixed(1)], originalHSL)) >=
            minimalContrast
        ) {
          colorsToReturn.push(chroma([H, +S.toFixed(1), +L.toFixed(1)], 'hsl').hex())
        }
      }
    }
  }

  return colorsToReturn
}
