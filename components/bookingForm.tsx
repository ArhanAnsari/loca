"use client";
import { Fieldset, TextInput, Textarea } from "@mantine/core";
import { Button } from "./ui/button";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useForm } from "@mantine/form";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function BookingForm() {
    const router = useRouter()
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
        alert("Submitted successfully ")
        console.log("Document written with ID: ", docRef.id);
        router.push("/chat")
      }else{
        alert("Wrong credential")
      }
     
      form.reset();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="w-full max-w-7xl m-auto lg:p-16 py-16 px-2">
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="bg-[#cccccc46] text-white p-6 rounded-md"
      >
        <Fieldset
          legend="Please fill in the form"
          style={{ backgroundColor: "#1111", borderColor: "white" }}
        >
          <TextInput
            withAsterisk
            label="Your name"
            placeholder="Your name"
            {...form.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="Email"
            mt="md"
            {...form.getInputProps("email")}
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
          />
        </Fieldset>
        <Button className="bg-blue-400 rounded-full p-8 hover:bg-blue-300 text-black border-none outline-none mt-8 w-full">
          Book by Loca
        </Button>
      </form>
    </div>
  );
}
