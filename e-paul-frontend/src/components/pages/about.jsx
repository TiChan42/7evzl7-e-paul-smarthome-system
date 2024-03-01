import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import '../../style.css'
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
Heading,
Text,
CardBody,
Image,
Flex,
Card,
SimpleGrid,
Button,
IconButton,
Box,
Center
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
			<Button onClick={onOpen} colorScheme='whiteAlpha' variant='solid' >Ich brauche Support</Button>

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
							<Button colorScheme='blue' margin='5px'>Zur E-Mail</Button>
						</a>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}


const customArrowStyles = {
	prevButton: {
		left: "10px",
		zIndex: "1",
		color: "rgba(33, 131, 149)"
	},
	nextButton: {
		right: "10px",
		zIndex: "1",
		color: "rgba(33, 131, 149)"
	},
};


function InternalStateEx() {
	return (
		<>
			<Carousel
			showArrows={true}
			showStatus={false}
			showIndicators={false}
			showThumbs={false}
			infiniteLoop={true}
			emulateTouch={true}
			renderArrowPrev={(onClickHandler, hasPrev, label) =>
				hasPrev && (
				<IconButton
					onClick={onClickHandler}
					icon={<ChevronLeftIcon />}
					variant="styled"
					size="lg"
					aria-label={label}
					position="absolute"
					top="50%"
					transform="translateY(-50%)"
					style={{ ...customArrowStyles.prevButton, fontSize: '45px' }}
				/>
				)
			}
			renderArrowNext={(onClickHandler, hasNext, label) =>
				hasNext && (
					<IconButton
						onClick={onClickHandler}
						icon={<ChevronRightIcon />}
						variant="styled"
						aria-label={label}
						position="absolute"
						top="50%"
						transform="translateY(-50%)"
						style={{ ...customArrowStyles.nextButton, fontSize: '45px' }}
					/>
				)
			}>
				<SimpleGrid id="sgrid" columns={[1, null, 3]} spacing='40px' height='80vh' paddingLeft={"5%"} paddingRight={"5%"} margin={"30px"} overflow="scroll" overflowY="visible">
					<Card bg={"rgba(33, 131, 149, .8)"} borderRadius={"32px"}>
						<CardBody>
							<Flex justifyContent="center" flexDirection="column">
							<Box>
								<Image src='../../assets/img/smarthome.svg' alt='smarthome' />
							</Box>
							<Center display="flex" flexDirection="column">
								<Heading size='md' textAlign={"center"}>Motivation</Heading>
								<Text textAlign={'center'}>
								Unser Ziel war es, den Menschen das tägliche Leben zu erleichtern, und wir haben dafür verschiedene Lösungsansätze in Betracht gezogen. Diese reichten von einem digitalen Inventarsystem für Zuhause bis hin zu einer Politik-App, die alle aktuellen Änderungen verfolgt. Letztendlich fiel unsere Wahl jedoch auf das Smart-Home-System "E-Paul", das es Ihnen ermöglicht, Ihr Zuhause ganz bequem über Ihren Computer zu steuern.
								</Text>
								<div>&nbsp;</div>
							</Center>
							</Flex>
						</CardBody>
					</Card>
					<Card bg={"rgba(33, 131, 149, .8)"} borderRadius={"32px"}>
						<CardBody>
							<Flex justifyContent="center" flexDirection="column">
							<Box>
								<Image src='../../assets/img/team2.svg' alt='Team' />
							</Box>
							<Center display="flex" flexDirection="column">
								<Heading size='md' textAlign={"center"}>Unser Team</Heading>
								<Text textAlign={'center'}>
								Unser E-Paul-Team besteht aus 10 engagierten und motivierten Entwicklern. Unser Ziel ist es Ihr Smart-Home-System zu verbessern und deshalb arbeiten wir ununterbrochen daran neue Funktionen einzubauen. Hierfür sind wir als Entwickler immer im Frontend, Backend und mit den ESP-8266 Mikrokontrollern tätig.
								</Text>
								<div>&nbsp;</div>
							</Center>
							</Flex>
						</CardBody>
					</Card>
					<Card bg={"rgba(33, 131, 149, .8)"} borderRadius={"32px"}>
						<CardBody>
							<Flex justifyContent="center" flexDirection="column">
							<Box>
								<Image src='../../assets/img/callcenter.svg' alt='support' />
							</Box>
							<Center display="flex" flexDirection="column">
								<Heading size='md' textAlign={"center"}>Support</Heading>
								<Text textAlign={'center'}>
								Sie haben Fragen, Probleme oder wollen uns allgemeinen Feedback geben? Schreiben Sie unserem E-Paul-Team einfach eine E-Mail an mddruica@gmail.com oder klicken Sie auf den Button unten. Wir freuen uns auf Ihre Nachricht!
								</Text>
								<br/>
								<InitialFocus/>
							</Center>
							</Flex>
						</CardBody>
					</Card>
				</SimpleGrid>
				<SimpleGrid id="sgrid" columns={[1, null, 3]} spacing='40px' height='80vh' paddingLeft={"5%"} paddingRight={"5%"} margin={"30px"} overflow="scroll" overflowY="visible">
					<Card bg={"rgba(33, 131, 149, .8)"} borderRadius={"32px"}>
						<CardBody>
							<Flex justifyContent="center" flexDirection="column">
							<Box>
								<Image src='../../assets/img/pc.svg' alt='' />
							</Box>
							<Center display="flex" flexDirection="column">
								<Heading size='md' textAlign={"center"}>Frontend, Backend & Mikrokontroller</Heading>
								<Text textAlign={'center'}>
								Frontend: Anna, Eduard, Jonas, Linus<br/><br/>
								Backend: Julia, Robin<br/><br/>
								Mikrokontroller: Hannes, Mathias<br/><br/>
								Allrounder: David, Timo
								</Text>
								<div>&nbsp;</div>
							</Center>
							</Flex>
						</CardBody>
					</Card>
					<Card bg={"rgba(33, 131, 149, .8)"} borderRadius={"32px"}>
						<CardBody>
							<Flex justifyContent="center" flexDirection="column">
							<Box>
								<Image src='../../assets/img/location.svg' alt='location' />
							</Box>
							<Center display="flex" flexDirection="column">
								<Heading size='md' textAlign={"center"}>Location</Heading>
								<Text textAlign={'center'}>
								Wir haben unseren Firmensitz im DHBW Gebäude am Campus Fallenbrunnen. Von der ersten Idee bis hin zur spezifischen Planung haben wir fast alles im dortigen StuV-Raum organisiert und umgesetzt.<br/>Ihr wollt uns besuchen? <br/>Gerne könnt Ihr hier vorbeischauen: <br/> Fallenbrunnen 2, 88045 Friedrichshafen
								</Text>
								<div>&nbsp;</div>
							</Center>
							</Flex>
						</CardBody>
					</Card>
					<Card bg={"rgba(33, 131, 149, .8)"} borderRadius={"32px"}>
						<CardBody>
							<Flex justifyContent="center" flexDirection="column">
							<Box>
								<Image src='../../assets/img/paul2.png' alt='Paul' paddingBottom="1em"/>
							</Box>
							<Center display="flex" flexDirection="column">
								<Heading size='md' textAlign={"center"}>Maskottchen</Heading>
								<Text textAlign={'center'}>
								Unser Maskottchen bei E-Paul ist ein Geist namens "Paul".
								</Text>
								<div>&nbsp;</div>
							</Center>
							</Flex>
						</CardBody>
					</Card>
				</SimpleGrid>
			</Carousel>
		</>
	)
}

class About extends Component {
	render() {
		return (
			<InternalStateEx/>
		);
	}
}

export default About;
