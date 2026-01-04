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
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DOBPicker } from "./DOBPicker";
import { RequiredLabel } from "@/app/lib/helpers";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Membership, Waiver } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { SignaturePad } from "./SignaturePad";
import CardPaymentMethod from "./CardPaymentMethod";
import { Button } from "@/components/ui/button";

interface SignupFormProps {
  memberships: Membership[];
  waiver: Waiver | null;
}

const SignupForm = ({ memberships, waiver }: SignupFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      street: "",
      city: "",
      postCode: "",
      county: "",
      country: "",
      contactName: "",
      contactNumber: "",
      relationship: "",
      membershipId: "",
      signedWaiver: false,
      signature: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (!data.signedWaiver || !data.signature) {
      toast.error("You must sign the waiver");
      return;
    }
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Country</RequiredLabel>
                  </FormLabel>
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

        <section className="shadow-sm border bg-white p-8 md:p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-2">Membership</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-prose">
            Choose the membership that best fits your training goals.
          </p>

          <FormField
            control={form.control}
            name="membershipId"
            rules={{ required: "Please select a membership" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-3 block">
                  <RequiredLabel>Choose a membership</RequiredLabel>
                </FormLabel>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memberships.map((membership) => {
                    const selected = field.value === membership.id;

                    return (
                      <button
                        key={membership.id}
                        type="button"
                        onClick={() => field.onChange(membership.id)}
                        className={`
                  relative rounded-xl border p-6 text-left transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-black
                  ${
                    selected
                      ? "border-black bg-slate-50 ring-2 ring-black"
                      : "hover:border-slate-400 hover:shadow-sm"
                  }
                `}
                      >
                        {/* Selected badge */}
                        {selected && (
                          <span className="absolute top-3 right-3 rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white">
                            Selected
                          </span>
                        )}
                        <div className="flex flex-col justify-between h-full">
                          <h3 className="text-lg font-semibold text-slate-900 ">
                            {membership.title}
                          </h3>

                          {membership.description && (
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed ">
                              {membership.description}
                            </p>
                          )}

                          <div className="mt-6 flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-900">
                              ${membership.price}
                            </span>
                            <span className="text-sm text-slate-500">
                              / month
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <FormMessage className="mt-3" />
              </FormItem>
            )}
          />
        </section>

        <section className="shadow-sm border bg-white p-8 md:p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-2">Waiver</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-prose">
            Please read and sign the waiver below before continuing.
          </p>

          <FormItem>
            <FormLabel className="mb-2 block">
              <RequiredLabel>Liability waiver</RequiredLabel>
            </FormLabel>

            {/* Waiver text */}
            <div className="mb-6 rounded-md border bg-slate-50">
              <Textarea
                className="border-0 bg-transparent p-4 text-sm leading-relaxed resize-none min-h-55"
                readOnly
                value={waiver?.content}
              />
            </div>

            {/* Signature */}

            <p className="mb-3 text-sm font-medium text-slate-700">Signature</p>

            <SignaturePad
              onSign={async (signature) => {
                form.setValue("signature", signature);
                form.setValue("signedWaiver", true);
                toast.success("Signature captured");
              }}
            />

            <FormMessage />
          </FormItem>
        </section>

        <section className="shadow-sm border bg-white p-8 md:p-10 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-2">Account password</h2>
          <p className="text-sm text-slate-600 mb-6">
            Create a password to access your account.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Create a password</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input type="password" {...field} className="h-11" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === form.getValues("password") ||
                  "Passwords do not match",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel>Confirm password</RequiredLabel>
                  </FormLabel>

                  <FormControl>
                    <Input type="password" {...field} className="h-11" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>
        <section className="shadow-sm border bg-white p-10 rounded-lg mb-10">
          <h2 className="mb-4 text-xl font-bold">Payment</h2>
          <p className="mb-6 max-w-prose text-sm text-slate-600">
            Securely enter your payment details to complete your membership.
          </p>

          <CardPaymentMethod control={form.control} />
        </section>

        <section className="shadow-sm border bg-white p-10 rounded-lg">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">Create your account</h2>
            <p className="mt-1 text-sm text-slate-600">
              Review your details and complete your sign up
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              variant={"elevated"}
              className="
        w-full max-w-md
        bg-black text-white
        hover:bg-blue-700
        h-12 text-base font-semibold
      "
            >
              {isLoading ? "Signing up " : "Sign up"}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            By signing up, you agree to the gym’s waiver and terms
          </p>
        </section>
      </form>
    </Form>
  );
};

export default SignupForm;
