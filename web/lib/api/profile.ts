/**
 * 能力画像 API 接口
 */

import { API_BASE_URL, getUserId } from './config';

// 维度评分接口
export interface DimensionScore {
    score: number;
    evidence: string;
    trend?: string;
}

export interface EvidenceItem {
    dimension: string;
    question: string;
    answer_quote: string;
    rationale: string;
    improvement: string;
}

export interface ExpressionAnalysis {
    average_answer_length: number;
    filler_words: string[];
    filler_count: number;
    structure_score: number;
    star_completeness: number;
    conclusion_first_rate: number;
    average_answer_duration_seconds?: number | null;
    pace_wpm?: number | null;
    pause_count?: number | null;
    timing_note: string;
}

export interface DrillAttempt {
    answer: string;
    score: number;
    passed: boolean;
    strengths: string[];
    gaps: string[];
    evidence: string;
    improved_answer: string;
    created_at: string;
}

export interface TrainingFocus {
    id: string;
    title: string;
    dimension: string;
    priority: number;
    evidence_quote: string;
    rationale: string;
    action: string;
    drill_question: string;
    success_criteria: string[];
    suggested_minutes: number;
    baseline_score: number;
    attempts: DrillAttempt[];
}

// 能力画像接口
export interface AbilityProfile {
    professional_competence: DimensionScore;
    execution_results: DimensionScore;
    logic_problem_solving: DimensionScore;
    communication: DimensionScore;
    growth_potential: DimensionScore;
    collaboration: DimensionScore;
    skill_tags: string[];
    overall_assessment?: string;
    key_strengths?: string[];
    key_weaknesses?: string[];
    recommendation?: string;
    confidence?: number;
    last_updated: string;
    evidence_items?: EvidenceItem[];
    expression_analysis?: ExpressionAnalysis;
    training_focuses?: TrainingFocus[];
}

// API 响应接口
export interface ProfileResponse {
    success: boolean;
    profile?: AbilityProfile;
    generated_at?: string;
    message?: string;
}

/**
 * 获取综合能力画像（从数据库读取）
 */
export async function getOverallProfile(): Promise<ProfileResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/profile/overall`, {
            headers: { 'X-User-ID': getUserId() }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取能力画像失败:', error);
        return {
            success: false,
            message: '网络错误，请稍后重试'
        };
    }
}

/**
 * 生成综合能力画像（手动触发）
 */
export async function generateProfile(apiConfig?: any): Promise<ProfileResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/profile/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': getUserId()
            },
            body: apiConfig ? JSON.stringify({
                user_id: getUserId(),
                api_config: apiConfig
            }) : undefined
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('生成能力画像失败:', error);
        return {
            success: false,
            message: '网络错误，请稍后重试'
        };
    }
}

/**
 * 获取单个会话的能力画像
 */
export async function getSessionProfile(sessionId: string): Promise<ProfileResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/profile/session/${sessionId}`, {
            headers: { 'X-User-ID': getUserId() }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取会话画像失败:', error);
        return {
            success: false,
            message: '网络错误，请稍后重试'
        };
    }
}

export interface DrillEvaluationResponse {
    success: boolean;
    focus?: TrainingFocus;
    attempt?: DrillAttempt;
    comparison?: {
        baseline_score: number;
        previous_score: number;
        current_score: number;
        delta: number;
        total_delta: number;
    };
    message?: string;
}

export async function evaluateDrill(
    sessionId: string,
    focusId: string,
    answer: string,
    apiConfig: unknown,
): Promise<DrillEvaluationResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/profile/session/${sessionId}/drill/evaluate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': getUserId(),
            },
            body: JSON.stringify({ focus_id: focusId, answer, api_config: apiConfig }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(typeof data.detail === 'string' ? data.detail : '训练评分失败');
        }
        return data;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '网络错误，请稍后重试',
        };
    }
}
