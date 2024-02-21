import React, { Component } from 'react';
import '../../style.css'
import { 
  Button, 
  Card, 
  SimpleGrid, 
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
  Divider,
  Flex
} from '@chakra-ui/react'


function InitialFocus() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const [subject, setSubject] = React.useState('')
  const [message, setMessage] = React.useState('')

  const handleSubjectChange = (e) => setSubject(e.target.value)
  const handleMessageChange = (e) => setMessage(e.target.value)

  const generateMailtoLink = () => {
    const mailtoLink = `mailto:mddruica@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    return mailtoLink
  }
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
    
            <FormControl>
              <FormLabel>Betreff</FormLabel>
              <Input ref={initialRef} placeholder='Ich habe ein Problem mit E-Paul' value={subject} onChange={handleSubjectChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Ihre Nachricht an uns</FormLabel>
              <Textarea ref={initialRef} placeholder='Mein Smart-Home ...' size="lg" value={message} onChange={handleMessageChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <a href={generateMailtoLink()}>
              <Button colorScheme='blue' margin={'5px'}>Zur E-Mail</Button>
            </a>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}


function InternalStateEx() {
  return (
    <>
    <SimpleGrid columns={[2, null, 3]} spacing='40px' height='80vh' paddingLeft={"5%"} paddingRight={"5%"}>
    <Card bg={"rgba(33, 131, 149, .6)"} borderRadius={"60px"}>
      <CardBody>
        <Flex justifyContent="center">
            <Image
              src='./smarthome2.png'
              alt='smarthome'
              borderRadius='lg'
              height={250}
              width={350}
            />
          </Flex>
            <Stack mt='6' spacing='3'>
            <Heading size='md' textAlign={"center"}>Motivation</Heading>
            <Text textAlign={'center'}>
              Unser Ziel war es, den Menschen das tägliche Leben zu erleichtern, und wir haben dafür verschiedene Lösungsansätze in Betracht gezogen. Diese reichten von einem digitalen Inventarsystem für Zuhause bis hin zu einer Politik-App, die alle aktuellen Änderungen verfolgt. Letztendlich fiel unsere Wahl jedoch auf das Smart-Home-System "E-Paul", das es Ihnen ermöglicht, Ihr Zuhause ganz bequem über Ihren Computer zu steuern.
            </Text> 
            <div>&nbsp;</div>
            </Stack>
        </CardBody>

    </Card>
    <Card bg={"rgba(33, 131, 149, .8)"} borderRadius={"60px"}>
      <CardBody>
        <Flex justifyContent="center">
          <Image
            src='./team.png'
            alt='team'
            borderRadius='lg'
            height={250}
            width={350}
          />
        </Flex>
            <Stack mt='6' spacing='3'>
            <Heading size='md' textAlign={"center"}>Unser Team</Heading>
            <Text textAlign={'center'}>
              Unser E-Paul-Team besteht aus 10 engagierten und motivierten Entwicklern. Unser Ziel ist es Ihr Smart-Home-System zu verbessern und deshalb arbeiten wir ununterbrochen daran neue Funktionen einzubauen. Hierfür sind wir als Entwickler immer im Frontend, Backend und mit den ESP-8266 Mikrokontrollern tätig.
            </Text> 
            <div>&nbsp;</div>
            </Stack>
      </CardBody>
      
    </Card>
    <Card bg={"rgba(33, 131, 149, 1.0)"} borderRadius={"60px"} textAlign={"center"} CardShadow={"xl"}>
      <CardBody>
        <Flex justifyContent="center">
          <Image
            src='./support.png'
            alt='support'
            borderRadius='lg'
            height={250}
            width={350}
          />
        </Flex>
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

    <Stack direction='row' h='70px' p={4}>
      <Divider orientation='vertical' />
    </Stack>


    <SimpleGrid columns={[2, null, 3]} spacing='40px' height='80vh'  paddingLeft={"5%"} paddingRight={"5%"}>
    <Card bg={"rgba(33, 131, 149, .6)"} borderRadius={"60px"}>
      <CardBody>
        <Flex justifyContent="center">
          <Image
            src='./maskottchen1.png'
            alt='Paul'
            borderRadius='lg'
            height={250}
            width={350}
          />
        </Flex>
            <Stack mt='6' spacing='3'>
            <Heading size='md' textAlign={"center"}>Maskottchen</Heading>
            <Text textAlign={'center'}>
              Unser Maskottchen bei E-Paul ist ein Geist namens "Paul".
            </Text> 
            <div>&nbsp;</div>
            </Stack>
        </CardBody>

    </Card>
    <Card bg={"rgba(33, 131, 149, .8)"} borderRadius={"60px"}>
      <CardBody>
        <Flex justifyContent="center">
          <Image
            src='./frontend2.png'
            alt='frontend'
            borderRadius='lg'
            height={250}
            width={300}
          />
        </Flex>
          <Stack mt='6' spacing='3'>
          <Heading size='md' textAlign={"center"}>Frontend, Backend & Mikrokontroller</Heading>
          <Text textAlign={'center'}>
            Frontend: Anna, Eduard, Jonas, Linus
            <div>&nbsp;</div>
            Backend: Julia, Robin
            <div>&nbsp;</div>
            Mikrokontroller: Hannes, Mathias
            <div>&nbsp;</div>

            Allrounder: David, Timo
          </Text> 
          <div>&nbsp;</div>
          </Stack>
      </CardBody>
      
    </Card>
    <Card bg={"rgba(33, 131, 149, 1.0)"} borderRadius={"60px"} textAlign={"center"} CardShadow={"xl"}>
      <CardBody>
        <Flex justifyContent={"center"}>
          <Image
            src='./location.png'
            alt='location'
            borderRadius='lg'
            height={200}
            width={300}
          />
        </Flex>
        <Stack mt='6' spacing='3'>
        <Heading size='md' textAlign={"center"}>Location</Heading>
        <Text>
          Wir haben unseren Firmensitz im DHBW Gebäude am Campus Fallenbrunnen. Von der ersten Idee bis hin zur spezifischen Planung haben wir fast alles im dortigen StuV-Raum organisiert und umgesetzt. <div>&nbsp;</div> Ihr wollt uns besuchen? <div>&nbsp;</div>Gerne könnt Ihr hier vorbeischauen: <br></br> Fallenbrunnen 2, 88045 Friedrichshafen
        </Text> 
        <div>&nbsp;</div>
        </Stack>

      </CardBody>
    </Card>
    </SimpleGrid>
    
    </>
  )}

class About extends Component {
  render() {
    return (
      <div>
        <InternalStateEx></InternalStateEx>
      </div>
    );
  }
}

export default About;
