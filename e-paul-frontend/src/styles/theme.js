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
	blue2: "rgba(33, 131, 149, 0.8)", //rgba(33, 131, 149, 0.8)
	blue3: "rgba(33, 131, 149, 0.6)",
	teal2: {
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
	  teal: {
		10: "#ebf4f6",
		20: "#dcebee",
		30: "#cce2e7",
		40: "#bddadf",
		50: "#add1d8",
		100: "#9dc8d0",
		150: "#8ec0c9",
		200: "#7db7c1",
		250: "#6eaeba",
		300: "#60a6b3",
		350: "#4f9dab",
		400: "#4094a4",
		450: "#308b9c",
		500: "#218395",
		550: "#1e7686",
		600: "#1a6977",
		650: "#175b68",
		700: "#144e59",
		750: "#10414a",
		800: "#0d343b",
		850: "#0a272c",
		900: "#071a1e",
		950: "#030d0f",
	  },

	  secondary: {
		50:"#ebeff1",
		100:"#d8dee3",
		150:"#c5cfd5",
		200:"#b1bfc7",
		250:"#9eafb9",
		300:"#8a9eab",
		350:"#788f9e",
		400:"#657f90",
		450:"#516f82",
		500:"#3e5f74",
		550:"#385668",
		600:"#324c5d",
		650:"#2b4251",
		700:"#253945",
		750:"#1f303a",
		800:"#19262f",
		850:"#131d23",
		900:"#0c1317",
		950:"#060a0c",
	  },

	  tertiary: {
		50:"#f4eae8",
		100:"#e9d6d2",
		150:"#e0c2bd",
		200:"#d4ada5",
		250:"#ca9990",
		300:"#c0857a",
		350:"#b57064",
		400:"#aa5c4e",
		450:"#a04737",
		500:"#953321",
		550:"#862e1e",
		600:"#77291a",
		650:"#682317",
		700:"#591e14",
		750:"#4a1910",
		800:"#3b140d",
		850:"#2d0f0a",
		900:"#1d0a06",
		950:"#0f0503",
	  },
	  
}

// eslint-disable-next-line no-unused-vars
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
