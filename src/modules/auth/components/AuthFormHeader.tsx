export default function AuthFormHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <header>
            <h1 className="text-[#0E0F10] font-bold text-xl">{title}</h1>
            <p className="text-[#26292C] text-base font-normal">
                {description}
            </p>
        </header>
    );
}
