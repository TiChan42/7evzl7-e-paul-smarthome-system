import React, { Component } from 'react';
import './about.css'
import '../style.css'
import { Button, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, Portal, Center, Card, SimpleGrid } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  useDisclosure, 
  Textarea,
  Stack,
  Heading,
  Text,
  CardBody,
  Image,
} from '@chakra-ui/react'


function InitialFocus() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  return (
    <>
      <Button onClick={onOpen} colorScheme='teal' variant='solid' >Ich brauche Support</Button>


      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Was ist Ihr Anliegen?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Ihre E-Mail</FormLabel>
              <Input placeholder='max.mustermann@gmail.com' />
            </FormControl>

            <FormControl>
              <FormLabel>Betreff</FormLabel>
              <Input ref={initialRef} placeholder='Ich habe ein Problem mit E-Paul' />
            </FormControl>

            <FormControl>
              <FormLabel>Ihre Nachricht an uns</FormLabel>
              <Textarea ref={initialRef} placeholder='Mein Smart-Home ...' size="lg" />
            </FormControl>

          </ModalBody>

          <ModalFooter>
                  <a href = "mailto: mddruica@gmail.com">
                    <Button colorScheme='blue'>Zur E-Mail</Button>
                  </a>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}



function InternalStateEx() {
  const initRef = React.useRef()
  return (
    <>
    <SimpleGrid columns={[2, null, 3]} spacing='40px' height='80vh'  paddingLeft={"5%"} paddingRight={"5%"}>
    <Card bg={"#218395"} opacity={"0.4"} borderRadius={"60px"}></Card>
    <Card bg={"#218395"} opacity={"0.4"} borderRadius={"60px"}>
    <CardBody>
                <Image
                src='./team.png'
                alt='team'
                borderRadius='lg'
                height={250}
                width={350}
                />
                <Stack mt='6' spacing='3'>
                <Heading size='md' textAlign={"center"}>Unser Team</Heading>
                <Text textAlign={'center'}>
                  Unser E-Paul-Team besteht aus 10 engagierten und motivierten Entwicklern. Unser Ziel ist es Ihr Smart-Home-System zu verbessern und deshalb arbeiten wir ununterbrochen daran neue Funktionen einzubauen. Hierfür sind wir als Entwickler immer im Frontend, Backend und mit den ESP-8266 Mikrokontrollern tätig.
                </Text> 
                <div>&nbsp;</div>
                </Stack>

            </CardBody>
      
    </Card>
    <Card bg={"#218395"} opacity={"0.4"} borderRadius={"60px"} textAlign={"center"} maxW='sm' CardShadow={"xl"}>
    <CardBody>
                <Image
                src='./support.png'
                alt='support'
                borderRadius='lg'
                height={250}
                width={350}
                />
                <Stack mt='6' spacing='3'>
                <Heading size='md' textAlign={"center"}>Support</Heading>
                <Text>
                Sie haben Fragen, Probleme oder wollen uns allgemeinen Feedback geben? Schreiben Sie unserem E-Paul-Team einfach eine E-Mail an mddruica@gmail.com oder klicken Sie auf den Button unten. Wir freuen uns auf Ihre Nachricht! 
                </Text> 
                <div>&nbsp;</div>
                </Stack>

                <InitialFocus />
            </CardBody>

    </Card>
    </SimpleGrid>
    
    </>
  )}

class About extends Component {
  render() {
    return (
      <div>
        <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewCard="0 0 512 512" fill="currentColor">
                <path d="M25.3483 31.5C25.5557 31.0203 25.6286 30.8785 25.875 30.4794L26.4433 30.5677C27.6875 32.0012 28.5021 33.8247 29.3677 35.5035L70.3768 113.948L157.133 282.088L204.963 377.357L244.698 463.968C245.341 465.487 246.218 467.096 246.486 468.722L25.7297 231.173C24.7549 230.134 25.0756 229.068 25.0906 227.727L25.1697 52.53C25.1719 45.5838 24.7898 38.4105 25.3483 31.5Z"/>
                <path d="M265.342 469.836C265.169 470.075 264.846 470.313 264.625 470.512L264.578 470.125C265.077 465.574 273.804 447.004 275.995 442.108L285.479 421.253L344.871 302.529L418.54 159.82L429.771 136.979L479.298 41.9564C481.273 38.4482 483.278 34.221 486.129 31.375C487.907 31.0444 487.13 34.8831 487.091 36.035L487.205 229.965C487.229 230.917 486.244 231.943 485.621 232.653L386.606 337.406L297.38 433.378L265.342 469.836Z"/>
                <path d="M204.248 324.63L121.934 166.332C125.154 164.817 128.212 162.847 131.25 160.998L191.588 123.297L232.45 98.8493C236.471 96.4601 240.325 93.761 244.616 91.875C245.071 94.548 244.779 97.5734 244.774 100.277L245.279 406.027C245.039 405.402 244.843 404.875 244.406 404.355L204.248 324.63Z"/>
                <path d="M307.37 324.687L267.667 405.517L268.268 91.708C270.901 92.6367 273.46 94.5079 275.841 95.9491L381.767 161.304C384.325 162.741 387.367 164.045 389.453 166.131C386.825 172.755 382.845 178.97 379.438 185.228L307.37 324.687Z"/>
            </svg>
        </div>
        <InternalStateEx></InternalStateEx>
      </div>
    );
  }
}

export default About;
