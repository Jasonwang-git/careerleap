"use client";

import { useState } from "react";
import Image from "next/image";
import {
    ArrowRight,
    AudioLines,
    BarChart3,
    BrainCircuit,
    Check,
    ChevronRight,
    FileCheck2,
    FileText,
    Mic2,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
    Upload,
    WandSparkles,
    Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
    onNavigate: (page: "interview" | "resume" | "guide") => void;
}

const capabilityRows = [
    { label: "岗位匹配", value: 86, color: "bg-teal-500" },
    { label: "表达结构", value: 74, color: "bg-blue-500" },
    { label: "技术深度", value: 68, color: "bg-violet-500" },
];

const workflowSteps = [
    {
        number: "01",
        title: "导入求职目标",
        description: "上传简历并粘贴目标岗位 JD，AI 自动建立你的求职上下文。",
        icon: Upload,
    },
    {
        number: "02",
        title: "针对性训练",
        description: "选择文本或语音面试，在真实追问中练习内容与表达。",
        icon: BrainCircuit,
    },
    {
        number: "03",
        title: "复盘并提升",
        description: "查看能力画像和改进建议，再把亮点沉淀进你的简历。",
        icon: TrendingUp,
    },
];

const featureTours = [
    {
        number: "01",
        label: "模拟面试",
        title: "像真实面试一样思考和表达",
        description: "AI 根据你的简历与目标岗位动态规划问题，并在回答后自然追问，让训练不再是机械题库。",
        bullets: ["文本与实时语音双模式", "按轮次调整问题难度", "完整保存回答与录音"],
        icon: AudioLines,
        action: "进入面试训练",
        page: "interview",
    },
    {
        number: "02",
        label: "简历工作室",
        title: "从岗位要求反推简历表达",
        description: "匹配分析、内容优化与 HR 审核三个角色协同工作，把模糊经历转化为有证据的竞争力。",
        bullets: ["JD 关键词匹配分析", "逐段诊断与改写建议", "生成岗位定向版本"],
        icon: FileCheck2,
        action: "打开简历工作室",
        page: "resume",
    },
    {
        number: "03",
        label: "成长画像",
        title: "让每一次练习都有积累",
        description: "把多次面试中的表现汇总为持续更新的能力画像，明确优势、短板和下一阶段训练重点。",
        bullets: ["五维能力趋势分析", "自动提取技能标签", "生成可执行提升建议"],
        icon: BarChart3,
        action: "开始积累成长数据",
        page: "interview",
    },
] as const;

