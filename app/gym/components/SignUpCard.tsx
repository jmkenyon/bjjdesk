import { Button } from '@/components/ui/button'
import React from 'react'

interface SignUpCardProps {
    isLoading: boolean;
    title?: string
    subtitle?: string
}

const SignUpCard = ({isLoading, title="Create your account", subtitle="Review your details and complete your sign up"}: SignUpCardProps) => {
  return (
    <section className="shadow-sm border bg-white p-10 rounded-lg">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {subtitle}
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
  )
}

export default SignUpCard