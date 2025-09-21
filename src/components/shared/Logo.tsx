import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="inline-block">
            <Image
                src="/images/logo.svg"
                alt="Data Loom Logo"
                width={200}
                height={200}
                className="w-[130px]"
            />
        </Link>
    );
}
