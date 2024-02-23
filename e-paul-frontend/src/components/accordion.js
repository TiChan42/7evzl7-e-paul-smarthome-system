// Accordion Style
import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(accordionAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  root: {
    bgGradient: 'linear(blue1 0%, blue3 100%)',

  },
  container: {

    color: 'white',
  },
  panel: {

    color: 'white',
  },
  button: {
    bg: "blue1",
    color: 'white',
    fontWeight: "bold",
  }
})

const variants = definePartsStyle({
  second:{
    container: {
      bg: 'blue2',
    }
  },
  third:{

  }
})

export const accordionTheme = defineMultiStyleConfig({ baseStyle, variants })
