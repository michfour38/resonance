export function isRepeatedQuestion(params: {
  nextQuestion: string
  previousQuestions: string[]
}) {
  return params.previousQuestions.some(
    (question) =>
      question.trim().toLowerCase() ===
      params.nextQuestion.trim().toLowerCase(),
  )
}