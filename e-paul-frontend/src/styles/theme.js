import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";
import { ButtonStyles as Button } from "./componentStyles/buttonStyles";
import { colors } from "./colors";
const config = {
  //use System ColorMode Settings
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const theme = extendTheme ({ 
  config,
  colors,

  styles: {
    global: (props) => ({
      body: {
        bg: mode("#DFE3E4","#5e7a8d")(props),
      },
      ':root': {
        '--chakra-colors-primary': mode('#214554','#213e59')(props),
        '--chakra-colors-secondary': mode('#54B8D2','#54B8D2')(props),
        '--chakra-colors-nav': mode('#00697B','#002939')(props),
      }
    })
  },
  
  components: {
    Button,

    Input: {
      variants: {
        filled: (props) => ({
          field: {
            bg: mode("primary.light", "primary.dark")(props),
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
  },
})
export default theme