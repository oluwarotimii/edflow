import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Verify Your Email</h1>
      <p className="text-xl mb-8 text-center">
        We&apos;ve sent a verification link to your email. Please check your inbox and click the link to verify your account.
      </p>
      <Button asChild>
        <Link href="/login">Proceed to Login</Link>
      </Button>
    </div>
  )
}

