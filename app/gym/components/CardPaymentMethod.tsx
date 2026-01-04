"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, FieldValues } from "react-hook-form";

interface CardPaymentMethodProps {
  control: Control<FieldValues>;
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "") // remove non-digits
    .slice(0, 16) // limit to 16 digits
    .replace(/(.{4})/g, "$1 ") // insert space every 4 digits
    .trim();
}

export default function CardPaymentMethod({ control }: CardPaymentMethodProps) {
  return (
    <Card className="w-full md:w-[450px]">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Add a new payment method to your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        {/* Name on card */}
        <FormField
          control={control}
          name="cardName"
          rules={{ required: "Name on card is required" }}
          render={({ field }) => (
            <FormItem>
              <Label>Name on the card</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="John Doe"
                  autoComplete="cc-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Card number + CVC */}
        <div className="grid grid-cols-4 gap-2">
          <FormField
            control={control}
            name="cardNumber"
            rules={{ required: "Card number is required" }}
            render={({ field }) => (
              <FormItem className="col-span-3">
                <Label>Card number</Label>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(formatCardNumber(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cvc"
            rules={{ required: "CVC is required" }}
            render={({ field }) => (
              <FormItem className="col-span-1">
                <Label>CVC</Label>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="CVC"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    maxLength={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Expiry */}
        <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <FormField
            control={control}
            name="expMonth"
            rules={{ required: "Expiry month required" }}
            render={({ field }) => (
              <FormItem>
                <Label>Month</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = String(i + 1).padStart(2, "0");
                      return (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className="grid gap-2">

          <FormField
            control={control}
            name="expYear"
            rules={{ required: "Expiry year required" }}
            render={({ field }) => (
              <FormItem >
                <Label>Year</Label>
                <Select value={field.value} onValueChange={field.onChange} >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <SelectItem key={year} value={`${year}`}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </div>
        {/* Postcode */}
        <FormField
          control={control}
          name="billingPostcode"
          rules={{ required: "Postcode is required" }}
          render={({ field }) => (
            <FormItem>
              <Label>Post code</Label>
              <FormControl>
                <Input {...field} placeholder="SW1A 0AA" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
