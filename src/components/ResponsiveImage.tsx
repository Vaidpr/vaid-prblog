
import { cn } from "@/lib/utils";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "auto";
}

// Component for responsive and accessible images
const ResponsiveImage = ({
  src,
  alt,
  className,
  aspectRatio = "auto",
  ...props
}: ResponsiveImageProps) => {
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    auto: "",
  }[aspectRatio];

  return (
    <div className={cn("overflow-hidden rounded-lg", aspectRatioClass, className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-all",
          aspectRatio !== "auto" ? "object-center" : ""
        )}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage;
