"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gym, Membership } from "@prisma/client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface MembershipModalProps {
  gym: Gym;
  memberships: Membership[];
}

export function MembershipModal({ gym }: MembershipModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      description: "",
      price: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        gymId: gym.id,
      };
      await axios.post("/api/membership", payload);
      toast.success("Membership created!");
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-black hover:text-white">
          Add membership
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add membership</DialogTitle>
            <DialogDescription>
              Update fee and documents required
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4">
            <div className="grid gap-3">
              <Label htmlFor="title-1">Title</Label>
              <Input id="title-1" {...register("title")} required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description-1">Description</Label>
              <Textarea id="description-1" {...register("description")} rows={5} />
            </div>
            <Label htmlFor="fee-1">Price</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                $
              </span>
              <Input
                id="fee-1"
                type="text"
                className="pl-7"
                {...register("price")}
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-black" disabled={isLoading}>
              {isLoading ? "Saving" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
