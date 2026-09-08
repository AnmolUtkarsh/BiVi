/*
===========================================================
    RECENT PERFORMANCE ANALYZER
===========================================================
*/


function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}


function average(values) {

    if (!values.length) {
        return 0;
    }

    let sum = 0;

    for (const value of values) {
        sum += value;
    }

    return sum / values.length;
}


function linearTrend(values) {

    const n = values.length;

    if (n < 2) {
        return 0;
    }


    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;


    for (let i = 0; i < n; i++) {

        const x = i;
        const y = values[i];

        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }


    const denominator =
        n * sumXX -
        sumX * sumX;


    if (denominator === 0) {
        return 0;
    }


    return (
        n * sumXY -
        sumX * sumY
    ) / denominator;
}


function weightedRecentAverage(
    values
) {

    if (!values.length) {
        return null;
    }


    let numerator = 0;
    let denominator = 0;


    for (
        let i = 0;
        i < values.length;
        i++
    ) {

        /*
            Recent results have larger weights.
        */

        const weight =
            i + 1;

        numerator +=
            values[i] *
            weight;

        denominator += weight;
    }


    return (
        numerator /
        denominator
    );
}


function analyzeRecentPerformance(
    current,
    recent = [],
    options = {}
) {

    const maxHistory =
        options.maxHistory ?? 10;


    const history =
        Array.isArray(recent)
            ? recent
                .filter(
                    item =>
                        item &&
                        typeof item === "object"
                )
                .slice(
                    -maxHistory
                )
            : [];


    const values = {

        score: history
            .map(
                item => Number(item.score)
            )
            .filter(Number.isFinite),

        nWPM: history
            .map(
                item => Number(item.nWPM)
            )
            .filter(Number.isFinite),

        accuracy: history
            .map(
                item => Number(item.accuracy)
            )
            .filter(Number.isFinite),

        consistency: history
            .map(
                item => Number(item.consistency)
            )
            .filter(Number.isFinite)
    };


    function analyseMetric(
        currentValue,
        historyValues
    ) {

        if (
            !Number.isFinite(currentValue) ||
            historyValues.length === 0
        ) {

            return {
                current: currentValue,
                average: null,
                recentAverage: null,
                trend: 0,
                direction: "unknown"
            };
        }


        const recentAverage =
            weightedRecentAverage(
                historyValues
            );


        const trend =
            linearTrend(
                historyValues.concat(
                    currentValue
                )
            );


        const difference =
            currentValue -
            recentAverage;


        let direction;

        if (
            difference > 2
        ) {
            direction = "improving";
        }

        else if (
            difference < -2
        ) {
            direction = "declining";
        }

        else {
            direction = "stable";
        }


        return {
            current: currentValue,

            average:
                average(
                    historyValues
                ),

            recentAverage,

            difference,

            trend,

            direction
        };
    }


    return {

        sampleSize:
            history.length,

        score:
            analyseMetric(
                Number(current?.score),
                values.score
            ),

        nWPM:
            analyseMetric(
                Number(current?.nWPM),
                values.nWPM
            ),

        accuracy:
            analyseMetric(
                Number(current?.accuracy),
                values.accuracy
            ),

        consistency:
            analyseMetric(
                Number(current?.consistency),
                values.consistency
            )
    };
}


module.exports = {
    analyzeRecentPerformance
};