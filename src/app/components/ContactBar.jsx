import Image from "next/image";

export default function ContactBar() {
  return (
    <div className="fixed bottom-0 right-0  mb-1 mr-2 md:mb-2md:mr-3  z-20 flex flex-row gap-2 h-16 justify-between">
      <a
        className=" hover:opacity-90 transition-all duration-100 hover:scale-105"
        href="https://wa.me/385976663532"
      >
        <Image
          src="/images/whatsapp.svg"
          alt="language"
          height="48"
          width="48"
        />
      </a>
    </div>
  );
}
