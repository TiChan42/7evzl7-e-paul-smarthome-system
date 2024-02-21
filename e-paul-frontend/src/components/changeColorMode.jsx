import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { Button } from "@chakra-ui/react"
import { useColorMode } from "@chakra-ui/react"

export default function ChangeColorMode() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Button onClick={toggleColorMode} variant={"primary"}>
            Toggle {colorMode === 'light' ?  <MoonIcon/>: <SunIcon/>}
        </Button>
    )
} 