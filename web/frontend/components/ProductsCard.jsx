import { useEffect, useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  Image,
  DisplayText,
  TextStyle,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import axios from "axios";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [igData, setIgData] = useState({
    data: [],
  });
  const fetch = useAuthenticatedFetch();

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "5 products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };

  useEffect(() => {
    function loadIgUser() {
      const q = axios.get(
        `https://graph.instagram.com/me/media?fields=id,media_type,media_url,caption&access_token=${process.env.REACT_APP_INSTAGRAM_TOKEN}`
      );
      q.then((resp) => {
        console.log(resp.data);
        setIgData(resp.data);
      });
    }
    loadIgUser();
  }, []);

  return (
    <>
      {toastMarkup}
      <Card
        title="Product Counter"
        sectioned
        primaryFooterAction={{
          content: "Populate 5 products",
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price. You can
            remove them at any time.
          </p>
          {Object.keys(igData?.data).map((key, index) => {
            const dataArr = igData.data[key];
            if (["IMAGE", "CAROUSEL_ALBUM"].includes(dataArr.media_type)) {
              return (
                <div key={index}>
                  <Image
                    source={dataArr.media_url}
                    alt={dataArr.id}
                    width={120}
                  />
                  <hr></hr>
                  {dataArr.caption}
                </div>
              );
            }
          })}
          <Heading element="h4">
            TOTAL PRODUCTS
            <DisplayText size="medium">
              <TextStyle variation="strong">
                {isLoadingCount ? "-" : data.count}
              </TextStyle>
            </DisplayText>
          </Heading>
        </TextContainer>
      </Card>
    </>
  );
}
