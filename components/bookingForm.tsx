"use client";
import { Fieldset, TextInput, Textarea, Drawer } from "@mantine/core";
import { Button } from "./ui/button";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useForm } from "@mantine/form";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BookingForm() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const schema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    message: z.string().min(2, { message: "Message is required" }),
  });

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = async (values: {
    name: string;
    email: string;
    message: string;
  }) => {
    try {
      if (form.validate()) {
        const docRef = await addDoc(collection(db, "bookings"), {
          name: values.name,
          email: values.email,
          message: values.message,
          createdAt: new Date(),
        });
        alert("Submitted successfully ");
        console.log("Document written with ID: ", docRef.id);
        router.push("/chat");
      } else {
        alert("Wrong credential");
      }

      form.reset();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpened(true)}
        className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 text-black border-none outline-none mt-8 w-full"
      >
        Book by Loca
      </Button>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Booking Form"
        padding="xl"
        // size="25%"
        styles={{
          content: {
            backgroundColor: '#000'
          },
          header: {
            backgroundColor: '#000'
          }
        }}
       
      transitionProps={{
        transition: "rotate-left",
        duration: 150,
        timingFunction: "linear",
      }}
      className=" text-white"
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
      <div className="">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Fieldset
            legend="Please fill in the form"
            styles={{
              root: { backgroundColor: "black", borderColor: "white" },
              legend: { color: "white" },
            }}
          >
            <TextInput
              withAsterisk
              label="Your name"
              placeholder="Your name"
              {...form.getInputProps("name")}
              styles={{ label: { color: "white" }, input: { color: "white", backgroundColor: "#333" } }}
            />
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Email"
              mt="md"
              {...form.getInputProps("email")}
              styles={{ label: { color: "white" }, input: { color: "white", backgroundColor: "#333" } }}
            />
            <Textarea
              withAsterisk
              label="Description"
              description="Describe the type of services you want"
              placeholder="Describe your services here"
              autosize
              minRows={2}
              maxRows={4}
              {...form.getInputProps("message")}
              styles={{
                label: { color: "white" },
                description: { color: "white" },
                input: { color: "white", backgroundColor: "#333" }
              }}
            />
          </Fieldset>
          <Button
            type="submit"
            className="bg-blue-400 rounded-full p-8 hover:bg-blue-300 text-black border-none outline-none mt-8 w-full"
          >
            Submit
          </Button>
        </form>
      </div>
    </Drawer >
    </>
  );
}
