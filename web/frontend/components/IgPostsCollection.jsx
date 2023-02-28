import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { Image, MediaCard } from "@shopify/polaris";
import styles from "./igPostsCollection.module.css";

export function IgPostsCollection() {
  const fetch = useAuthenticatedFetch();
  const [igData, setIgData] = useState({
    data: [],
  });
  const morePosts = async(nextPage) => {
    const fetchNextPosts = await fetch("/api/instagram/next_posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ next: nextPage })
    })
    const data = await fetchNextPosts.json();
    setIgData({
      ...igData,
      data: [
        ...igData.data,
        data.data
      ],
      paging: data.paging
    })
  }
  const [selectedPost, setSelectedPost] = useState(0);
  useEffect(() => {
    async function loadIgUser() {
      try {
        const q = await fetch("/api/instagram/posts");
        const d = await q.json();
        console.log(d);
        setIgData(d);
      } catch (error) {
        console.log(error);
      }
    }
    loadIgUser();
  }, []);

  return (
    <>
      {Object.keys(igData?.data).map((key, index) => {
        const dataArr = igData.data[key];
        if (["IMAGE", "CAROUSEL_ALBUM"].includes(dataArr.media_type)) {
          return (
            <div key={index} id={dataArr.id} style={{ display: index === selectedPost ? "block" : "none" }}>
              <MediaCard
                title={dataArr.media_type}
                description={dataArr.caption}
                primaryAction={{
                  content: 'Next Post',
                  onAction: async () => {
                    if((index+1) === 4) {
                      const additionalPosts = await morePosts(igData.paging.next);
                      console.log(additionalPosts);
                      console.log(igData)
                    } else {
                      setSelectedPost(index+1);
                    }
                  },
                }}
                secondaryAction={{
                  content: 'Previous Post',
                  onAction: () => {
                    setSelectedPost(index-1);
                  },
                  disabled: (index - 1) < 0,
                  outline: true
                }}
              >
                <Image
                  source={dataArr.media_url}
                  alt={dataArr.id}
                  width={480}
                  className={styles.igImage}
                />
              </MediaCard>
            </div>
          );
        } else if (dataArr.media_type === "VIDEO") {
          return (
            <div key={index} id={dataArr.id} style={{ display: index === selectedPost ? "block" : "none" }}>
              <MediaCard
                title={dataArr.media_type}
                description={dataArr.caption}
                primaryAction={{
                  content: 'Next Post',
                  onAction: async () => {
                    if((index+1) === 4) {
                      const additionalPosts = await morePosts(igData.paging.next);
                      console.log(additionalPosts);
                      console.log(igData)
                    } else {
                      setSelectedPost(index+1);
                    }
                  },
                }}
                secondaryAction={{
                  content: 'Previous Post',
                  onAction: () => {
                    setSelectedPost(index-1);
                  },
                  disabled: (index - 1) < 0,
                  outline: true
                }}
              >
                <video className={styles.igVideo} controls muted>
                  <source src={dataArr.media_url} type="video/mp4"></source>
                </video>
              </MediaCard>
            </div>
          );
        }
      })}
    </>
  );
}
