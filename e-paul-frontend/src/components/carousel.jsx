import React from "react";
import Slider from "react-slick";

//chakra
import { Heading, Text, Card, CardBody, Image, Button, Stack, Center, IconButton} from '@chakra-ui/react'

//icons
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

function NextArrow(props) {
    return (
        <div className={props.className} style={{ ...props.style, display: "block" }}>
        
            <IconButton
                isRound={true}
                variant='solid'
                colorScheme='teal'
                aria-label='Slide Right'
                fontSize={'3xl'}
                onClick={props.onClick}
                icon={<ChevronRightIcon />}
                marginTop={'-30px'}
            />
        </div>
    );
}
  
  function PrevArrow(props) {
    return (
        <div className={props.className} style={{ ...props.style, display: "block"}}>
            <IconButton
                isRound={true}
                variant='solid'
                colorScheme='teal'
                aria-label='Slide Left'
                fontSize={'3xl'}
                onClick={props.onClick}
                icon={<ChevronLeftIcon />}
                marginTop={'-30px'}
                marginLeft={'-20px'}
            />
        </div>
    );
}

function getSlideColorString(slideNumber){
    const slideColorStrings = ["teal.200", "teal.650", "teal.300",  "teal.750", "teal.400", "teal.550" ]
    const slideColorDarkness = [0,1,0,1,0,1]
    return [slideColorStrings[slideNumber % slideColorStrings.length], slideColorDarkness[slideNumber % slideColorStrings.length]]
}

export default function SlideShow(props) {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 1500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
        {
            breakpoint: 2048,
            settings: {
                slidesToShow: 3
            }
        },
        {
            breakpoint: 1536,
            settings: {
                slidesToShow: 2
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1
            }
        },
        {
            breakpoint:650,
            settings: {
                arrows:false,
                slidesToShow: 1
            }
        }
    ],
    
  };
  return (
    <>
    <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
    />
    <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
    />
    <div className="slider-container">
    <Slider {...settings} >
        {props.slides.map((slide, index) => (
            <Center px={"2"} height={'100%'} key={'slide_'+index}>
                <Card borderRadius={"32px"} bg={getSlideColorString(index)[0]}  minH={'620px'}>
                    <CardBody>
                        <Center>
                            <Image
                            src={slide.image}
                            alt={slide.title+'-image'}
                            maxH={250}
                            maxW={250}
                            />
                        </Center>
                        <Stack mt='6' spacing='3'>
                            <Heading size='md' textAlign={"center"} textColor={(getSlideColorString(index)[1]===1)?'teal.10':'teal.900'}>{slide.title}</Heading >
                            <Center>
                                <Text textAlign={"block"} maxW={400} textColor={(getSlideColorString(index)[1]===1)?'teal.10':'teal.900'}>
                                    {slide.text}
                                </Text>
                            </Center>
                        </Stack>
                    {slide.additionalHTML &&
                        <Center>
                            {slide.additionalHTML}
                        </Center>
                    }
                    </CardBody>

                    {slide.button &&
                        <Center p={"3"}>
                                <Button variant='solid' colorScheme='whiteAlpha' onClick={slide.button?.onClick} textColor={'teal.900'}>
                                    {slide.button?.text}
                                </Button>
                            
                        </Center>
                    }
                </Card>
            </Center>
        ))}
    </Slider>
    
    </div>
    </>
    
  );
}

