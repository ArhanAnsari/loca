"use client";
import Navbar from "@/components/navbar";
import React, { useState } from "react";
import { Accordion } from "@mantine/core";
import { faqs } from "./data";
const FAQ = () => {
  const [open, setOpen] = useState(false);
  const items = faqs.map((item) => (
    <Accordion.Item key={item.question} value={item.question} style={{backgroundColor: "#222327", color: "#e3e3e3", borderBottomStyle: "none", marginTop: "6px"}}>
      <Accordion.Control icon={item.emoji} style={{backgroundColor: "#222327", color: "#e3e3e3",padding: "5px" }}>{item.question}</Accordion.Control>
      <Accordion.Panel>{item.answer}</Accordion.Panel>
    </Accordion.Item>
  ));
  return (
    <main className="min-h-screen h-screen overflow-hidden flex flex-col">
      <div className="text-white flex-1 overflow-scroll p-2 lg:p-5 bg-[#131314]">
        <Navbar />
        <div className=" w-full max-w-6xl mx-auto h-screen max-h-96 mt-10 px-3">
          <h1 className="text-center text-3xl text-[#e3e3e3]">What is Loca AI?</h1>
          <Accordion defaultValue="Apples"  transitionDuration={1000}>{items}</Accordion>
        </div>
      </div>
    </main>
  );
};

export default FAQ;

