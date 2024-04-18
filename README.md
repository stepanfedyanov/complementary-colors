# complementary-colors

## Гайд по алгоритму подбора

**Главный параметр качества цвета – контрастность выше 30**

Смысл алгоритма – проходимся по цветовому кругу и выбираем цвет, который имеет контрастность выше 60. По стандарту APCA такое текст можно использовать в качестве основного и он останется читаем.

По палитре ходим с определенным шагом – за это отвечают настройки слева. Меняя их можно увидеть, как меняются цвета в палитре – чем выше настройки тем разнообразнее цвета в палитре. Можно подобрать оптимальный вариант и использовать его для подбора цветов хайлата или цвета текста.

Алгоритм проходится по разным палитрам цветового тона. Каждый цикл меняется насыщенность и светлота палитры с шагом, который указан для данных параметров в левой части приложения. При значении 0 шагов насыщенности и светлоты поиск будет происходить по обычной RGB палитре (без пастельных цветов, кислотных и других).

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
