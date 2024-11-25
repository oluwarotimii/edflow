import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OnboardingCompletePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Onboarding Complete!</h1>
      <p className="text-xl mb-8 text-center">
        Congratulations! Your school is now set up on Edflow. We&apos;ve sent a confirmation email with further instructions.
      </p>
      <Button asChild>
        <Link href="https://play.google.com/store/apps/details?id=com.edflow.app" target="_blank" rel="noopener noreferrer">
          Download Mobile App
        </Link>
      </Button>
    </div>
  )
}

