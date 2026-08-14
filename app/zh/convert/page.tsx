import Converter from "@/components/music/Converter";

export const metadata = {
  title: "转换器 | NotaBridge 谱桥 - 简谱转五线谱",
  description: "将简谱即时转换为标准五线谱。支持简谱、五线谱与双谱对照三种视图，可导出高清 PNG 图片。",
};

export default function ConvertPageZh() {
  return <Converter locale="zh" />;
}
