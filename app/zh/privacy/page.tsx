import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "隐私政策 | NotaBridge 谱桥",
  description: "谱桥隐私政策：我们不收集您的个人数据，简谱输入仅在浏览器本地处理。",
};

export default function PrivacyPageZh() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-[720px] mx-auto w-full px-4 md:px-16 py-12">
        <h1 className="text-3xl font-semibold text-on-surface mb-6">隐私政策</h1>
        <div className="space-y-4 text-base text-on-surface-variant leading-relaxed">
          <p>
            谱桥（NotaBridge）重视您的隐私。本政策说明您使用本站时我们如何处理信息。
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">1. 我们不收集的信息</h2>
          <p>
            我们不强制注册账号，也不追踪您的个人浏览行为。您在转换器中输入的简谱仅在浏览器本地处理，不会上传到我们的服务器。
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">2. 联系方式</h2>
          <p>
            如果你通过 hello@notabridge.app 联系我们，我们只会收到你主动提供的信息（例如邮箱地址和消息内容）。
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">3. Cookie</h2>
          <p>
            谱桥不使用 Cookie 进行追踪或广告投放。我们可能使用标准分析工具仅用于了解整体访问流量。
          </p>
          <h2 className="text-xl font-semibold text-on-surface mt-6">4. 政策更新</h2>
          <p>
            我们可能会不时更新本政策。政策变更后继续使用本网站，即表示您接受修订后的政策。
          </p>
          <p className="pt-4 text-sm text-secondary">最后更新：2026年8月</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
