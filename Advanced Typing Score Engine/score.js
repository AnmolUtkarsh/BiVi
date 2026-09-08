/*
===========================================================
    ADVANCED TYPING PERFORMANCE SCORER
===========================================================

    performanceScore:
        0 - 100

    trustedScore:
        performanceScore adjusted by integrity

===========================================================
*/

//Imports
const { clamp, finiteOr, smoothStep } = require("./helper");


// function clamp(value, min, max) {
//     return Math.min(max, Math.max(min, value));
// }





/*
===========================================================
    SPEED NORMALIZATION

    Instead of:

        120 WPM = 120 points

    use a saturating function.

    This prevents absurdly high WPM from dominating the
    entire score.

===========================================================
*/

function normalizeWPM(
    wpm,
    {
        poor = 20,
        target = 80,
        excellent = 130
    } = {}
) {

    wpm =
        finiteOr(wpm, 0);


    if (wpm <= poor) {
        return 0;
    }


    if (wpm >= excellent) {
        return 1;
    }


    if (wpm <= target) {

        return (
            (wpm - poor) /
            (target - poor)
        ) * 0.72;

    }


    return (
        0.72 +
        (
            (wpm - target) /
            (excellent - target)
        ) * 0.28
    );
}


/*
===========================================================
    ACCURACY NORMALIZATION
===========================================================
*/

function normalizeAccuracy(
    accuracy
) {

    accuracy =
        clamp(
            finiteOr(accuracy, 0),
            0,
            100
        );


    /*
        Accuracy below 90 should matter heavily.

        99 → 100 is much less important than
        89 → 90.
    */

    if (accuracy < 80) {

        return (
            accuracy / 80
        ) * 0.45;

    }


    if (accuracy < 95) {

        return (
            0.45 +
            (
                (accuracy - 80) /
                15
            ) * 0.35
        );

    }


    return (
        0.80 +
        (
            (accuracy - 95) /
            5
        ) * 0.20
    );
}


/*
===========================================================
    ERROR NORMALIZATION
===========================================================
*/

function errorPenalty(
    uncorrectedErrors,
    enteredCharacters
) {

    const errors =
        Math.max(
            0,
            finiteOr(
                uncorrectedErrors,
                0
            )
        );


    const entered =
        Math.max(
            1,
            finiteOr(
                enteredCharacters,
                1
            )
        );


    const errorRate =
        errors / entered;


    /*
        Smooth saturation.

        2 errors in 500 characters
        is tiny.

        100 errors in 500 characters
        is huge.
    */

    return clamp(
        1 -
        Math.exp(
            -errorRate * 12
        ),
        0,
        1
    );
}


/*
===========================================================
    COMPLETION
===========================================================
*/

function calculateCompletion(
    expectedCharacters,
    enteredCharacters
) {

    expectedCharacters =
        Math.max(
            0,
            finiteOr(
                expectedCharacters,
                0
            )
        );

    enteredCharacters =
        Math.max(
            0,
            finiteOr(
                enteredCharacters,
                0
            )
        );


    if (expectedCharacters === 0) {
        return 1;
    }


    return clamp(
        enteredCharacters /
        expectedCharacters,
        0,
        1
    );
}


/*
===========================================================
    MAIN SCORE FUNCTION
===========================================================
*/

