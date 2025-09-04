export const calculateElbowHeight = (heightCm) => {
  return Math.round(heightCm * 0.62);
};

export const analyzeDeskSetup = async (formData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const elbowHeight = calculateElbowHeight(formData.heightCm);
  let score = 0;
  const details = [];

  if (formData.screenDistanceCm >= 50 && formData.screenDistanceCm <= 75) {
    score += 10;
    details.push({
      ok: true,
      category: "display",
      text: "Screen distance looks comfortable (50–75 cm).",
      priority: "good"
    });
  } else {
    details.push({
      ok: false,
      category: "display",
      text: "Adjust screen to ~50–75 cm to reduce strain.",
      priority: formData.screenDistanceCm < 40 || formData.screenDistanceCm > 90 ? "high" : "medium"
    });
  }

  if (formData.monitorTopAtEye === "yes") {
    score += 10;
    details.push({
      ok: true,
      category: "display",
      text: "Top of monitor around eye level.",
      priority: "good"
    });
  } else {
    details.push({
      ok: false,
      category: "display",
      text: "Raise/lower monitor so the top is near eye level.",
      priority: "high"
    });
  }

  if (formData.keyboardAtElbow === "yes") {
    score += 10;
    details.push({
      ok: true,
      category: "posture",
      text: "Keyboard at elbow height (~90° elbows).",
      priority: "good"
    });
  } else {
    details.push({
      ok: false,
      category: "posture",
      text: `Keyboard should be near elbow height (~${elbowHeight} cm for you).`,
      priority: "high"
    });
  }

  if (formData.feetSupported === "yes") {
    score += 10;
    details.push({
      ok: true,
      category: "posture",
      text: "Feet supported (flat or footrest).",
      priority: "good"
    });
  } else {
    details.push({
      ok: false,
      category: "posture",
      text: "Use a footrest or adjust seat so feet are supported.",
      priority: "medium"
    });
  }

  if (formData.chairLumbar === "yes") {
    score += 10;
    details.push({
      ok: true,
      category: "posture",
      text: "Lower back supported.",
      priority: "good"
    });
  } else {
    details.push({
      ok: false,
      category: "posture",
      text: "Add a small lumbar cushion or adjust chair backrest.",
      priority: "high"
    });
  }

  if (formData.glare === "no") {
    score += 5;
    details.push({
      ok: true,
      category: "environment",
      text: "Glare looks under control.",
      priority: "good"
    });
  } else {
    details.push({
      ok: false,
      category: "environment",
      text: "Reduce glare with blinds or reposition screen.",
      priority: "medium"
    });
  }

  if (formData.breakEveryMins <= 30 && formData.breakEveryMins >= 20) {
    score += 10;
    details.push({
      ok: true,
      category: "habits",
      text: "Regular micro-breaks are on point.",
      priority: "good"
    });
  } else {
    details.push({
      ok: false,
      category: "habits",
      text: "Try breaks every 20–30 minutes.",
      priority: formData.breakEveryMins > 60 ? "high" : "medium"
    });
  }

  const maxScore = 65;
  const percentage = Math.round((score / maxScore) * 100);

  let verdict = "Great";
  let verdictColor = "green";
  if (percentage < 70) {
    verdict = "Needs Tuning";
    verdictColor = "yellow";
  }
  if (percentage < 45) {
    verdict = "Adjust ASAP";
    verdictColor = "red";
  }

  const prioritizedDetails = {
    high: details.filter(d => d.priority === "high"),
    medium: details.filter(d => d.priority === "medium"),
    good: details.filter(d => d.priority === "good"),
  };

  return {
    score: percentage,
    verdict,
    verdictColor,
    details,
    prioritizedDetails,
    elbowHeight,
    rawScore: score,
    maxScore,
    categories: {
      display: details.filter(d => d.category === "display"),
      posture: details.filter(d => d.category === "posture"),
      environment: details.filter(d => d.category === "environment"),
      habits: details.filter(d => d.category === "habits"),
    }
  };
};

export const getPersonalizedRecommendations = (analysisResult, userProfile = {}) => {
  const recommendations = [];
  
  if (analysisResult.prioritizedDetails.high.length > 0) {
    recommendations.push({
      type: "urgent",
      title: "Immediate Action Required",
      items: analysisResult.prioritizedDetails.high.map(item => item.text)
    });
  }

  if (analysisResult.prioritizedDetails.medium.length > 0) {
    recommendations.push({
      type: "improvement",
      title: "Recommended Improvements",
      items: analysisResult.prioritizedDetails.medium.map(item => item.text)
    });
  }

  if (analysisResult.prioritizedDetails.good.length > 0) {
    recommendations.push({
      type: "positive",
      title: "Great Work! Keep it up:",
      items: analysisResult.prioritizedDetails.good.map(item => item.text)
    });
  }

  return recommendations;
};

export const generateSummaryReport = (analysisResult) => {
  const issues = analysisResult.details.filter(d => !d.ok).length;
  const strengths = analysisResult.details.filter(d => d.ok).length;
  
  return {
    overallScore: analysisResult.score,
    verdict: analysisResult.verdict,
    totalIssues: issues,
    totalStrengths: strengths,
    criticalIssues: analysisResult.prioritizedDetails.high.length,
    recommendations: getPersonalizedRecommendations(analysisResult),
    timestamp: new Date().toISOString()
  };
};
