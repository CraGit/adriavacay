import SmallHeading from "@/components/SmallHeading";

const MessageSentPage = () => {
  return (
    <div className="container flex flex-col justify-center items-center py-48 md:py-72 px-4 md:px-0">
      <SmallHeading heading="Message Sent" />
      <p className="text-xl font-semibold pt-4 text-center">
        Your message has been sent successfully. We will get back to you ASAP.
      </p>
    </div>
  );
};

export default MessageSentPage;
