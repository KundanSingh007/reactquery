import {
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const fetchPosts = async (id) => {
  try {
    const { data } = await axios.get(
      `https://gorest.co.in/public/v2/posts?page=${id}`
    );
    return data;
  } catch (error) {
    throw Error("Unable to fetch Posts");
  }
};

const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const pageId = parseInt(id);

  const { data, isLoading } = useQuery(
    ["posts", pageId],
    () => fetchPosts(pageId),
    {
      keepPreviousData: true,
      onError: (error) => {
        toast({ status: "error", title: error.message });
      },
    }
  );

  return (
    <Container maxW="1400px" mt="5">
      {isLoading ? (
        <Grid placeItems="center" height="100vh">
          <Spinner />
        </Grid>
      ) : (
        <>
          <Flex justifyContent="space-between" mb="4">
            <Button
              colorScheme="red"
              onClick={() => {
                if (data !== null) {
                  navigate(`/${pageId - 1}`);
                }
              }}
              disabled={!data !== null}
            >
              Prev
            </Button>
            <Text>Current Page {pageId}</Text>
            <Button
              colorScheme="green"
              onClick={() => {
                if (data !== null) {
                  navigate(`/${pageId + 1}`);
                }
              }}
            >
              Next
            </Button>
          </Flex>
          {data &&
            data?.map((post) => (
              <Stack
                p="4"
                boxShadow="md"
                borderRadius="xl"
                border="1px solid #ccc"
                key={post.id}
                mb="4"
              >
                <Flex justifyContent={"space-between"}>
                  <Text>User Id: {post.user_id}</Text>
                  <Text>Post Id: {post.id}</Text>
                </Flex>
                <Heading fontSize={"2xl"}>{post.title}</Heading>
                <Text>{post.body}</Text>
              </Stack>
            ))}
        </>
      )}
    </Container>
  );
};

export default Home;
