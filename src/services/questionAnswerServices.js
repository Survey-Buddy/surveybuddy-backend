exports.validateQAndAs = async (request, response, next) => {
  const { questionFormat, answer } = request.body;

  // Validate required fields
  if (!questionFormat || !answer) {
    return response.status(400).json({
      success: false,
      message: "Missing required fields: questionFormat or answer.",
    });
  }

  // Define valid types of Questions and Answers
  const validQuestions = ["multiChoice", "range", "writtenResponse"];
  const validChoices = ["a", "b", "c", "d"];
  const validRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Validate question type
  if (!validQuestions.includes(questionFormat)) {
    return response.status(400).json({
      success: false,
      message:
        "Invalid question format. Must be one of: multiChoice, range, writtenResponse.",
    });
  }

  // Convert answer to lowercase if string
  let normalisedAnswer =
    typeof answer === "string" ? answer.toLowerCase() : answer;

  // Perform validation based on question type
  if (
    questionFormat === "multiChoice" &&
    !validChoices.includes(normalisedAnswer)
  ) {
    return response.status(400).json({
      success: false,
      message: "Multi-choice answers must be one of: A, B, C, or D.",
    });
  }
  if (questionFormat === "range" && !validRange.includes(normalisedAnswer)) {
    return response.status(400).json({
      success: false,
      message: "Range answers must be between 1 and 10.",
    });
  }
  if (
    questionFormat === "writtenResponse" &&
    typeof normalisedAnswer !== "string"
  ) {
    return response.status(400).json({
      success: false,
      message: "Written response answers must be a string.",
    });
  }

  console.log("Q & A validated!");
  // If questionFormat and answer passes validation move to next middleware or route
  next();
};
