/*
===========================================================
    ADVANCED TYPING TIP ENGINE
===========================================================

    Uses:

        current result
        score
        integrity
        recent performance
        trend analysis

===========================================================
*/


function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}


function pickHighestPriority(
    candidates
) {

    let best = null;


    for (const candidate of candidates) {

        if (
            !best ||
            candidate.priority >
            best.priority
        ) {

            best = candidate;
        }
    }


    return best;
}


function getTypingTip({

    current = {},

    score = {},

    integrity = {},

    recentPerformance = [],

    trend = null

} = {}) {


    /*
    =======================================================
        BASIC VALUES
    =======================================================
    */

    const accuracy =
        Number(current.accuracy) || 0;

    const nWPM =
        Number(current.nWPM) || 0;

    const consistency =
        Number.isFinite(
            Number(current.consistency)
        )
            ? Number(current.consistency)
            : null;


    const performanceScore =
        Number(score.score) || 0;


    const integrityScore =
        Number.isFinite(
            Number(integrity.score)
        )
            ? Number(integrity.score)
            : 1;


    const candidates = [];


    /*
    =======================================================
        1. INTEGRITY CONCERN
    =======================================================
    */

    if (
        integrityScore < 0.50
    ) {

        candidates.push({

            priority: 100,

            type: "integrity",

            tip:
                "Your input pattern looks unusual. Avoid paste or automated input and focus on genuine keystrokes."
        });

    }

    else if (
        integrityScore < 0.70
    ) {

        candidates.push({

            priority: 85,

            type: "integrity",

            tip:
                "There are signs of unusual input behavior. Try completing the test using normal key-by-key typing."
        });
    }


    /*
    =======================================================
        2. ACCURACY PROBLEM
    =======================================================
    */

    if (accuracy < 85) {

        candidates.push({

            priority:
                90 +
                (85 - accuracy),

            type: "accuracy",

            tip:
                "Try focusing on accuracy first. Slow down slightly and build clean keystrokes before chasing speed."
        });

    }

    else if (accuracy < 92) {

        candidates.push({

            priority: 75,

            type: "accuracy",

            tip:
                "Your speed is developing, but accuracy is holding the result back. Aim for cleaner keystrokes."
        });

    }


    /*
    =======================================================
        3. HIGH SPEED / LOW ACCURACY
    =======================================================
    */

    if (
        nWPM >= 90 &&
        accuracy < 94
    ) {

        candidates.push({

            priority: 88,

            type: "speed_accuracy_tradeoff",

            tip:
                "You're typing fast, but you're sacrificing accuracy. Keep most of your speed and reduce the error rate."
        });
    }


    /*
    =======================================================
        4. SLOW SPEED / HIGH ACCURACY
    =======================================================
    */

    if (
        nWPM < 45 &&
        accuracy >= 95
    ) {

        candidates.push({

            priority: 60,

            type: "speed",

            tip:
                "Your accuracy is strong. Start pushing your speed gradually while keeping your accuracy above 95%."
        });
    }


    /*
    =======================================================
        5. CONSISTENCY
    =======================================================
    */

    if (
        consistency !== null &&
        consistency < 60
    ) {

        candidates.push({

            priority: 78,

            type: "consistency",

            tip:
                "Your typing rhythm is uneven. Try keeping a steadier pace instead of alternating between bursts and pauses."
        });

    }

    else if (
        consistency !== null &&
        consistency < 75
    ) {

        candidates.push({

            priority: 58,

            type: "consistency",

            tip:
                "Your rhythm could be smoother. Focus on maintaining a more even typing pace."
        });
    }


    /*
    =======================================================
        6. ERROR HEAVY RESULT
    =======================================================
    */

    const uncorrectedErrors =
        Number(
            current.uncorrectedErrors
        ) || 0;


    const enteredCharacters =
        Math.max(
            1,
            Number(
                current.enteredCharacters
            ) || 1
        );


    const errorRate =
        uncorrectedErrors /
        enteredCharacters;


    if (
        errorRate > 0.08
    ) {

        candidates.push({

            priority: 92,

            type: "errors",

            tip:
                "A large part of the score is being lost to errors. Prioritize clean typing over speed in your next test."
        });
    }


    /*
    =======================================================
        7. TREND ANALYSIS
    =======================================================
    */

    if (trend) {

        /*
        ---------------------------------------------------
            Accuracy falling repeatedly
        ---------------------------------------------------
        */

        if (
            trend.accuracy?.direction ===
            "declining"
        ) {

            candidates.push({

                priority: 86,

                type: "trend_accuracy",

                tip:
                    "Your recent accuracy is trending downward. Focus on consistency and precision before increasing speed."
            });
        }


        /*
        ---------------------------------------------------
            Speed improving
        ---------------------------------------------------
        */

        if (
            trend.nWPM?.direction ===
            "improving" &&
            trend.accuracy?.direction !==
            "declining"
        ) {

            candidates.push({

                priority: 45,

                type: "progress",

                tip:
                    "Your recent speed is improving. Keep the same technique and gradually push your pace."
            });
        }


        /*
        ---------------------------------------------------
            Score declining
        ---------------------------------------------------
        */

        if (
            trend.score?.direction ===
            "declining"
        ) {

            candidates.push({

                priority: 70,

                type: "trend_score",

                tip:
                    "Your recent scores are slipping. Stabilize your accuracy and rhythm before trying to increase speed."
            });
        }


        /*
        ---------------------------------------------------
            Accuracy improving but speed stable
        ---------------------------------------------------
        */

        if (
            trend.accuracy?.direction ===
            "improving" &&
            trend.nWPM?.direction ===
            "stable"
        ) {

            candidates.push({

                priority: 50,

                type: "progress",

                tip:
                    "Your accuracy is improving. You're ready to gradually increase speed without changing your technique too much."
            });
        }


        /*
        ---------------------------------------------------
            Speed dropping but accuracy improving
        ---------------------------------------------------
        */

        if (
            trend.nWPM?.direction ===
            "declining" &&
            trend.accuracy?.direction ===
            "improving"
        ) {

            candidates.push({

                priority: 62,

                type: "tradeoff",

                tip:
                    "Your accuracy is improving while speed is falling. Increase your pace gradually once the cleaner technique feels natural."
            });
        }
    }


    /*
    =======================================================
        8. EXCELLENT PERFORMANCE
    =======================================================
    */

    if (
        performanceScore >= 95 &&
        integrityScore >= 0.90
    ) {

        candidates.push({

            priority: 30,

            type: "excellent",

            tip:
                "Excellent run. Your speed, accuracy and overall control are all strong—maintain this technique."
        });
    }


    /*
    =======================================================
        9. STABLE MID-HIGH PERFORMANCE
    =======================================================
    */

    if (
        performanceScore >= 80 &&
        performanceScore < 95 &&
        accuracy >= 95 &&
        (
            consistency === null ||
            consistency >= 80
        )
    ) {

        candidates.push({

            priority: 35,

            type: "advanced",

            tip:
                "You're already performing well. Your next gains will come from small improvements in speed rather than major technique changes."
        });
    }


    /*
    =======================================================
        10. FALLBACK
    =======================================================
    */

    if (!candidates.length) {

        return {

            type: "general",

            tip:
                "Keep practicing at a controlled pace and aim to improve one metric at a time.",

            priority: 1
        };
    }


    const selected =
        pickHighestPriority(
            candidates
        );


    return {

        type:
            selected.type,

        tip:
            selected.tip,

        priority:
            selected.priority,

        candidatesConsidered:
            candidates.length
    };
}


module.exports = {
    getTypingTip
};