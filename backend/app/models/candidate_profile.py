"""
候选人能力画像数据模型
用于后台异步分析服务
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional


class EvidenceItem(BaseModel):
    """评分证据，引用候选人的原回答片段。"""
    dimension: str = Field(description="对应能力维度")
    question: str = Field(default="", description="证据对应的问题")
    answer_quote: str = Field(default="", description="候选人原回答中的短引用")
    rationale: str = Field(description="该证据如何支持评分")
    improvement: str = Field(default="", description="基于证据的改进建议")


class ExpressionAnalysis(BaseModel):
    """表达与结构分析；没有音频时不伪造语速和停顿数据。"""
    average_answer_length: int = Field(default=0, ge=0, description="平均回答字符数")
    filler_words: List[str] = Field(default_factory=list, description="检测到的口头禅")
    filler_count: int = Field(default=0, ge=0, description="口头禅出现次数")
    structure_score: float = Field(default=0, ge=0, le=10, description="回答结构评分")
    star_completeness: float = Field(default=0, ge=0, le=1, description="STAR 完整度")
    conclusion_first_rate: float = Field(default=0, ge=0, le=1, description="结论前置比例")
    average_answer_duration_seconds: Optional[float] = Field(default=None, ge=0, description="平均回答时长，需要可靠音频时长数据")
    pace_wpm: Optional[float] = Field(default=None, ge=0, description="每分钟词数，需要可靠时长数据")
    pause_count: Optional[int] = Field(default=None, ge=0, description="停顿次数，需要音频分析")
    timing_note: str = Field(default="当前会话缺少可靠音频时长，未评估语速与停顿。")


class DrillAttempt(BaseModel):
    """一次专项训练结果。"""
    answer: str
    score: float = Field(ge=0, le=10)
    passed: bool = False
    strengths: List[str] = Field(default_factory=list)
    gaps: List[str] = Field(default_factory=list)
    evidence: str = ""
    improved_answer: str = ""
    created_at: str


class TrainingFocus(BaseModel):
    """从面试短板生成的专项训练任务。"""
    id: str
    title: str
    dimension: str
    priority: int = Field(default=1, ge=1, le=3)
    evidence_quote: str = ""
    rationale: str
    action: str
    drill_question: str
    success_criteria: List[str] = Field(default_factory=list)
    suggested_minutes: int = Field(default=5, ge=1, le=15)
    baseline_score: float = Field(default=5, ge=0, le=10)
    attempts: List[DrillAttempt] = Field(default_factory=list)


class DimensionScore(BaseModel):
    """单个维度的评分"""
    score: float = Field(ge=0, le=10, description="评分 (0-10)")
    evidence: str = Field(description="支撑该评分的证据")
    trend: Optional[str] = Field(default=None, description="变化趋势: improving/stable/declining")


class CandidateProfile(BaseModel):
    """候选人综合能力画像"""
    
    # 核心维度评分 (6维)
    professional_competence: DimensionScore = Field(description="专业能力")
    execution_results: DimensionScore = Field(description="执行与结果导向")
    logic_problem_solving: DimensionScore = Field(description="逻辑与问题解决")
    communication: DimensionScore = Field(description="沟通表达力")
    growth_potential: DimensionScore = Field(description="成长潜力")
    collaboration: DimensionScore = Field(description="协作能力")
    
    # 技能标签
    skill_tags: List[str] = Field(default_factory=list, description="技能标签列表")
    
    # 元信息
    total_questions_analyzed: int = Field(default=0, description="已分析的问题数")
    last_updated: str = Field(description="最后更新时间")
    
    # 综合评价
    overall_assessment: Optional[str] = Field(default=None, description="整体评价摘要")
    key_strengths: List[str] = Field(default_factory=list, description="主要优势")
    key_weaknesses: List[str] = Field(default_factory=list, description="主要不足")

    # 证据化反馈与训练闭环
    evidence_items: List[EvidenceItem] = Field(default_factory=list, description="引用原回答的评分证据")
    expression_analysis: Optional[ExpressionAnalysis] = Field(default=None, description="表达与结构分析")
    training_focuses: List[TrainingFocus] = Field(default_factory=list, description="可一键开始的专项训练")
    
    # 推荐结果
    recommendation: Optional[str] = Field(default=None, description="录用建议: hire/maybe/no_hire")
    confidence: Optional[float] = Field(default=None, ge=0, le=1, description="推荐置信度")


class AnalysisContext(BaseModel):
    """分析上下文"""
    resume: str
    job_description: str
    company_info: str
    qa_history: List[Dict[str, str]]  # [{"question": "...", "answer": "..."}]
    previous_profile: Optional[CandidateProfile] = None
