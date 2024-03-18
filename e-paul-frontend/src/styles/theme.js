import { extendTheme } from '@chakra-ui/react';
import { accordionTheme } from '@/components/accordion';

const config = {
	initialColorMode: 'light',
	//useSystemColorMode: true
}

const components = {
	Accordion: accordionTheme
}

const colors = {
	blue1: "rgba(33, 131, 149, 1.0)",
	blue2: "rgba(33, 131, 149, 0.8)",
	blue3: "rgba(33, 131, 149, 0.6)",
	teal: {
		10:  "#cdeef4",
		20:  "#bce8f0",
		30:  "#abe3ed",
		40:  "#9bdde9",
		50:  "#8ad8e5",
		100: "#79d2e2",
		150: "#68ccde",
		200: "#58c7da", 
		250: "#47c1d7",
		300: "#36bbd3",
		350: "#2cb1c9",
		400: "#28a2b8",
		450: "#2594a7",
		500: "#218395",
		550: "#1d7686", 
		600: "#1a6775",
		650: "#165964",
		700: "#124a54",
		750: "#0f3b43",
		800: "#0b2c32",
		850: "#071e21",
		900: "#040f11", 
	  },
}


const breakpoints = {
	base: "0em", // 0px
	sm: "30em", // ~480px
	md: "48em", // ~768px
	lg: "62em", // ~992px
	xl: "80em", // ~1280px
	"2xl": "96em", // ~1536px
  };

const theme = extendTheme({ config, components, colors })

export default theme
