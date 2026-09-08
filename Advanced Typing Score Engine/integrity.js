/*
===========================================================
    ADVANCED TYPING INTEGRITY ANALYZER
===========================================================

    Detects:

        - paste
        - drop
        - impossible timestamp order
        - duplicate timestamps
        - timestamp gaps
        - event bursts
        - suspiciously large insertions
        - event collapse / batching
        - duration mismatch
        - impossible typing speed

    IMPORTANT:

    This does NOT prove cheating.

    It calculates evidence and a trust score.

    integrity.score:
        1.00 = highly trustworthy
        0.00 = highly suspicious

===========================================================
*/


function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}


function finite(value) {
    return Number.isFinite(value);
}


function addSignal(
    signals,
    reason,
    severity,
    confidence,
    details = null
) {
    signals.push({
        reason,
        severity: clamp(severity, 0, 1),
        confidence: clamp(confidence, 0, 1),
        details
    });
}


function calculateRobustMedian(values) {

    if (!values.length) {
        return null;
    }

    const sorted = [...values].sort(
        (a, b) => a - b
    );

    const middle =
        Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (
            sorted[middle - 1] +
            sorted[middle]
        ) / 2;
    }

    return sorted[middle];
}


function analyzeIntegrity({
    events = [],
    durationSeconds = null,
    clientDuration = null,
    enteredCharacters = 0,
    rawWPM = 0,

    options = {}
}) {

    const config = {

        // -------------------------------------------------
        // Paste
        // -------------------------------------------------

        detectPaste:
            options.detectPaste ?? true,

        // -------------------------------------------------
        // Burst detection
        // -------------------------------------------------

        burstIntervalMs:
            options.burstIntervalMs ?? 18,

        burstMinimumEvents:
            options.burstMinimumEvents ?? 6,

        burstWindowMs:
            options.burstWindowMs ?? 100,

        // -------------------------------------------------
        // Large insertion
        // -------------------------------------------------

        largeInsertionCharacters:
            options.largeInsertionCharacters ?? 3,

        // -------------------------------------------------
        // Timestamp rules
        // -------------------------------------------------

        duplicateTimestampLimit:
            options.duplicateTimestampLimit ?? 3,

        maximumReasonableGapMs:
            options.maximumReasonableGapMs ?? 120_000,

        // -------------------------------------------------
        // Speed
        // -------------------------------------------------

        extremeWPM:
            options.extremeWPM ?? 300,

        impossibleWPM:
            options.impossibleWPM ?? 450,

        // -------------------------------------------------
        // Duration
        // -------------------------------------------------

        durationMismatchMinimum:
            options.durationMismatchMinimum ?? 5,

        durationMismatchRatio:
            options.durationMismatchRatio ?? 0.25
    };


    if (!Array.isArray(events)) {
        throw new TypeError(
            "events must be an array"
        );
    }


    /*
    =======================================================
        HARD LIMIT

        Never allow attacker-controlled huge event arrays.
    =======================================================
    */

    const MAX_EVENTS = 100_000;

    if (events.length > MAX_EVENTS) {
        throw new Error(
            "Too many integrity events"
        );
    }


    /*
    =======================================================
        No events
    =======================================================
    */

    if (events.length === 0) {

        return {
            suspicious: false,
            score: 1,
            reasons: [],
            signals: [],
            statistics: {
                events: 0,
                timestampSamples: 0,
                medianInterval: null
            }
        };
    }


    const signals = [];

    const intervals = [];

    let timestampAnomalies = 0;
    let duplicateTimestamps = 0;

    let previousTimestamp = null;

    let characterEvents = 0;
    let maximumInsertedCharacters = 0;

    let pasteDetected = false;


    /*
    =======================================================
        PASS 1
        Inspect individual events
    =======================================================
    */

    for (const event of events) {

        if (!event || typeof event !== "object") {
            continue;
        }


        const timestamp =
            Number(event.timestamp);


        /*
        ---------------------------------------------------
            Timestamp validity
        ---------------------------------------------------
        */

        if (!finite(timestamp)) {

            timestampAnomalies++;

            continue;
        }


        /*
        ---------------------------------------------------
            Timestamp monotonicity
        ---------------------------------------------------

            performance.now() based streams should be
            monotonic.
        ---------------------------------------------------
        */

        if (previousTimestamp !== null) {

            const interval =
                timestamp -
                previousTimestamp;


            if (interval < 0) {

                timestampAnomalies++;

                addSignal(
                    signals,
                    "timestamp_anomaly",
                    0.95,
                    1,
                    {
                        type: "negative_interval",
                        interval
                    }
                );

            }

            else {

                intervals.push(interval);

                if (interval === 0) {
                    duplicateTimestamps++;
                }
            }
        }


        previousTimestamp = timestamp;


        /*
        ---------------------------------------------------
            Paste detection
        ---------------------------------------------------
        */

        const inputType =
            typeof event.inputType === "string"
                ? event.inputType
                : "";


        if (
            config.detectPaste &&
            (
                inputType === "insertFromPaste" ||
                inputType === "insertFromDrop" ||
                event.type === "paste" ||
                event.type === "drop"
            )
        ) {

            pasteDetected = true;

            addSignal(
                signals,
                "paste_detected",
                1,
                1,
                {
                    inputType
                }
            );
        }


        /*
        ---------------------------------------------------
            Character insertion count
        ---------------------------------------------------
        */

        if (
            inputType === "insertText" ||
            inputType === "insertFromPaste" ||
            inputType === "insertFromDrop"
        ) {

            characterEvents++;

            const value =
                typeof event.value === "string"
                    ? event.value
                    : "";

            maximumInsertedCharacters =
                Math.max(
                    maximumInsertedCharacters,
                    [...value].length
                );
        }
    }


    /*
    =======================================================
        DUPLICATE TIMESTAMP ANALYSIS
    =======================================================
    */

    if (
        duplicateTimestamps >=
        config.duplicateTimestampLimit
    ) {

        addSignal(
            signals,
            "timestamp_anomaly",
            0.75,
            0.95,
            {
                duplicateTimestamps
            }
        );
    }


    /*
    =======================================================
        MEDIAN INTERVAL

        Median is used instead of mean because pauses and
        network delays should not dominate the statistic.
    =======================================================
    */

    const medianInterval =
        calculateRobustMedian(
            intervals
        );


    /*
    =======================================================
        EVENT BURST DETECTION

        We don't flag a fast typist simply for typing fast.

        A burst requires a cluster of unusually tiny
        intervals.
    =======================================================
    */

    let burstCount = 0;

    let currentBurstEvents = 1;
    let burstStartTime = null;

    for (
        let index = 0;
        index < intervals.length;
        index++
    ) {

        const interval =
            intervals[index];


        if (
            interval >= 0 &&
            interval <=
            config.burstIntervalMs
        ) {

            if (currentBurstEvents === 1) {

                burstStartTime =
                    index > 0
                        ? events[index]?.timestamp
                        : null;
            }

            currentBurstEvents++;

            const burstDuration =
                burstStartTime !== null &&
                    finite(events[index + 1]?.timestamp)
                    ? events[index + 1].timestamp -
                    burstStartTime
                    : 0;


            if (
                currentBurstEvents >=
                config.burstMinimumEvents &&
                burstDuration <=
                config.burstWindowMs
            ) {

                burstCount++;

                /*
                    Reset so one enormous burst does not
                    generate hundreds of signals.
                */

                currentBurstEvents = 1;
                burstStartTime = null;
            }

        }

        else {

            currentBurstEvents = 1;
            burstStartTime = null;
        }
    }


    if (burstCount > 0) {

        addSignal(
            signals,
            "event_burst",
            clamp(
                0.45 + burstCount * 0.05,
                0,
                0.9
            ),
            0.70,
            {
                burstCount,
                medianInterval
            }
        );
    }


    /*
    =======================================================
        LARGE INSERTION

        Example:

            1 event → "this is a whole sentence"

        That's very different from one key event.
    =======================================================
    */

    if (
        maximumInsertedCharacters >=
        config.largeInsertionCharacters
    ) {

        const confidence =
            maximumInsertedCharacters >= 10
                ? 1
                : 0.75;

        addSignal(
            signals,
            "large_insertion",
            clamp(
                maximumInsertedCharacters / 20,
                0.25,
                0.9
            ),
            confidence,
            {
                characters:
                    maximumInsertedCharacters
            }
        );
    }


    /*
    =======================================================
        EXTREME WPM
    =======================================================
    */

    if (
        finite(rawWPM) &&
        rawWPM >= config.impossibleWPM
    ) {

        addSignal(
            signals,
            "impossible_wpm",
            0.95,
            0.90,
            {
                rawWPM
            }
        );

    }

    else if (
        finite(rawWPM) &&
        rawWPM >= config.extremeWPM
    ) {

        addSignal(
            signals,
            "extreme_wpm",
            0.55,
            0.65,
            {
                rawWPM
            }
        );
    }


    /*
    =======================================================
        DURATION MISMATCH
    =======================================================
    */

    if (
        finite(clientDuration) &&
        finite(durationSeconds) &&
        durationSeconds > 0
    ) {

        const difference =
            Math.abs(
                clientDuration -
                durationSeconds
            );

        const threshold =
            Math.max(
                config.durationMismatchMinimum,
                durationSeconds *
                config.durationMismatchRatio
            );

        if (difference > threshold) {

            const severity =
                clamp(
                    difference /
                    Math.max(
                        durationSeconds,
                        1
                    ),
                    0.25,
                    0.9
                );

            addSignal(
                signals,
                "duration_mismatch",
                severity,
                0.80,
                {
                    clientDuration,
                    durationSeconds,
                    difference
                }
            );
        }
    }


    /*
    =======================================================
        TIMESTAMP GAP

        IMPORTANT:

        A long gap alone is NOT cheating.

        It's treated only as a data-integrity concern.
    =======================================================
    */

    let hugeGaps = 0;

    for (const interval of intervals) {

        if (
            interval >
            config.maximumReasonableGapMs
        ) {

            hugeGaps++;
        }
    }


    if (hugeGaps > 0) {

        addSignal(
            signals,
            "timestamp_gap",
            0.20,
            0.35,
            {
                hugeGaps
            }
        );
    }


    /*
    =======================================================
        WEIGHTED INTEGRITY SCORE
    =======================================================

        Each signal contributes:

            severity × confidence × categoryWeight

        Multiple weak signals can accumulate.

        One strong signal can dominate.

    =======================================================
    */

    const categoryWeight = {
        paste_detected: 1.00,
        impossible_wpm: 1.00,
        timestamp_anomaly: 0.90,
        large_insertion: 0.65,
        duration_mismatch: 0.45,
        event_burst: 0.55,
        extreme_wpm: 0.45,
        timestamp_gap: 0.15
    };


    let suspicionMass = 0;

    for (const signal of signals) {

        const weight =
            categoryWeight[
            signal.reason
            ] ?? 0.25;

        suspicionMass +=
            signal.severity *
            signal.confidence *
            weight;
    }


    /*
        Saturating function.

        Prevents:

            10 weak signals
            =
            score < 0 immediately

    */

    const suspicion =
        1 -
        Math.exp(
            -suspicionMass
        );


    let score =
        clamp(
            1 - suspicion,
            0,
            1
        );


    /*
    =======================================================
        HARD EVIDENCE OVERRIDE

        Explicit paste is strong evidence.

        But "suspicious" does NOT mean "cheater".
    =======================================================
    */

    if (pasteDetected) {
        score = Math.min(
            score,
            0.35
        );
    }


    if (
        signals.some(
            signal =>
                signal.reason ===
                "impossible_wpm"
        )
    ) {

        score = Math.min(
            score,
            0.25
        );
    }


    /*
    =======================================================
        UNIQUE REASONS
    =======================================================
    */

    const reasons = [
        ...new Set(
            signals.map(
                signal => signal.reason
            )
        )
    ];


    /*
    =======================================================
        SUSPICIOUS THRESHOLD
    =======================================================
    */

    const suspicious =
        score < 0.70;


    return {
        suspicious,

        score:
            Math.round(
                score * 1000
            ) / 1000,

        reasons,

        signals,

        statistics: {
            events:
                events.length,

            characterEvents,

            timestampSamples:
                intervals.length,

            medianInterval,

            duplicateTimestamps,

            burstCount,

            maximumInsertedCharacters
        }
    };
}


module.exports = {
    analyzeIntegrity
};