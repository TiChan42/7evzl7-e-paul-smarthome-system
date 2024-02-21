import { Component } from "react"
import { Button, Center } from "@chakra-ui/react"
import ChangeColorMode from "../components/changeColorMode"

class Darkmode extends Component {
    render() {
        return(
            <Center p={4}>
                <ChangeColorMode />
                <Button bg={"info"}>ff</Button>
            </Center>
        )
    }

}
export default Darkmode