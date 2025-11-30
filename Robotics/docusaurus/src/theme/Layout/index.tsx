import React from "react";
import Layout from "@theme-original/Layout";
import AIAssistantWidget from "../../components/ChatBot";
import SelectionTooltip from "@site/src/components/SelectionTooltip";
import { ChatProvider } from "@site/src/context/chatContext";

export default function LayoutWrapper(props) {
  return (
    <>
      <ChatProvider>
        <Layout {...props} />
        <SelectionTooltip />
        <AIAssistantWidget />
      </ChatProvider>
    </>
  );
}
