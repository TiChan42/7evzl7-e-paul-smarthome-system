import { extendTheme } from '@chakra-ui/react';
import { accordionTheme } from './components/accordion';

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true
}

const components = {
  Accordion: accordionTheme
}

const colors = {
  blue1: "rgba(33, 131, 149, 1.0)",
  blue2: "rgba(33, 131, 149, 0.8)",
  blue3: "rgba(33, 131, 149, 0.6)", 
}

const theme = extendTheme({ config, components, colors })

export default theme
