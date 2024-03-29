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

//icons
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

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