export function LandingPage({ onNavigate }: LandingPageProps) {
    const [activeFeature, setActiveFeature] = useState(0);
    const feature = featureTours[activeFeature];
    const ActiveFeatureIcon = feature.icon;

    const scrollToFeatures = () => {
        document.getElementById("features-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="flex items-center gap-3"
                        aria-label="返回首页顶部"
                    >
                        <Image src="/logo.png" alt="职跃 CareerLeap" width={38} height={38} priority />
                        <span className="text-lg font-bold tracking-tight">
                            职跃 <span className="font-medium text-slate-400">CareerLeap</span>
                        </span>
                    </button>

                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                        <button type="button" onClick={scrollToFeatures} className="transition-colors hover:text-teal-600">
                            核心能力
                        </button>
                        <button type="button" onClick={() => onNavigate("guide")} className="transition-colors hover:text-teal-600">
                            使用指南
                        </button>
                        <span className="flex items-center gap-2 text-slate-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            服务正常
                        </span>
                    </nav>

                    <Button
                        onClick={() => onNavigate("interview")}
                        className="h-10 rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
                    >
                        开始体验
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </header>

            <main>
                <section className="relative px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-40">
                    <div className="absolute left-1/2 top-0 -z-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.12),transparent_68%)]" />
                    <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
                        <div>
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-sm font-semibold text-teal-700">
                                <Sparkles className="size-4" />
                                AI 驱动的职业成长工作台
                            </div>

                            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
                                看见优势，
                                <br />
                                <span className="text-teal-600">练好表达</span>，拿下机会。
                            </h1>

                            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                                从简历诊断到全真模拟面试，职跃围绕目标岗位建立训练闭环，
                                帮你知道哪里需要提升，也知道下一步该怎么做。
                            </p>

                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    size="lg"
                                    onClick={() => onNavigate("interview")}
                                    className="h-13 rounded-xl bg-teal-600 px-6 text-base font-semibold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700"
                                >
                                    <Mic2 className="size-5" />
                                    开始模拟面试
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => onNavigate("resume")}
                                    className="h-13 rounded-xl border-slate-300 bg-white px-6 text-base font-semibold text-slate-800 hover:border-teal-300 hover:bg-teal-50"
                                >
                                    <FileText className="size-5" />
                                    优化我的简历
                                </Button>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                                {[
                                    "支持自定义模型",
                                    "文本与语音双模式",
                                    "面试记录持续沉淀",
                                ].map((item) => (
                                    <span key={item} className="flex items-center gap-2">
                                        <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                            <Check className="size-3.5" />
                                        </span>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-xl">
                            <div className="absolute -inset-8 -z-10 rounded-[40px] bg-gradient-to-br from-teal-200/50 via-blue-100/30 to-transparent blur-2xl" />
                            <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_32px_90px_-40px_rgba(15,23,42,0.35)]">
                                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Career dashboard</p>
                                        <h2 className="mt-1 text-lg font-bold text-slate-900">求职准备度</h2>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                        <span className="size-2 rounded-full bg-emerald-500" />
                                        本周提升 8%
                                    </div>
                                </div>

                                <div className="grid gap-5 p-6 sm:grid-cols-[170px_1fr]">
                                    <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950 px-5 py-6 text-white">
                                        <div className="relative flex size-30 items-center justify-center rounded-full bg-[conic-gradient(#2dd4bf_0deg,#2dd4bf_281deg,#263244_281deg,#263244_360deg)]">
                                            <div className="flex size-24 flex-col items-center justify-center rounded-full bg-slate-950">
                                                <span className="text-4xl font-bold tracking-tight">78</span>
                                                <span className="text-xs text-slate-400">综合评分</span>
                                            </div>
                                        </div>
                                        <div className="mt-5 flex items-center gap-2 text-sm text-teal-300">
                                            <TrendingUp className="size-4" />
                                            状态良好，继续训练
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                        <div className="mb-5 flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-800">能力分布</span>
                                            <BarChart3 className="size-4 text-slate-400" />
                                        </div>
                                        <div className="space-y-5">
                                            {capabilityRows.map((item) => (
                                                <div key={item.label}>
                                                    <div className="mb-2 flex items-center justify-between text-xs">
                                                        <span className="font-medium text-slate-600">{item.label}</span>
                                                        <span className="font-bold text-slate-900">{item.value}</span>
                                                    </div>
                                                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mx-6 mb-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200">
                                    {[
                                        ["12", "完成训练"],
                                        ["36", "回答复盘"],
                                        ["5", "技能标签"],
                                    ].map(([value, label], index) => (
                                        <div key={label} className={`px-3 py-4 text-center ${index !== 2 ? "border-r border-slate-200" : ""}`}>
                                            <div className="text-xl font-bold text-slate-900">{value}</div>
                                            <div className="mt-0.5 text-xs text-slate-500">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-5 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl sm:flex">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                                    <Target className="size-5" />
                                </span>
                                <div>
                                    <p className="text-xs text-slate-400">目标岗位匹配度</p>
                                    <p className="text-sm font-bold text-slate-900">提升至 86%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features-section" className="border-y border-slate-800 bg-slate-950 px-5 py-24 text-white sm:px-8 lg:py-30">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-400">Interactive product tour</p>
                                <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                                    不只是功能列表，直接看看它如何工作
                                </h2>
                            </div>
                            <p className="max-w-md text-base leading-7 text-slate-400">
                                点击不同模块，查看职跃如何连接面试训练、简历优化与长期能力成长。
                            </p>
                        </div>

                        <div className="mt-14 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
                            <div className="grid lg:grid-cols-[360px_1fr]">
                                <div className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r lg:p-6">
                                    <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                                        {featureTours.map((item, index) => {
                                            const Icon = item.icon;
                                            const isActive = activeFeature === index;
                                            return (
                                                <button
                                                    key={item.number}
                                                    type="button"
                                                    onClick={() => setActiveFeature(index)}
                                                    aria-pressed={isActive}
                                                    className={`group min-w-[210px] rounded-2xl p-4 text-left transition-all lg:min-w-0 lg:p-5 ${
                                                        isActive
                                                            ? "bg-white text-slate-950 shadow-xl"
                                                            : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`flex size-10 items-center justify-center rounded-xl ${isActive ? "bg-teal-50 text-teal-700" : "bg-white/5 text-slate-500 group-hover:text-teal-300"}`}>
                                                            <Icon className="size-5" />
                                                        </span>
                                                        <div className="flex-1">
                                                            <span className={`text-[10px] font-bold tracking-[0.18em] ${isActive ? "text-teal-600" : "text-slate-600"}`}>
                                                                {item.number}
                                                            </span>
                                                            <p className="mt-0.5 font-bold">{item.label}</p>
                                                        </div>
                                                        <ChevronRight className={`hidden size-4 transition-transform lg:block ${isActive ? "translate-x-1 text-teal-600" : "text-slate-700"}`} />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-8 hidden border-t border-white/10 pt-7 lg:block">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>产品导览</span>
                                            <span>{feature.number} / 03</span>
                                        </div>
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            {featureTours.map((item, index) => (
                                                <button
                                                    key={item.number}
                                                    type="button"
                                                    aria-label={`查看${item.label}`}
                                                    onClick={() => setActiveFeature(index)}
                                                    className={`h-1.5 rounded-full transition-colors ${activeFeature === index ? "bg-teal-400" : "bg-white/10 hover:bg-white/25"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="min-w-0 bg-[#f8fafc] p-5 text-slate-950 sm:p-8 lg:p-10">
                                    <div key={feature.number} className="animate-in fade-in slide-in-from-right-3 duration-300">
                                        <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr] xl:items-center">
                                            <div>
                                                <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                                                    <ActiveFeatureIcon className="size-6" />
                                                </span>
                                                <h3 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">{feature.title}</h3>
                                                <p className="mt-4 text-base leading-7 text-slate-600">{feature.description}</p>
                                                <ul className="mt-6 space-y-3">
                                                    {feature.bullets.map((bullet) => (
                                                        <li key={bullet} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                                            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                                                <Check className="size-3.5" />
                                                            </span>
                                                            {bullet}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Button
                                                    onClick={() => onNavigate(feature.page)}
                                                    className="mt-8 h-11 rounded-xl bg-slate-950 px-5 text-white hover:bg-slate-800"
                                                >
                                                    {feature.action}
                                                    <ArrowRight className="size-4" />
                                                </Button>
                                            </div>

                                            <div className="min-h-[390px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)]">
                                                {activeFeature === 0 && (
                                                    <div className="flex h-full min-h-[390px] flex-col bg-slate-900 text-white">
                                                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="relative flex size-9 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
                                                                    <Mic2 className="size-4" />
                                                                    <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
                                                                </span>
                                                                <div>
                                                                    <p className="text-sm font-bold">技术一面</p>
                                                                    <p className="text-[10px] text-slate-500">AI 面试官 · 语音在线</p>
                                                                </div>
                                                            </div>
                                                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">03 / 06</span>
                                                        </div>
                                                        <div className="flex-1 space-y-5 p-5">
                                                            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/8 p-4 text-sm leading-6 text-slate-200">
                                                                如果线上服务出现突发流量，你会如何定位并解决性能瓶颈？
                                                            </div>
                                                            <div className="ml-auto max-w-[86%] rounded-2xl rounded-tr-sm bg-teal-500 p-4 text-sm leading-6 text-white">
                                                                我会先从监控指标判断瓶颈发生在应用、数据库还是下游服务……
                                                            </div>
                                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                                                <p className="text-xs font-semibold text-teal-300">智能追问</p>
                                                                <p className="mt-2 text-sm leading-6 text-slate-300">如果确认数据库连接池已经打满，你会优先采取什么措施？</p>
                                                            </div>
                                                        </div>
                                                        <div className="border-t border-white/10 p-4">
                                                            <div className="flex h-12 items-center justify-center gap-1 rounded-xl bg-white/5">
                                                                {[12, 22, 34, 18, 40, 28, 46, 32, 18, 36, 24, 14].map((height, index) => (
                                                                    <span key={`${height}-${index}`} className="w-1 rounded-full bg-teal-400" style={{ height }} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {activeFeature === 1 && (
                                                    <div className="min-h-[390px] bg-slate-100 p-4 sm:p-5">
                                                        <div className="flex items-center justify-between rounded-t-2xl border border-b-0 border-slate-200 bg-white px-4 py-3">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                                <FileText className="size-4 text-teal-600" />
                                                                项目经历 · 智能改写
                                                            </div>
                                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">匹配度 +18%</span>
                                                        </div>
                                                        <div className="grid rounded-b-2xl border border-slate-200 bg-white md:grid-cols-2">
                                                            <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">修改前</span>
                                                                <p className="mt-4 text-sm leading-7 text-slate-500 line-through decoration-red-300">
                                                                    负责公司核心系统的前端开发，完成多个功能模块，参与性能优化工作。
                                                                </p>
                                                                <div className="mt-6 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">
                                                                    缺少行动细节与量化结果，无法体现个人贡献。
                                                                </div>
                                                            </div>
                                                            <div className="p-5">
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">优化后</span>
                                                                <p className="mt-4 text-sm leading-7 text-slate-700">
                                                                    主导核心工作台前端架构升级，通过组件重构与按需加载，将首屏时间降低
                                                                    <mark className="mx-1 rounded bg-teal-100 px-1 text-teal-800">38%</mark>。
                                                                </p>
                                                                <div className="mt-6 flex flex-wrap gap-2">
                                                                    {["动作明确", "结果量化", "岗位关键词"].map((tag) => (
                                                                        <span key={tag} className="rounded-md bg-teal-50 px-2 py-1 text-[10px] font-semibold text-teal-700">{tag}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500">
                                                            <span>HR 审核官：表达可信，建议保留</span>
                                                            <ShieldCheck className="size-4 text-emerald-600" />
                                                        </div>
                                                    </div>
                                                )}

                                                {activeFeature === 2 && (
                                                    <div className="min-h-[390px] bg-white p-5 sm:p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-400">能力趋势</p>
                                                                <p className="mt-1 text-lg font-bold text-slate-900">正在稳定提升</p>
                                                            </div>
                                                            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                                                <TrendingUp className="size-3.5" /> +16%
                                                            </span>
                                                        </div>
                                                        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                                                            <svg viewBox="0 0 420 150" className="h-36 w-full" role="img" aria-label="近五次面试能力得分持续上升">
                                                                <defs>
                                                                    <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.28" />
                                                                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                                                                    </linearGradient>
                                                                </defs>
                                                                <path d="M20 126 C80 112, 95 103, 130 108 S205 82, 225 86 S300 60, 326 66 S375 35, 400 28 L400 140 L20 140 Z" fill="url(#scoreArea)" />
                                                                <path d="M20 126 C80 112, 95 103, 130 108 S205 82, 225 86 S300 60, 326 66 S375 35, 400 28" fill="none" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round" />
                                                                {["20,126", "130,108", "225,86", "326,66", "400,28"].map((point) => {
                                                                    const [cx, cy] = point.split(",");
                                                                    return <circle key={point} cx={cx} cy={cy} r="5" fill="white" stroke="#14b8a6" strokeWidth="3" />;
                                                                })}
                                                            </svg>
                                                        </div>
                                                        <div className="mt-5 grid grid-cols-2 gap-3">
                                                            {[
                                                                ["表达结构", "82", "bg-teal-500"],
                                                                ["技术深度", "76", "bg-blue-500"],
                                                                ["问题解决", "79", "bg-violet-500"],
                                                                ["团队协作", "84", "bg-amber-500"],
                                                            ].map(([label, score, color]) => (
                                                                <div key={label} className="rounded-xl border border-slate-200 p-3">
                                                                    <div className="flex items-center justify-between text-xs">
                                                                        <span className="text-slate-500">{label}</span>
                                                                        <span className="font-bold text-slate-900">{score}</span>
                                                                    </div>
                                                                    <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                                                                        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-5 py-24 sm:px-8 lg:py-30">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                            <div className="lg:sticky lg:top-28">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-600">Simple workflow</p>
                                <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">三步建立你的训练闭环</h2>
                                <p className="mt-5 max-w-md leading-7 text-slate-500">
                                    不需要学习复杂操作。提供真实材料，剩下的分析、规划和复盘交给职跃。
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => onNavigate("guide")}
                                    className="mt-7 rounded-full border-slate-300 bg-white px-5"
                                >
                                    查看完整指南
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {workflowSteps.map((step) => {
                                    const Icon = step.icon;
                                    return (
                                        <div key={step.number} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[72px_1fr_48px] sm:items-center">
                                            <span className="text-3xl font-bold tracking-tight text-slate-200">{step.number}</span>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                                                <p className="mt-1.5 text-sm leading-6 text-slate-500">{step.description}</p>
                                            </div>
                                            <span className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                                <Icon className="size-5" />
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-5 pb-24 sm:px-8 lg:pb-30">
                    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-slate-950 px-7 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.25),transparent_65%)]" />
                        <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
                            <div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-teal-300">
                                    <WandSparkles className="size-4" />
                                    从下一次面试开始改变
                                </div>
                                <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                                    让每一次练习，都成为下一次机会的准备。
                                </h2>
                                <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-2"><Zap className="size-4 text-teal-400" /> 快速开始</span>
                                    <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-teal-400" /> 数据本地隔离</span>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                onClick={() => onNavigate("interview")}
                                className="h-13 shrink-0 rounded-xl bg-teal-400 px-7 text-base font-bold text-slate-950 hover:bg-teal-300"
                            >
                                创建第一次模拟面试
                                <ArrowRight className="size-5" />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="职跃 CareerLeap" width={28} height={28} />
                        <span className="font-semibold text-slate-600">职跃 CareerLeap</span>
                    </div>
                    <p>看见优势，练好表达，拿下机会。</p>
                </div>
            </footer>
        </div>
    );
}
