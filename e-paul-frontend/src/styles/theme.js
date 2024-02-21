import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";

const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
  }

const theme = extendTheme ({ 
  config,
  colors: {
    //custom colors
    custom: {
      primary: {
        light: "#218395",
        dark: "",
      },
      secondary: {
        light: "#69a5bf",
        dark: "",
      },
      info: {
        light: "#3f885f",
        dark: "",
      },
      success: { 
        light: "#139f4f",
        dark: "",
      },
      warning: {
        light: "#e7c715",
        dark: "",
      },
      danger: {
        light: "#f10927",
        dark: "",
      },
      bar: {
        light: "#96b7c0",
        dark: "#213e59",
      },
      background: {
        light: "",
        dark: "#214554",
      },
    },
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
  },
})
export default theme