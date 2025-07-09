
(function (){

    // EventTiming / INP Track
    eventTimingObserver = new PerformanceObserver((list) => {

        entries = list.getEntries();
        for (const entry of entries) {

            // Skip enties with no interationId
            // Comment out to include
            if (entry.interactionId == 0) {
                 continue;
            }

            performance.measure('Input Delay', {
                start: entry.startTime,
                end: entry.processingStart, 
                detail: {
                    devtools: {
                        dataType: 'track-entry',
                        track: '' + entry.name,
                        trackGroup: 'INP',
                        color: 'primary-light',
                        tooltipText: 'Input Delay',
                        properties: [
                            ['interactionId', '' + entry.interactionId],
                            ['name', '' + entry.name],
                            ['target', '' + entry.target]
                        ]
                    }
                }
            });
            performance.measure('Processing Time', {
                start: entry.processingStart,
                end: entry.processingEnd, 
                detail: {
                    devtools: {
                        dataType: 'track-entry',
                        track: '' + entry.name,
                        trackGroup: 'INP',
                        color: 'primary',
                        tooltipText: 'Processing Time',
                        properties: [
                            ['interactionId', '' + entry.interactionId],
                            ['name', '' + entry.name],
                            ['target', '' + entry.target]
                        ]
                    }
                }
            });
            performance.measure('Presentation Delay', {
                start: entry.processingEnd,
                end: entry.startTime + entry.duration, 
                detail: {
                    devtools: {
                        dataType: 'track-entry',
                        track: '' + entry.name,
                        trackGroup: 'INP',
                        color: 'primary-light',
                        tooltipText: 'Presentation Delay',
                        properties: [
                            ['interactionId', '' + entry.interactionId],
                            ['name', '' + entry.name],
                            ['target', '' + entry.target]
                        ]
                    }
                }
            });
        }
    });

    eventTimingObserver.observe({ type: 'event', buffered: true, durationThreshold: 0});
    
    // LoAF / ScriptTiming Track
    loafObserver = new PerformanceObserver((list) => {

        entries = list.getEntries();
        for (const entry of entries) {

            // Set script entries before LoAF so Chrome will display them in the appropriate order
            for(const script of entry.scripts) {
                performance.measure('script', {
                    start: script.startTime,
                    end: script.startTime + script.duration, 
                    detail: {
                        devtools: {
                            dataType: 'track-entry',
                            track: 'LoAFs',
                            trackGroup: 'Performance Timeline',
                            color: 'secondary',
                            tooltipText: script.sourceURL,
                            properties: [
                                ['name', '' + script.name],
                                ['entryType', '' + script.entryType],
                                ['startTime', '' + script.startTime],
                                ['duration', '' + script.duration],
                                ['navigationId', '' + script.navigationId],
                                ['invoker', '' + script.invoker],
                                ['invokerType', '' + script.invokerType],
                                ['windowAttribution', '' + script.windowAttribution],
                                ['executionStart', '' + script.executionStart],
                                ['forcedStyleAndLayoutDuration', '' + script.forcedStyleAndLayoutDuration],
                                ['pauseDuration', '' + script.pauseDuration],
                                ['sourceURL', '' + script.sourceURL],
                                ['sourceFunctionName', '' + script.sourceFunctionName],
                                ['sourceCharPosition', '' + script.sourceCharPosition]
                            ]
                        }
                    }
                });
            }

            performance.measure('LoAF', {
                start: entry.startTime,
                end: entry.startTime + entry.duration, 
                detail: {
                    devtools: {
                        dataType: 'track-entry',
                        track: 'LoAFs',
                        trackGroup: 'Performance Timeline',
                        color: 'primary',
                        tooltipText: 'LoAF',
                        properties: [
                            ['name', '' + entry.name],
                            ['entryType', '' + entry.entryType],
                            ['startTime', '' + entry.startTime],
                            ['duration', '' + entry.duration],
                            ['renderStart', '' + entry.renderStart],
                            ['styleAndLayoutStart', '' + entry.styleAndLayoutStart],
                            ['firstUIEventTimestamp', '' + entry.firstUIEventTimestamp],
                            ['blockingDuration', '' + entry.blockingDuration]
                        ]
                    }
                }
            });

            if(entry.renderStart > 0) {
                performance.measure('Pre-Style & Layout', {
                    start: entry.renderStart,
                    end: entry.styleAndLayoutStart, 
                    detail: {
                        devtools: {
                            dataType: 'track-entry',
                            track: 'LoAFs',
                            trackGroup: 'Performance Timeline',
                            color: 'secondary-light',
                            tooltipText: 'Pre-Style & Layout'
                        }
                    }
                });
                performance.measure('Style & Layout', {
                    start: entry.styleAndLayoutStart,
                    end: entry.startTime + entry.duration, 
                    detail: {
                        devtools: {
                            dataType: 'track-entry',
                            track: 'LoAFs',
                            trackGroup: 'Performance Timeline',
                            color: 'secondary-light',
                            tooltipText: 'Style & Layout'
                        }
                    }
                });
            }

        }
    });

    loafObserver.observe({ type: 'long-animation-frame', buffered: true, durationThreshold: 0});

    // Long Tasks Track
    longTaskObserver = new PerformanceObserver((list) => {

        entries = list.getEntries();
        for (const entry of entries) {

            performance.measure('Long Task', {
                start: entry.startTime,
                end: entry.startTime + entry.duration, 
                detail: {
                    devtools: {
                    dataType: 'track-entry',
                    track: 'Long Tasks',
                    trackGroup: 'Performance Timeline',
                    color: 'primary',
                    tooltipText: 'Long Task'
                    }
                }
            });
        }
    });

    longTaskObserver.observe({ type: 'longtask', buffered: true, durationThreshold: 0});

    // LCP Track
    lcpObserver = new PerformanceObserver((list) => {

        entries = list.getEntries();
        for (const entry of entries) {

            performance.mark('LCP', {
                start: entry.startTime,
                detail: {
                    devtools: {
                    dataType: 'track-entry',
                    track: 'LCP',
                    trackGroup: 'Performance Timeline',
                    color: 'primary',
                    tooltipText: 'LCP Candidate',
                    properties: [
                        ['size', '' + entry.size],
                        ['element', '' + entry.element],
                        ['URL', '' + entry.url]
                    ],
                    }
                }
            });
        }
    });

    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true, durationThreshold: 0});

    // Soft Navigations Track
    softNavObserver = new PerformanceObserver((list) => {

        entries = list.getEntries();
        for (const entry of entries) {

            performance.measure('Soft Navigation', {
                start: entry.startTime,
                end: Math.max(entry.paintTime, entry.presentationTime),
                detail: {
                    devtools: {
                        dataType: 'track-entry',
                        track: 'Soft Navigations',
                        trackGroup: 'Performance Timeline',
                        color: 'primary',
                        tooltipText: 'Soft Navigation',
                        properties: [
                            ['name', '' + entry.name],
                            ['entryType', '' + entry.entryType],
                            ['startTime', '' + entry.startTime],
                            ['paintTime', '' + entry.paintTime],
                            ['presentationTime', '' + entry.presentationTime],
                            ['duration', '' + entry.duration],
                            ['navigationId', '' + entry.navigationId]
                        ]
                    }
                }
            });
        }
    });

    softNavObserver.observe({ type: "soft-navigation", buffered: true, includeSoftNavigationObservations: true });

    // LCP Track
    icpObserver = new PerformanceObserver((list) => {

        entries = list.getEntries();
        for (const entry of entries) {

            performance.mark('ICP', {
                start: entry.startTime,
                detail: {
                    devtools: {
                    dataType: 'track-entry',
                    track: 'Interaction Contentful Paint',
                    trackGroup: 'Performance Timeline',
                    color: 'primary',
                    tooltipText: 'ICP Candidate',
                    properties: [
                        ['size', '' + entry.size],
                        ['element', '' + entry.element],
                        ['URL', '' + entry.url],
                        ['startTime', '' + entry.startTime],
                        ['paintTime', '' + entry.paintTime],
                        ['presentationTime', '' + entry.presentationTime],
                        ['renderTime', '' + entry.render],
                        ['duration', '' + entry.duration],
                        ['navigationId', '' + entry.navigationId]
                    ],
                    }
                }
            });
        }
    });

    icpObserver.observe({ type: 'interaction-contentful-paint', buffered: true, durationThreshold: 0});


})();