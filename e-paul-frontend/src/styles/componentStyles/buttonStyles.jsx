import { mode } from "@chakra-ui/theme-tools";

export const ButtonStyles = {
    
    baseStyle: {},


    sizes: {},


    variants: {
        primary: (props) => ({
            bg: mode("primary","secondary")(props),
            color: "black",
            _hover: {
                bg: mode("#primary","#039FA0")(props),
                transition: "0.5s",
            },
            _active: {
                transform: "scale(1.02)",
            }
        }),
        secondary: {
            bg: "secondary",
        },
    },  

    defaultProps: {},
}