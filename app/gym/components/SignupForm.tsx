"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DOBPicker } from "./DOBPicker";
import { RequiredLabel } from "@/app/lib/helpers";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Membership } from "@prisma/client";
import MembershipCard from "./MembershipCard";

interface SignupFormProps {
  memberships: Membership[];
}

const SignupForm = ({ memberships }: SignupFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FieldValues>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      await axios.put("/api/new-user", data);
      toast.success("Update sent");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? "Request failed");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-6">Personal details</h2>

          <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              rules={{ required: "First name is required" }}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>First name</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input placeholder="e.g. John" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Last name</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Smith" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Gender</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-45 bg-white">
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                          <SelectItem value="OMITTED">
                            Prefer not to say
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              rules={{ required: "Phone number is required" }}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Phone number</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 07700 900000"
                      {...field}
                      type="tel"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Email</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. johnsmith@gmail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              rules={{ required: "Date of birth is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Date of birth</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <DOBPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-6">Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              rules={{ required: "Street Address is required" }}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Street Address</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              rules={{ required: "City is required" }}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>City</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              rules={{ required: "Post code is required" }}
              name="postCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Post Code/ Zip</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              rules={{ required: "County is required" }}
              name="county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>County</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              rules={{ required: "Country is required" }}
              name="county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <CountryDropdown
                    placeholder="Country"
                    defaultValue={field.value}
                    onChange={(country) => {
                      field.onChange(country.alpha3);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-6">Emergency contact</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              rules={{ required: "Contact name is required" }}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Contact name</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              rules={{ required: "Contact number is required" }}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Contact number</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-45 bg-white">
                        <SelectValue placeholder="Relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value="PARENT">Parent</SelectItem>
                          <SelectItem value="SPOUSE">Spouse</SelectItem>
                          <SelectItem value="FAMILY MEMBER">
                            Family member
                          </SelectItem>
                          <SelectItem value="FRIEND">Friend</SelectItem>
                          <SelectItem value="GUARDIAN">Guadian</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="shadow-sm border bg-white p-10 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Membership</h2>

          
            <div className="flex flex-col items-center gap-4 rounded-md border bg-slate-50 p-6">
              <MembershipCard memberships={memberships} />
            </div>
          
        </section>
      </form>
    </Form>
  );
};

export default SignupForm;
