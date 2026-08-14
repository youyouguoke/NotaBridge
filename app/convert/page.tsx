import Converter from "@/components/music/Converter";

export const metadata = {
  title: "Converter | NotaBridge - Numbered Notation to Staff Notation",
  description: "Convert Jianpu / numbered notation into standard sheet music instantly. View numbered notation, staff notation, and side-by-side comparison.",
};

export default function ConvertPage() {
  return <Converter locale="en" />;
}
