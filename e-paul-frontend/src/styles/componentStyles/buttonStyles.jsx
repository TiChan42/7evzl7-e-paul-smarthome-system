import { mode } from "@chakra-ui/theme-tools";

export const ButtonStyles = {
    
    baseStyle: {},


    sizes: {},


    variants: {
        primary: {
            bg: mode("white","black"),
            color: "black",
            _hover: {
                //bg: whiten("primary", 20),
            }
        },
        secondary: {
            bg: "secondary",
        },
    },
        

    defaultProps: {},
}