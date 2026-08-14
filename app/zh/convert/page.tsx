import Converter from "@/components/music/Converter";

export const metadata = {
  title: "转换器 | NotaBridge 谱桥 - 简谱转五线谱",
  description: "在线简谱转五线谱工具。输入数字简谱，自动生成标准五线谱。支持简谱、五线谱和对照视图。五线谱转简谱功能即将上线。",
};

export default function ConvertPageZh() {
  return <Converter locale="zh" />;
}
