import { extendTheme } from '@chakra-ui/react'
import { mode } from "@chakra-ui/theme-tools";

const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
  }

const theme = extendTheme({ 
  config,
  colors: {
    primary: '#845EC2',
    secondary: "#FF6F91",
    tertiary: "#00C9A7",
    warning: "#FF8066",
    danger: "#C34A36",
  },
  components: {
    Input: {
      variants: {
        filled: (props) => ({
          field: {
            bg: mode("blue.200", "purple.200")(props),
            _focusVisible: {
              bg: "transparent",
              borderColor: mode("blue", "purple")(props)
            }
          }
        })
      },
      defaultProps: {
        variant: "filled"
      }
    }
  }

})

export default theme