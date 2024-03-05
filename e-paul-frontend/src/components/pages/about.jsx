import React, { Component } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../../style.css'
import {Center,Box,Heading} from '@chakra-ui/react'
import SlideShow from "../carousel";



//cleate slide data
const slides = [
	{
		title: "Motivation",
		text: "Unser Ziel ist es, den Menschen das tägliche Leben zu erleichtern.  Dafür haben wir verschiedene Lösungsansätze in Betracht gezogen. Diese reichen von einem digitalen Inventarsystem für Zuhause bis hin zu einer Politik-App, die alle aktuellen Änderungen verfolgt. Letztendlich fiel unsere Wahl jedoch auf das Smart-Home-System 'E-Paul', das es Ihnen ermöglicht, Ihr Zuhause ganz bequem über Ihren Computer zu steuern.",
		image: "../../assets/img/smarthome.svg",
	},
	{
		title: "Unser Team",
		text: "Unser E-Paul-Team besteht aus 10 engagierten und motivierten Entwicklern. Unser Ziel ist es Ihr Smart-Home-System zu verbessern und deshalb arbeiten wir ununterbrochen daran neue Funktionen einzubauen. Hierfür sind wir als Entwickler immer im Frontend, Backend und mit den ESP-8266 Mikrokontrollern tätig.",
		image: "../../assets/img/team2.svg"
	},
	{
		title: "Support",
		text: "Sie haben Fragen, Probleme oder wollen uns allgemeinen Feedback geben? Schreiben Sie unserem E-Paul-Team einfach eine E-Mail an. Wir freuen uns auf Ihre Nachricht!",
		image: "../../assets/img/callcenter.svg",
		button: {
			text: "Support kontaktieren",
			onClick: () => {window.location.href='mailto:support@epaul-smarthome.de';}
		}
	},
	{
		title: "Frontend, Backend & Mikrokontroller",
		text: <>Frontend: Anna, Eduard, Jonas, Linus<br/><br/>Backend: Julia, Robin<br/><br/>Mikrokontroller: Hannes, Mathias<br/><br/>Allrounder: David, Timo</>,
		image: "../../assets/img/pc.svg"
	},
	{
		title: "Location",
		text: "Wir haben unseren Firmensitz im DHBW Gebäude am Campus Fallenbrunnen. Von der ersten Idee bis hin zur spezifischen Planung haben wir fast alles im dortigen StuV-Raum organisiert und umgesetzt. Ihr wollt uns besuchen? Gerne könnt Ihr hier vorbeischauen: Fallenbrunnen 2, 88045 Friedrichshafen",
		image: "../../assets/img/location.svg"
	},
	{
		title: "Maskottchen",
		text: "Unser Maskottchen bei E-Paul ist ein Geist namens 'Paul'.",
		image: "../../assets/img/paul2.png"
	}
]

class About extends Component {
	render() {
		return (
			<Center>
				<Box width={{base: '100%', sm: '85%', xl: '80%', '2xl':'75%'}}>
					<Heading textAlign={"center"} fontSize={'3xl'} pt={20}>Dürfen wir uns vorstellen?</Heading>
					<br/>
					
					<SlideShow slides={slides}/>

				</Box>
            </Center>
		);
	}
}

export default About;
