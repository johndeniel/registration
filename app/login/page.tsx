import { UserAuthForm } from '@/components/user-auth-form'

export default function AuthenticationPage() {
    return (
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
         <UserAuthForm />
      </div>
    )
}