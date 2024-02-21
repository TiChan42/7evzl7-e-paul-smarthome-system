import { Component } from "react"
import { Button, Card, Center, Grid, } from "@chakra-ui/react"
import ChangeColorMode from "../components/changeColorMode"

class Darkmode extends Component {
    render() {
        return(
            <>
                <Center p={4}>
                    <ChangeColorMode />
                    <Button bg={"info"}>ff</Button>
                    <Button variant={"primary"}></Button>
        
                </Center>
                <Grid templateColumns='repeat(3, 1fr)' gap={6} margin={"18px"}>
                    <Card bg={"#96b7c0"} minH={"400px"}>Hallo</Card>
                    <Card bg={"#96b7c0"} minH={"400px"}>Hallo</Card>
                    <Card bg={"#96b7c0"} minH={"400px"}>Hallo</Card>
                </Grid>
            </>
        )
    }
}
export default Darkmode