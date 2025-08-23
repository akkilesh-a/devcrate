import { P } from "../typography";
import { LinkPreview } from "../animated";

export const Footer = () => {
  return (
    <footer className="w-full mt-16">
      <div className="container mx-auto pb-6 flex flex-col items-center">
        <P variant="muted" className="text-center">
          Built by{" "}
          <LinkPreview url="https://bento.me/akkilesh" className="underline">
            spacecentre
          </LinkPreview>
          . The source code is available on{" "}
          <LinkPreview
            url="https://github.com/akkilesh-a/devcrate"
            className="underline"
          >
            GitHub
          </LinkPreview>
        </P>
      </div>
    </footer>
  );
};
