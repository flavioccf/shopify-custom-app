import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  Button
} from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import { useState } from "react"
import { IgPostsCollection } from "../components/IgPostsCollection"

export default function HomePage() {
  const [open, setOpen] = useState(true)
  return (
    <Page narrowWidth>
      <TitleBar title="App name" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card
          title="Ig Posts Container"
          sectioned
          >
            <IgPostsCollection/>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
