class ScoringService {
  calculateScores(parsedData, coverage, ruleFindings, questionnaire) {
    const dataScore = this.calculateDataScore(parsedData);
    const coverageScore = this.calculateCoverageScore(coverage);
    const rulesScore = this.calculateRulesScore(ruleFindings);
    const postureScore = this.calculatePostureScore(questionnaire);

    // Weights: Data(25%) + Coverage(35%) + Rules(30%) + Posture(10%)
    const overall = Math.round(
      dataScore * 0.25 +
      coverageScore * 0.35 +
      rulesScore * 0.30 +
      postureScore * 0.10
    );

    return {
      data: dataScore,
      coverage: coverageScore,
      rules: rulesScore,
      posture: postureScore,
      overall
    };
  }

  calculateDataScore(parsedData) {
    if (!parsedData || parsedData.length === 0) {
      return 0;
    }

    let totalFields = 0;
    let parsedFields = 0;

    parsedData.forEach(row => {
      const fields = Object.values(row);
      totalFields += fields.length;
      parsedFields += fields.filter(v => 
        v !== null && v !== undefined && v !== ''
      ).length;
    });

    return Math.round((parsedFields / totalFields) * 100);
  }

  calculateCoverageScore(coverage) {
    const totalRequired = 19; // Total GETS schema fields
    const matchedWeight = 1.0;
    const closeWeight = 0.5;

    const matchedCount = coverage.matched.length;
    const closeCount = coverage.close.length;

    const score = ((matchedCount * matchedWeight) + (closeCount * closeWeight)) / totalRequired;
    return Math.round(Math.min(score * 100, 100));
  }

  calculateRulesScore(ruleFindings) {
    const passedRules = ruleFindings.filter(r => r.ok).length;
    const totalRules = ruleFindings.length;

    return Math.round((passedRules / totalRules) * 100);
  }

  calculatePostureScore(questionnaire) {
    if (!questionnaire) {
      return 0;
    }

    const { webhooks, sandbox_env, retries } = questionnaire;
    const totalQuestions = 3;
    const trueCount = [webhooks, sandbox_env, retries].filter(Boolean).length;

    return Math.round((trueCount / totalQuestions) * 100);
  }

  getReadinessLabel(overallScore) {
    if (overallScore >= 75) return 'High';
    if (overallScore >= 50) return 'Medium';
    return 'Low';
  }
}

module.exports = new ScoringService();
