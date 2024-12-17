const formatQuestionMiddleware = (request, response, next) => {
  const {
    questionFormat,
    answerA,
    answerB,
    answerC,
    answerD,
    rangeDescription,
  } = request.body;

  try {
    const formatDetails = {};

    // Add multi-choice Details to formatDetails if the format is multiChoice
    if (questionFormat === "multiChoice") {
      if (!answerA || !answerB || !answerC || !answerD) {
        return response.status(404).json({
          success: false,
          message:
            "Missing required field for MiltiChoice: answerA, answerB, answerC, answerD",
        });
      }

      // Add Details to formatDetails
      formatDetails.answerA = answerA;
      formatDetails.answerB = answerB;
      formatDetails.answerC = answerC;
      formatDetails.answerD = answerD;
    }

    if (questionFormat === "rangeSlider") {
      if (!rangeDescription) {
        return response.status(404).json({
          success: false,
          message: "Missing required field rangeSlider: rangeDescription",
        });
      }
      // Add rangeDescriptions to formatDetails
      formatDetails.rangeDescription = rangeDescription;
    }

    // Add formatDetails to request body
    request.body.formatDetails = formatDetails;

    // Proceed to next file in route
    next();
  } catch (error) {
    console.error("Error validating question format details: ", error);
    return response.status(500).json({
      success: true,
      message:
        "Internal server error while processing question format details.",
    });
  }
};

module.exports = { formatQuestionMiddleware };
