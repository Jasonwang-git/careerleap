'use client';

import { useEffect, useState } from 'react';
import {
    Activity, ArrowRight, Brain, CheckCircle2, Clock3, Loader2,
    MessageSquareQuote, RefreshCw, Sparkles, Target, TrendingUp,
} from 'lucide-react';
import {
    evaluateDrill, getSessionProfile, type AbilityProfile,
    type DrillEvaluationResponse, type TrainingFocus,
} from '@/lib/api/profile';
import { useInterviewStore } from '@/store/useInterviewStore';
import { AbilityRadarChart } from './RadarChart';
import { SkillTags } from './SkillTags';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Props {
    sessionId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const dimensionNames: Record<string, string> = {
    professional_competence: '专业能力', execution_results: '执行与结果',
    logic_problem_solving: '逻辑与解题', communication: '沟通表达',
    growth_potential: '成长潜力', collaboration: '协作能力',
};

function percent(value: number) {
    return `${Math.round(value * 100)}%`;
}

export function SessionProfileDialog({ sessionId, open, onOpenChange }: Props) {
    const [profile, setProfile] = useState<AbilityProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [activeFocus, setActiveFocus] = useState<TrainingFocus | null>(null);
    const [answer, setAnswer] = useState('');
    const [evaluating, setEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<DrillEvaluationResponse | null>(null);
    const [drillError, setDrillError] = useState('');

    useEffect(() => {
        if (open && sessionId) void loadProfile();
    }, [open, sessionId]);

    async function loadProfile() {
        setLoading(true);
        const response = await getSessionProfile(sessionId);
        if (response.success && response.profile) {
            setProfile(response.profile);
            setGenerating(false);
        } else {
            setProfile(null);
            setGenerating(true);
        }
        setLoading(false);
    }

    function beginDrill(focus: TrainingFocus) {
        setActiveFocus(focus);
        setAnswer('');
        setEvaluation(null);
        setDrillError('');
        requestAnimationFrame(() => document.getElementById('drill-workspace')?.scrollIntoView({ behavior: 'smooth' }));
    }

    async function submitDrill() {
        if (!activeFocus || answer.trim().length < 10) {
            setDrillError('请至少输入 10 个字，再提交训练。');
            return;
        }
        const apiConfig = useInterviewStore.getState().getApiConfigForRequest();
        if (!apiConfig) {
            setDrillError('请先在设置中完成 Smart / Fast 模型配置。');
            return;
        }
        setEvaluating(true);
        setDrillError('');
        const result = await evaluateDrill(sessionId, activeFocus.id, answer.trim(), apiConfig);
        setEvaluating(false);
        if (!result.success || !result.focus) {
            setDrillError(result.message || '评分失败，请稍后重试。');
            return;
        }
        setEvaluation(result);
        setActiveFocus(result.focus);
        setProfile(current => current ? {
            ...current,
            training_focuses: current.training_focuses?.map(item => item.id === result.focus?.id ? result.focus : item),
        } : current);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto bg-[#f7f9f7] p-0">
                <DialogHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-7 py-5 backdrop-blur">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Brain className="h-5 w-5 text-teal-600" /> 面试复盘与提升闭环
                    </DialogTitle>
                    <p className="text-sm text-slate-500">看见证据，定位短板，立即重练，再用结果验证进步。</p>
                </DialogHeader>

                {loading && <div className="flex flex-col items-center py-24"><Loader2 className="mb-4 h-8 w-8 animate-spin text-teal-600" /><p className="text-sm text-slate-500">正在加载报告...</p></div>}

                {!loading && generating && (
                    <div className="flex flex-col items-center px-6 py-24">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>
                        <h3 className="mb-2 text-lg font-semibold">复盘报告生成中</h3>
                        <p className="mb-6 text-sm text-slate-500">AI 正在关联回答证据并生成专项训练。</p>
                        <Button onClick={loadProfile} variant="outline"><RefreshCw className="mr-2 h-4 w-4" />刷新</Button>
                    </div>
                )}

                {!loading && profile && (
                    <div className="space-y-7 p-7">
                        <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                <h3 className="mb-3 font-semibold">能力全景</h3>
                                <AbilityRadarChart data={profile} />
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-2xl bg-slate-900 p-6 text-white">
                                    <div className="mb-3 flex items-center gap-2 text-sm text-teal-300"><Sparkles className="h-4 w-4" />AI 复盘摘要</div>
                                    <p className="text-sm leading-7 text-slate-200">{profile.overall_assessment || '本轮面试已完成，建议从最高优先级训练开始。'}</p>
                                </div>
                                {profile.skill_tags?.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-5"><SkillTags tags={profile.skill_tags} /></div>}
                            </div>
                        </section>

                        {profile.expression_analysis && (
                            <section>
                                <div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-medium tracking-widest text-teal-700">表达诊断</p><h3 className="text-lg font-semibold">不只看内容，也看你怎么说</h3></div><Activity className="h-5 w-5 text-teal-600" /></div>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {[
                                        ['结构清晰度', `${profile.expression_analysis.structure_score.toFixed(1)}/10`],
                                        ['STAR 完整度', percent(profile.expression_analysis.star_completeness)],
                                        ['结论前置', percent(profile.expression_analysis.conclusion_first_rate)],
                                        ['口头禅', `${profile.expression_analysis.filler_count} 次`],
                                        ['平均回答', `${profile.expression_analysis.average_answer_length} 字`],
                                        ['回答时长', profile.expression_analysis.average_answer_duration_seconds == null ? '待语音' : `${Math.round(profile.expression_analysis.average_answer_duration_seconds)} 秒`],
                                        ['表达语速', profile.expression_analysis.pace_wpm == null ? '待语音' : `${Math.round(profile.expression_analysis.pace_wpm)} 词/分`],
                                        ['停顿次数', profile.expression_analysis.pause_count == null ? '待语音' : `${profile.expression_analysis.pause_count} 次`],
                                    ].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p></div>)}
                                </div>
                                {!!profile.expression_analysis.filler_words.length && <p className="mt-2 text-xs text-slate-500">高频口头禅：{profile.expression_analysis.filler_words.join('、')}</p>}
                                <p className="mt-2 text-xs text-slate-500">{profile.expression_analysis.timing_note}</p>
                            </section>
                        )}

                        {!!profile.evidence_items?.length && (
                            <section>
                                <div className="mb-3"><p className="text-xs font-medium tracking-widest text-teal-700">证据化评分</p><h3 className="text-lg font-semibold">每个判断，都能回到原回答</h3></div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {profile.evidence_items.map((item, index) => (
                                        <article key={`${item.dimension}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5">
                                            <div className="mb-3 flex items-center justify-between"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">{dimensionNames[item.dimension] || item.dimension}</span><MessageSquareQuote className="h-4 w-4 text-slate-400" /></div>
                                            <blockquote className="border-l-2 border-teal-500 pl-3 text-sm leading-6 text-slate-700">“{item.answer_quote}”</blockquote>
                                            <p className="mt-3 text-sm text-slate-600">{item.rationale}</p>
                                            {item.improvement && <p className="mt-2 text-sm font-medium text-teal-700">下一步：{item.improvement}</p>}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {!!profile.training_focuses?.length && (
                            <section>
                                <div className="mb-3"><p className="text-xs font-medium tracking-widest text-teal-700">专项重练</p><h3 className="text-lg font-semibold">从短板直接进入 5 分钟训练</h3></div>
                                <div className="space-y-3">
                                    {profile.training_focuses.map(focus => {
                                        const latest = focus.attempts?.at(-1);
                                        return <article key={focus.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[1fr_auto] md:items-center">
                                            <div><div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">优先级 P{focus.priority}</span><span className="flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />{focus.suggested_minutes} 分钟</span>{latest && <span className="text-xs font-medium text-teal-700">最近 {latest.score.toFixed(1)} 分</span>}</div><h4 className="font-semibold">{focus.title}</h4><p className="mt-1 text-sm text-slate-600">{focus.rationale}</p><p className="mt-2 text-sm font-medium text-slate-800">训练动作：{focus.action}</p></div>
                                            <Button onClick={() => beginDrill(focus)} className="bg-slate-900 hover:bg-slate-800">{latest ? '再次挑战' : '开始重练'}<ArrowRight className="ml-2 h-4 w-4" /></Button>
                                        </article>;
                                    })}
                                </div>
                            </section>
                        )}

                        {activeFocus && (
                            <section id="drill-workspace" className="rounded-3xl bg-[#e8f5ef] p-6 ring-1 ring-teal-200">
                                <div className="mb-4 flex items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs font-medium text-teal-700"><Target className="h-4 w-4" />正在训练 · {activeFocus.suggested_minutes} 分钟</div><h3 className="text-xl font-semibold">{activeFocus.title}</h3></div><div className="rounded-xl bg-white px-3 py-2 text-center shadow-sm"><p className="text-[10px] text-slate-500">基线</p><p className="font-semibold">{activeFocus.baseline_score.toFixed(1)}</p></div></div>
                                <div className="mb-4 rounded-2xl bg-white p-5"><p className="mb-1 text-xs text-slate-500">训练题</p><p className="font-medium leading-7">{activeFocus.drill_question}</p><div className="mt-3 flex flex-wrap gap-2">{activeFocus.success_criteria.map(item => <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{item}</span>)}</div></div>
                                <Textarea value={answer} onChange={event => setAnswer(event.target.value)} placeholder="像真实面试一样完整作答。建议先给结论，再展开关键事实与结果…" className="min-h-40 resize-y bg-white" />
                                <div className="mt-3 flex items-center justify-between gap-4"><p className="text-xs text-slate-500">{answer.trim().length} 字 · 提交后会与基线表现对比</p><Button onClick={submitDrill} disabled={evaluating} className="bg-teal-700 hover:bg-teal-800">{evaluating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}提交并对比</Button></div>
                                {drillError && <p className="mt-3 text-sm text-red-600">{drillError}</p>}

                                {evaluation?.attempt && evaluation.comparison && (
                                    <div className="mt-5 rounded-2xl bg-white p-5">
                                        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 font-semibold"><CheckCircle2 className={`h-5 w-5 ${evaluation.attempt.passed ? 'text-teal-600' : 'text-amber-500'}`} />{evaluation.attempt.passed ? '本次达标' : '继续打磨'}</div><div className="text-right"><span className="text-2xl font-bold">{evaluation.comparison.current_score.toFixed(1)}</span><span className="text-sm text-slate-400"> / 10</span><p className={`text-xs font-medium ${evaluation.comparison.delta >= 0 ? 'text-teal-700' : 'text-red-600'}`}>较上次 {evaluation.comparison.delta >= 0 ? '+' : ''}{evaluation.comparison.delta.toFixed(1)}</p></div></div>
                                        <div className="grid gap-4 md:grid-cols-2"><div><p className="mb-2 text-xs font-medium text-teal-700">做得更好的地方</p><ul className="space-y-1 text-sm text-slate-700">{evaluation.attempt.strengths.map(item => <li key={item}>✓ {item}</li>)}</ul></div><div><p className="mb-2 text-xs font-medium text-amber-700">下一轮关注</p><ul className="space-y-1 text-sm text-slate-700">{evaluation.attempt.gaps.map(item => <li key={item}>△ {item}</li>)}</ul></div></div>
                                        {evaluation.attempt.improved_answer && <details className="mt-4 rounded-xl bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-medium">查看精炼示范答案</summary><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{evaluation.attempt.improved_answer}</p></details>}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
