"use client";

import { Form } from "@/components/ui/form";
import PersonDetailsSection from "./PersonDetailsSection";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { DropIn, Gym, Waiver } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import WaiverCard from "./WaiverCard";
import SignUpCard from "./SignUpCard";
import CardPaymentMethod from "./CardPaymentMethod";
import { generateTenantURL } from "@/app/lib/utils";

interface DropInViewProps {
  gym: Gym;
  waiver: Waiver | null;
  dropIn: DropIn;
}

const DropInView = ({ gym, waiver, dropIn }: DropInViewProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      signedWaiver: false,
      signature: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (waiver && (!data.signedWaiver || !data.signature)) {
      toast.error("You must sign the waiver");
      setIsLoading(false);
      return;
    }
    try {
      await axios.post(`/api/drop-in?gym=${gym.slug}`, data);
      toast.success("Form submitted!");
      router.push(`${generateTenantURL(gym.slug)}/success`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? "Request failed");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PersonDetailsSection control={form.control} />

        {waiver && <WaiverCard waiver={waiver} form={form} />}
        {dropIn.fee != null && dropIn.fee > 0 && (
          <CardPaymentMethod
            control={form.control}
            title={`Drop-in fee: ${
              gym.currency === "GBP" ? "£" : gym.currency === "USD" ? "$" : "€"
            }${dropIn.fee}`}
            subtitle="Securely enter your payment details to complete your drop-in"
          />
        )}
        <SignUpCard
          isLoading={isLoading}
          title="Confirm Drop-in"
          subtitle="Review your details and confirm your session"
        />
      </form>
    </Form>
  );
};

export default DropInView;
