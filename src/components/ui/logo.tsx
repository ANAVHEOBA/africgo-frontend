import Link from "next/link"
import Image from "next/image"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <Image 
        src="/logo.png"
        alt="GoFromA2zAfrica Logo"
        width={48}
        height={48}
        className="w-12 h-12"
      />
      <span className="font-bold text-2xl tracking-tight">GoFromA2zAfrica</span>
    </Link>
  )
}
