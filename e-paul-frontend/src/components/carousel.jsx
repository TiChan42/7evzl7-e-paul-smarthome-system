/**
 * Komponente für eine Bildershow (Carousel).
 * 
 * @component
 * @example
 * // Beispiel Verwendung:
 * const slides = [
 *   {
 *     title: 'Slide 1',
 *     image: 'slide1.jpg',
 *     text: 'Beschreibung des Slide 1',
 *     button: {
 *       text: 'Mehr erfahren',
 *       onClick: () => {
 *         // Aktion beim Klicken des Buttons
 *       },
 *     },
 *   },
 *   {
 *     title: 'Slide 2',
 *     image: 'slide2.jpg',
 *     text: 'Beschreibung des Slide 2',
 *     additionalHTML: <div>Zusätzlicher HTML-Inhalt</div>,
 *   },
 *   // Weitere Slides...
 * ];
 * 
 * function App() {
 *   return (
 *     <SlideShow slides={slides} />
 *   );
 * }
 * 
 * @param {Object[]} props.slides - Die Slides für die Bildershow.
 * @param {string} props.slides[].title - Der Titel des Slides.
 * @param {string} props.slides[].image - Der Pfad zum Bild des Slides.
 * @param {string} props.slides[].text - Der Text des Slides.
 * @param {Object} [props.slides[].button] - Der Button des Slides.
 * @param {string} props.slides[].button.text - Der Text des Buttons.
 * @param {Function} props.slides[].button.onClick - Die Funktion, die beim Klicken des Buttons ausgeführt wird.
 * @param {ReactNode} [props.slides[].additionalHTML] - Zusätzlicher HTML-Inhalt für den Slide.
 * 
 * @returns {JSX.Element} Die Carousel-Komponente.
 * 
 * @requires chakra-ui/react
 * @requires react
 * @requires react-slick
 * @requires chakra-ui/icons
 * 
 */
import React from 'react';
import Slider from 'react-slick';

//chakra
import {
    Heading,
    Text,
    Card,
    CardBody,
    Image,
    Button,
    Stack,
    Center,
    IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
// Carousel Komponente
// Pfeil nach rechts
function NextArrow(props) {
    return (
        <div
            className={props.className}
            style={{ ...props.style, display: 'block' }}
        >
            <IconButton
                mt={'-30px'}
                fontSize={'3xl'}
                aria-label='Slide Right'
                colorScheme='teal'
                icon={<ChevronRightIcon />}
                isRound={true}
                onClick={props.onClick}
                variant='solid'
            />
        </div>
    );
}

//Pfeil nach links
function PrevArrow(props) {
    return (
        <div
            className={props.className}
            style={{ ...props.style, display: 'block' }}
        >
            <IconButton
                mt={'-30px'}
                ml={'-20px'}
                fontSize={'3xl'}
                aria-label='Slide Left'
                colorScheme='teal'
                icon={<ChevronLeftIcon />}
                isRound={true}
                onClick={props.onClick}
                variant='solid'
            />
        </div>
    );
}

// Farben für die Slides
function getSlideColorString(slideNumber) {
    const slideColorStrings = [
        'teal.200',
        'teal.650',
        'teal.300',
        'teal.750',
        'teal.400',
        'teal.550',
    ];
    const slideColorDarkness = [0, 1, 0, 1, 0, 1];
    return [
        slideColorStrings[slideNumber % slideColorStrings.length],
        slideColorDarkness[slideNumber % slideColorStrings.length],
    ];
}

// SlideShow Komponente
export default function SlideShow(props) {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 1500,
        lazyLoad: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 2048,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1536,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 650,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                },
            },
        ],
    };
    return (
        <>
            <link
                rel='stylesheet'
                type='text/css'
                charSet='UTF-8'
                href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
            />
            <link
                rel='stylesheet'
                type='text/css'
                href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
            />
            <div className='slider-container'>
                <Slider {...settings}>
                    {props.slides.map((slide, index) => (
                        <Center
                            key={'slide_' + index}
                            h={'100%'}
                            px={'2'}
                        >
                            <Card
                                minH={'620px'}
                                bg={getSlideColorString(index)[0]}
                                borderRadius={'32px'}
                            >
                                <CardBody>
                                    <Center>
                                        <Image
                                            maxW={250}
                                            maxH={250}
                                            alt={slide.title + '-image'}
                                            src={slide.image}
                                        />
                                    </Center>
                                    <Stack
                                        mt='6'
                                        spacing='3'
                                    >
                                        <Heading
                                            textColor={
                                                getSlideColorString(
                                                    index
                                                )[1] === 1
                                                    ? 'teal.10'
                                                    : 'teal.900'
                                            }
                                            textAlign={'center'}
                                            size='md'
                                        >
                                            {slide.title}
                                        </Heading>
                                        <Center>
                                            <Text
                                                maxW={400}
                                                textColor={
                                                    getSlideColorString(
                                                        index
                                                    )[1] === 1
                                                        ? 'teal.10'
                                                        : 'teal.900'
                                                }
                                                textAlign={'block'}
                                            >
                                                {slide.text}
                                            </Text>
                                        </Center>
                                    </Stack>
                                    {slide.additionalHTML && (
                                        <Center>{slide.additionalHTML}</Center>
                                    )}
                                </CardBody>

                                {slide.button && (
                                    <Center p={'3'}>
                                        <Button
                                            textColor={'teal.900'}
                                            colorScheme='whiteAlpha'
                                            onClick={slide.button?.onClick}
                                            variant='solid'
                                        >
                                            {slide.button?.text}
                                        </Button>
                                    </Center>
                                )}
                            </Card>
                        </Center>
                    ))}
                </Slider>
            </div>
        </>
    );
}
