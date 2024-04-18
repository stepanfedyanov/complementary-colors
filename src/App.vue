<template>
  <main>
    <h1 class="title-main">Подбор палитры</h1>

    <div class="palette-parametres">
      <label for="saturation">Шаг насыщенность</label><br />
      <input
        type="range"
        v-model="saturation"
        min="0.01"
        max="1"
        step="0.01"
        name="saturation"
        id="saturation"
      /><br />
      <input v-model="saturation" type="number" min="0.01" max="1" step="0.01" />
      <br />
      <br />
      <label for="lightness">Шаг светлоты</label><br />
      <input
        type="range"
        v-model="lightness"
        min="0.01"
        max="1"
        step="0.01"
        name="lightness"
        id="lightness"
      /><br />
      <input v-model="lightness" type="number" min="0.01" max="1" step="0.01" />
      <br />
      <br />
      <label for="lightness">Минимальная контрастность</label><br />
      <input
        type="range"
        v-model="minimumContrast"
        min="0"
        max="100"
        step="1"
        name="lightness"
        id="lightness"
      /><br />
      <input v-model="minimumContrast" type="number" min="0" max="100" step="1" />
      <br /><br />
      <label for="lightness">Ограничить выборку до 27 цветов?</label>
      <input type="checkbox" v-model="colorsCount" name="checkbox" id="checkbox" /><br />
    </div>

    <div class="type-block color-type">
      <h2 class="title-secondary">Подбор палитры по цвету</h2>
      <input v-model="targetColor" type="color" />
      <button @click="getComplementaryColorsFromColor()">Подбери мне цвета!</button>
    </div>

    <h1
      v-if="!imageSelected"
      class="example-div"
      :style="`background-color: ${targetColor}; color: ${selectedColor}`"
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil sit eaque quidem, quibusdam
      earum voluptatibus voluptatem perspiciatis praesentium totam aut quod animi repellat cum et
      eum mollitia inventore rem? Fuga.
    </h1>

    <div class="type-block">
      <h2 class="title-secondary">Подбор палитры по изображению</h2>

      <p>Изображение для подбора цветов</p>
      <input ref="imageField" type="file" name="image" id="image" />

      <h1 v-if="targetImage" :style="`color: ${selectedColor}`" class="image-text-example">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
      </h1>
      <img v-if="targetImage" :src="targetImage" ref="imageElement" class="image-target" />

      <button @click="getComplementaryColorsFromImage()">Подбери мне цвета!</button>

      <div v-if="imageColors.length" class="image-palette">
        <p>Результат подбора</p>

        <div class="image-colors-palette">
          <span
            v-for="imageColor in imageColors"
            @click="selectedColor = imageColor"
            class="image-color-palette"
            :key="`image-color-${imageColor}`"
            :style="`background-color: ${imageColor}`"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import ColorThief from './libs/color-thief.mjs'

import {
  getContrastPalette,
  rgbToHsl,
  getArrayWithColors,
  clearArrayFromEquelColors
} from './libs/complementary'

const saturation = ref(0.6)
const lightness = ref(0.7)
const minimumContrast = ref(30)
const colorsCount = ref(true)

const targetColor = ref('#ffffff')
const selectedColor = ref('#000000')

const imageColors = ref([])
const imageField = ref(null)
const targetImage = ref('')
const imageElement = ref(null)
const imageSelected = ref(true)

const getComplementaryColorsFromImage = () => {
  targetImage.value = null

  convertInputToBase64()
}

const getComplementaryColorsFromColor = () => {
  imageSelected.value = false
  targetImage.value = null
  imageColors.value = []
  let imageColorsToReturn = []

  imageColorsToReturn = [
    ...imageColorsToReturn,
    ...getContrastPalette(
      rgbToHsl(targetColor.value),
      [1, saturation.value, lightness.value],
      minimumContrast.value
    )
  ]

  imageColors.value = getArrayWithColors(
    clearArrayFromEquelColors([...new Set(imageColorsToReturn)]),
    colorsCount.value ? 27 : Infinity
  )
}

const convertInputToBase64 = () => {
  const file = imageField.value['files'][0]
  const fileReader = new FileReader()

  fileReader.addEventListener('load', () => {
    targetImage.value = fileReader.result
  })

  fileReader.readAsDataURL(file)
}

const getColorFromImage = () => {
  imageSelected.value = true
  const colorThief = new ColorThief()
  const imagePalette = colorThief.getPalette(imageElement.value)
  imageColors.value = []

  let imageColorsToReturn = []

  imagePalette.forEach((color) => {
    imageColorsToReturn = [
      ...imageColorsToReturn,
      ...getContrastPalette(
        rgbToHsl(color, [1, saturation.value, lightness.value], minimumContrast.value)
      )
    ]
  })

  imageColorsToReturn = [...new Set(imageColorsToReturn)]

  imageColors.value = getArrayWithColors(
    [...clearArrayFromEquelColors(imageColorsToReturn)],
    colorsCount.value ? 27 : Infinity
  )
}

watch(targetImage, () => {
  nextTick(() => {
    if (imageElement.value) {
      if (imageElement.value.complete) {
        getColorFromImage()
      } else {
        imageElement.value.addEventListener('load', function () {
          getColorFromImage()
        })
      }
    }
  })
})
</script>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
}

button {
  padding: 10px 20px;
}

.title-main {
  margin-bottom: 30px;
}

.title-secondary {
  margin-bottom: 10px;
}

.image-target {
  z-index: 1;
  position: fixed;
  right: 100px;
  top: 100px;
  width: 20vw;
  height: auto;
}

.color-type {
  margin-bottom: 40px;
}

.type-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.palette-parametres {
  position: absolute;
  left: 100px;
  top: 100px;
}

.image-colors-palette {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  max-width: 400px;
}

.image-color-palette {
  display: block;
  border-radius: 100%;
  width: 40px;
  height: 40px;
}

.example-div {
  position: fixed;
  width: 500px;
  aspect-ratio: 16 / 9;
  height: auto;
  border: 1px #000 solid;
  padding-left: 10px;
  right: 50px;
  top: 100px;
}

.image-text-example {
  z-index: 2;
  position: fixed;
  right: 70px;
  top: 130px;
  width: 20vw;
  height: auto;
  font-weight: 600;
}
</style>
