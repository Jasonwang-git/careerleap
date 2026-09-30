from app.core.interview_planner import build_planner_prompt
from app.models.candidate_profile import CandidateProfile
from app.services.analysis_service import CandidateAnalysisService


def _base_profile_data():
    score = {"score": 6, "evidence": "有基础表现"}
    return {
        "professional_competence": score,
        "execution_results": score,
        "logic_problem_solving": score,
        "communication": score,
        "growth_potential": score,
        "collaboration": score,
        "last_updated": "2026-01-01T00:00:00",
    }


def test_old_profile_remains_compatible():
    profile = CandidateProfile(**_base_profile_data())
    assert profile.evidence_items == []
    assert profile.training_focuses == []
    assert profile.expression_analysis is None


def test_closed_loop_data_filters_fake_quotes_and_computes_text_metrics():
    service = CandidateAnalysisService()
    data = _base_profile_data() | {
        "evidence_items": [
            {
                "dimension": "communication",
                "question": "如何复盘？",
                "answer_quote": "我先看留存下降的环节",
                "rationale": "先定位问题",
                "improvement": "补充结果数据",
            },
            {
                "dimension": "communication",
                "question": "如何复盘？",
                "answer_quote": "并不存在的回答",
                "rationale": "无效",
                "improvement": "",
            },
        ],
        "expression_analysis": {
            "structure_score": 7,
            "star_completeness": 0.5,
            "conclusion_first_rate": 0.5,
            "pace_wpm": 999,
            "pause_count": 99,
        },
        "training_focuses": [],
    }
    normalized = service._normalize_closed_loop_data(
        data,
        [{"question": "如何复盘？", "answer": "嗯，我先看留存下降的环节，然后定位原因。"}],
    )

    assert len(normalized["evidence_items"]) == 1
    assert normalized["expression_analysis"]["filler_count"] == 2
    assert normalized["expression_analysis"]["pace_wpm"] is None
    assert normalized["expression_analysis"]["pause_count"] is None


def test_product_manager_track_is_explicit_in_planner_prompt():
    prompt = build_planner_prompt(
        resume="产品实习经历",
        job_description="产品经理",
        company_info="SaaS 公司",
        max_questions=5,
        interview_track="product_manager",
    )
    for topic in ["产品设计", "指标分析", "策略题", "项目复盘", "行为面试"]:
        assert topic in prompt
