function parseReview(review) {

    const sections = {};

    let current = "Introduction";

    sections[current] = [];

    const lines = review.split("\n");
    let inCodeBlock = false;

    for (const line of lines) {
        if (line.trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            sections[current].push(line);
        } else if (!inCodeBlock && /^#{1,6}\s+/.test(line)) {

            current = line.replace(/^#{1,6}\s+/, "").trim();

            sections[current] = [];

        } else {

            sections[current].push(line);

        }

    }

    return sections;

}

module.exports = {
    parseReview
};