function calculateTypingScore({

    accuracy = 0,

    nWPM = 0,

    rWPM = 0,

    consistency = null,

    expectedCharacters = 0,

    enteredCharacters = 0,

    correctCharacters = 0,

    uncorrectedErrors = 0,

    durationSeconds = 0,

    integrity = null,

    correctedErrors = 0,

    backspaces = 0

} = {}) {


    /*
    =======================================================
        1. CORE NORMALIZED FEATURES
    =======================================================
    */

    const accuracyScore =
        normalizeAccuracy(
            accuracy
        );


    const netSpeedScore =
        normalizeWPM(
            nWPM
        );


    const rawSpeedScore =
        normalizeWPM(
            rWPM,
            {
                poor: 25,
                target: 90,
                excellent: 145
            }
        );


    const completion =
        calculateCompletion(
            expectedCharacters,
            enteredCharacters
        );


    const errorPenaltyValue =
        errorPenalty(
            uncorrectedErrors,
            enteredCharacters
        );


    /*
    =======================================================
        2. CONSISTENCY

        Optional.

        Missing consistency should NOT automatically
        punish the user.
    =======================================================
    */

    const hasConsistency =
        Number.isFinite(
            consistency
        );


    const consistencyScore =
        hasConsistency
            ? clamp(
                consistency / 100,
                0,
                1
            )
            : null;


    /*
    =======================================================
        3. BASE WEIGHTING
    =======================================================
    */

    let weightedTotal = 0;
    let totalWeight = 0;


    function addMetric(
        value,
        weight
    ) {

        if (!Number.isFinite(value)) {
            return;
        }

        weightedTotal +=
            value * weight;

        totalWeight += weight;
    }


    /*
        Accuracy is intentionally the largest factor.
    */

    addMetric(
        accuracyScore,
        0.34
    );


    /*
        Net WPM is second.
    */

    addMetric(
        netSpeedScore,
        0.30
    );


    /*
        Raw WPM provides a smaller signal.
    */

    addMetric(
        rawSpeedScore,
        0.10
    );


    /*
        Completion matters.
    */

    addMetric(
        completion,
        0.12
    );


    /*
        Optional consistency.
    */

    if (consistencyScore !== null) {

        addMetric(
            consistencyScore,
            0.14
        );
    }


    /*
    =======================================================
        4. BASE SCORE
    =======================================================
    */

    let score =
        totalWeight === 0
            ? 0
            : weightedTotal /
              totalWeight;


    /*
    =======================================================
        5. HIGH-PERFORMANCE SYNERGY

        Reward users who are simultaneously fast AND
        accurate.

        Example:

            130 WPM + 99.5%
        should score substantially better than

            130 WPM + 83%
    =======================================================
    */

    const speedAccuracySynergy =
        smoothStep(
            netSpeedScore *
            accuracyScore
        );


    score +=
        speedAccuracySynergy *
        0.08;


    /*
    =======================================================
        6. CONSISTENCY SYNERGY

        Accuracy + speed + consistency all being strong
        is better than each being independently average.
    =======================================================
    */

    if (consistencyScore !== null) {

        const stability =
            (
                accuracyScore +
                netSpeedScore +
                consistencyScore
            ) / 3;


        score +=
            smoothStep(
                stability
            ) * 0.04;
    }


    /*
    =======================================================
        7. COMPLETION PENALTY

        Don't give an excellent score to a user who only
        typed a tiny fraction of the test.
    =======================================================
    */

    if (completion < 0.90) {

        const missing =
            1 - completion;

        score -=
            missing *
            0.20;
    }


    /*
    =======================================================
        8. UNCORRECTED ERROR PENALTY
    =======================================================
    */

    score -=
        errorPenaltyValue *
        0.16;


    /*
    =======================================================
        9. BACKSPACE / CORRECTION INFORMATION

        These don't get a huge penalty.

        Making corrections is normal typing behavior.

        Excessive corrections have a small effect.
    =======================================================
    */

    const corrected =
        Math.max(
            0,
            finiteOr(
                correctedErrors,
                0
            )
        );


    const backspaceCount =
        Math.max(
            0,
            finiteOr(
                backspaces,
                0
            )
        );


    const correctionRate =
        enteredCharacters > 0
            ? corrected /
              enteredCharacters
            : 0;


    const backspaceRate =
        enteredCharacters > 0
            ? backspaceCount /
              enteredCharacters
            : 0;


    /*
        Small quality penalty only.
    */

    score -=
        clamp(
            correctionRate * 0.04,
            0,
            0.04
        );


    score -=
        clamp(
            backspaceRate * 0.03,
            0,
            0.03
        );


    /*
    =======================================================
        10. INTEGRITY-AWARE TRUSTED SCORE
    =======================================================
    */

    const integrityScore =
        integrity &&
        Number.isFinite(
            integrity.score
        )
            ? clamp(
                integrity.score,
                0,
                1
            )
            : 1;


    /*
        Do NOT completely destroy performance score.

        Instead:

        suspicious test
            ↓
        performanceScore remains real
            ↓
        trustedScore is reduced
    */

    const trustedMultiplier =
        0.65 +
        integrityScore * 0.35;


    const performanceScore =
        clamp(
            score * 100,
            0,
            100
        );


    const trustedScore =
        clamp(
            performanceScore *
            trustedMultiplier,
            0,
            100
        );


    /*
    =======================================================
        11. SCORE LABEL
    =======================================================
    */

    let grade;

    if (performanceScore >= 95) {
        grade = "elite";
    }
    else if (performanceScore >= 90) {
        grade = "excellent";
    }
    else if (performanceScore >= 80) {
        grade = "very_good";
    }
    else if (performanceScore >= 70) {
        grade = "good";
    }
    else if (performanceScore >= 55) {
        grade = "average";
    }
    else if (performanceScore >= 40) {
        grade = "developing";
    }
    else {
        grade = "needs_work";
    }


    return {

        score:
            Number(
                performanceScore.toFixed(2)
            ),

        trustedScore:
            Number(
                trustedScore.toFixed(2)
            ),

        grade,

        components: {

            accuracy:
                Number(
                    (
                        accuracyScore *
                        100
                    ).toFixed(2)
                ),

            netWPM:
                Number(
                    (
                        netSpeedScore *
                        100
                    ).toFixed(2)
                ),

            rawWPM:
                Number(
                    (
                        rawSpeedScore *
                        100
                    ).toFixed(2)
                ),

            completion:
                Number(
                    (
                        completion *
                        100
                    ).toFixed(2)
                ),

            consistency:
                consistencyScore === null
                    ? null
                    : Number(
                        (
                            consistencyScore *
                            100
                        ).toFixed(2)
                    ),

            errorPenalty:
                Number(
                    (
                        errorPenaltyValue *
                        100
                    ).toFixed(2)
                )
        },

        integrity: {

            score:
                Number(
                    integrityScore.toFixed(3)
                ),

            impact:
                Number(
                    (
                        (
                            1 -
                            trustedMultiplier
                        ) * 100
                    ).toFixed(2)
                )
        }
    };
}


module.exports = {
    calculateTypingScore
};