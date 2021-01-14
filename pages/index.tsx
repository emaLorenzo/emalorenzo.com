import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Flex, Heading, Text, Box } from '@chakra-ui/react';
import DrawBlob, { BlobType } from 'blob-animated';

import * as PostsApi from 'api/posts';
import { PostCard, MotionFlex, ChatBuble } from 'components';
import { artistBlobOptions, genericBlobOptions } from 'lib/blobs';
import { useInterval } from 'hooks';

const Home: NextPage = ({ allPosts, preview }: any) => {
  const artistCanvasRef = React.useRef<HTMLDivElement>();
  const emaCanvasRef = React.useRef<HTMLCanvasElement>();
  const emaImageRef = React.useRef<HTMLImageElement>();

  React.useEffect(() => {
    if (artistCanvasRef.current) {
      const options = artistBlobOptions(artistCanvasRef.current);
      const Blob: BlobType = new DrawBlob(options);
    }
    if (emaCanvasRef.current && emaImageRef.current) {
      const options = genericBlobOptions(
        emaCanvasRef.current,
        emaImageRef.current
      );
      const Blob: BlobType = new DrawBlob(options);
    }
  }, []);

  const [bubleIndex, setBubleIndex] = React.useState(0);
  const [bubleDelay, setBubleDelay] = React.useState(3000);

  const bublesData = [
    {
      id: 1,
      content: (
        <>
          <Text as="h1" fontSize="2rem">
            Hey,
          </Text>
          <Box display="inline">
            <Text fontSize="1rem">
              Soy Ema, un fullstack dev de 🇦🇷. <br />
              Este es mi espacio donde comparto lo que aprendo
            </Text>
          </Box>
        </>
      ),
    },
    {
      id: 2,
      content: (
        <>
          <Box display="inline">
            <Text fontSize="1rem">
              Me especializo en tecnologias mobile y web, pero me defiendo en
              backend, devops y videojuegos
              <br />
            </Text>
          </Box>
        </>
      ),
    },
    {
      id: 3,
      content: (
        <>
          <Box display="inline">
            <Text fontSize="1rem">
              Mi stack favorito es <br /> Next.js + ChakraUI + Framer Motion
            </Text>
          </Box>
        </>
      ),
    },
    {
      id: 4,
      content: (
        <>
          <Box display="inline">
            <Text fontSize="1rem">Aguante Naruto y el ramen</Text>
          </Box>
        </>
      ),
    },
  ];

  useInterval(() => {
    if (bubleIndex < bublesData.length) {
      setBubleIndex(bubleIndex + 1);
    } else {
      setBubleDelay(null);
    }
  }, bubleDelay);

  const renderBubles = bublesData.map(({ id, content }, i) => {
    if (bubleIndex < i) {
      return null;
    }
    const status = bubleIndex === i ? 'LOADING' : 'MESSAGE'; // +1 compact
    return <ChatBuble key={id} status={status} content={content} />;
  });

  return (
    <Flex
      as="main"
      direction="column"
      overflowY="scroll"
      align="stretch"
      position="relative"
      top="-1px"
    >
      <Head>
        <title>Ema Lorenzo</title>
      </Head>

      {/* hero */}
      <Flex
        direction="row"
        justify="center"
        align="center"
        py={160}
        px={20}
        bg="gray.900"
        position="relative"
      >
        {/* <Box
          as="canvas"
          ref={artistCanvasRef}
          position="absolute"
          right="-20rem"
        /> */}

        <Flex
          h="full"
          w="full"
          position="relative"
          zIndex="1"
          justify="center"
          align="stretch"
        >
          {/* chat */}
          {/* <MotionFlex
            direction="column"
            p={4}
            borderWidth={1}
            borderRadius={16}
            bg="white"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2 }}
          >
            <Text as="h1" fontSize="2rem">
              Hey,
            </Text>
            <Box display="inline">
              <Text fontSize="1rem">
                Soy Ema, un fullstack dev de 🇦🇷. <br />
                Este es mi espacio donde comparto lo que aprendo
              </Text>
            </Box>
          </MotionFlex> */}
          <MotionFlex w={80} direction="column" justify="flex-start">
            {renderBubles}
          </MotionFlex>

          <Box
            as="svg"
            w="400px"
            h="400px"
            viewBox="0 0 170 170"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="user-space" clipPathUnits="userSpaceOnUse">
                <path
                  fill="#FF0066"
                  d="M49.5,-65.4C58.2,-51.8,55.1,-30.5,54.2,-12.9C53.4,4.7,54.7,18.5,49.1,28.6C43.6,38.6,31.1,44.8,17.6,50.9C4.1,57,-10.5,62.8,-22.5,59.5C-34.5,56.1,-44.1,43.5,-53.7,29.7C-63.3,15.8,-73,0.6,-73.4,-15.7C-73.8,-32,-65,-49.4,-51.2,-62.2C-37.4,-75,-18.7,-83.1,0.9,-84.1C20.4,-85.2,40.9,-79.1,49.5,-65.4Z"
                  transform="translate(100 100)"
                />
              </clipPath>
            </defs>

            <image
              width="100%"
              height="100%"
              // preserveAspectRatio="xMinYMin slice"
              href="/images/ema.png"
              clipPath="url(#user-space)"
            />
          </Box>
        </Flex>
      </Flex>

      {/* <canvas ref={emaCanvasRef} style={{ width: 500, height: 500 }} /> */}
      {/* border bottom */}
      <Box position="sticky" height="1px" top={0} bg="gray.300" width="full" />

      {/* posts */}
      <Flex direction="column" px={32}>
        <Heading as="h2" mt={20}>
          Ultimas publicaciones
        </Heading>
        {allPosts.map((post) => {
          return post.slug && <PostCard key={post.slug} post={post} />;
        })}
      </Flex>
    </Flex>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await PostsApi.getAllPostsForHome(preview);
  return {
    props: { allPosts, preview },
    revalidate: 1, // In seconds
  };
};
