"""面试报告专项重练服务。"""

import json
import re
from datetime import datetime
from typing import Any, Dict

from app.core.llms import get_llm_for_request
from app.models.candidate_profile import DrillAttempt
from app.services.analysis_service import get_analysis_service


class DrillService:
    def __init__(self) -> None:
        self.analysis_service = get_analysis_service()

    async def get_focus(self, session_id: str, focus_id: str) -> Dict[str, Any]:
        profile = await self.analysis_service.get_cached_profile(session_id)
        if not profile:
            raise ValueError("本轮面试报告尚未生成")
        focus = next((item for item in profile.training_focuses if item.id == focus_id), None)
        if not focus:
            raise ValueError("专项训练不存在或报告已更新")
        return {"focus": focus.model_dump(), "attempt_count": len(focus.attempts)}

    async def evaluate(
        self,
        session_id: str,
        focus_id: str,
        answer: str,
        api_config: Dict[str, Any],
    ) -> Dict[str, Any]:
        profile = await self.analysis_service.get_cached_profile(session_id)
        if not profile:
            raise ValueError("本轮面试报告尚未生成")
        focus = next((item for item in profile.training_focuses if item.id == focus_id), None)
        if not focus:
            raise ValueError("专项训练不存在或报告已更新")

        prompt = f"""你是严格、具体的面试训练教练。请评价候选人的专项重练回答。

训练主题：{focus.title}
训练题：{focus.drill_question}
原回答证据：{focus.evidence_quote or '无可引用原文'}
原始基线分：{focus.baseline_score}/10
改进动作：{focus.action}
验收标准：{json.dumps(focus.success_criteria, ensure_ascii=False)}

本次回答：
{answer}

只返回 JSON：
{{
  "score": 7.5,
  "passed": true,
  "strengths": ["做得好的具体点"],
  "gaps": ["仍需补足的具体点"],
  "evidence": "引用本次回答中的一句连续原文作为判断依据",
  "improved_answer": "保留候选人事实、不虚构数据的精炼示范答案"
}}
score 为 0-10；达到全部关键验收标准时 passed 才为 true。"""

        llm = get_llm_for_request(api_config, channel="smart")
        response = await llm.ainvoke(prompt)
        raw = response.content if isinstance(response.content, str) else str(response.content)
        fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw, re.DOTALL)
        result = json.loads(fenced.group(1) if fenced else raw.strip())

        quoted = str(result.get("evidence", "")).strip()
        if quoted and quoted not in answer:
            result["evidence"] = ""
        result["score"] = min(10, max(0, float(result.get("score", 0))))

        attempt = DrillAttempt(
            answer=answer,
            score=result["score"],
            passed=bool(result.get("passed", False)),
            strengths=result.get("strengths") or [],
            gaps=result.get("gaps") or [],
            evidence=result.get("evidence") or "",
            improved_answer=result.get("improved_answer") or "",
            created_at=datetime.now().isoformat(),
        )
        focus.attempts.append(attempt)
        profile.last_updated = datetime.now().isoformat()
        await self.analysis_service.session_service.save_profile(session_id, profile.model_dump())

        previous_score = focus.attempts[-2].score if len(focus.attempts) > 1 else focus.baseline_score
        return {
            "focus": focus.model_dump(),
            "attempt": attempt.model_dump(),
            "comparison": {
                "baseline_score": focus.baseline_score,
                "previous_score": previous_score,
                "current_score": attempt.score,
                "delta": round(attempt.score - previous_score, 1),
                "total_delta": round(attempt.score - focus.baseline_score, 1),
            },
        }


_drill_service: DrillService | None = None


def get_drill_service() -> DrillService:
    global _drill_service
    if _drill_service is None:
        _drill_service = DrillService()
    return _drill_service
