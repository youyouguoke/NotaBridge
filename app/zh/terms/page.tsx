import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "服务条款 | NotaBridge 谱桥",
  description: "谱桥（NotaBridge）在线简谱转五线谱工具的服务条款。",
};

export default function TermsPageZh() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-[720px] mx-auto w-full px-4 md:px-16 py-12">
        <h1 className="text-3xl font-semibold text-on-surface mb-6">服务条款</h1>
        <div className="space-y-4 text-base text-on-surface-variant leading-relaxed">
          <p>
            访问或使用谱桥（NotaBridge），即表示您同意遵守以下服务条款。如果您不同意，请勿使用本站。
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">1. 服务使用</h2>
          <p>
            谱桥提供将数字简谱转换为五线谱的工具。您可以将服务用于个人、教育及非商业用途。
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">2. 您创作的内容</h2>
          <p>
            您输入的任何音乐记谱内容均归您所有。我们不主张对用户生成内容的所有权。请确保您输入的内容可合法使用和分享。
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">3. 公域谱例</h2>
          <p>
            谱例库中的歌曲均为公域或传统曲目，仅供教育目的使用。
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">4. 免责声明</h2>
          <p>
            谱桥按「现状」提供，不提供任何形式的担保。我们无法保证每一次转换结果在音乐上都完全准确无误。
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">5. 条款更新</h2>
          <p>
            我们可能随时修改本条款。条款变更后继续使用本站，即表示您接受更新后的条款。
          </p>
          <p className="pt-4 text-sm text-secondary">最后更新：2026年8月</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
