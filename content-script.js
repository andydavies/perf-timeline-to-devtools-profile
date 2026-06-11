// IIFE to avoid polluting global scope
(function (){

    const showLongTasks = false;

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
                            ['paintTime', '' + entry?.paintTime],
                            ['presentationTime', '' + entry?.presentationTime],
                            ['firstUIEventTimestamp', '' + entry.firstUIEventTimestamp],
                            ['blockingDuration', '' + entry.blockingDuration]
                        ]
                    }
                }
            });

            performance.measure('Work', {
                start: entry.startTime,
                end: entry.renderStart, 
                detail: {
                    devtools: {
                        dataType: 'track-entry',
                        track: 'LoAFs',
                        trackGroup: 'Performance Timeline',
                        color: 'secondary-light',
                        tooltipText: 'Work'
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

    if(showLongTasks) {
        longTaskObserver.observe({ type: 'longtask', buffered: true, durationThreshold: 0});
    }

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
                        track: 'Soft Navigation',
                        trackGroup: 'Native SPA',
                        color: 'primary',
                        tooltipText: 'Soft Navigation',
                        properties: [
                            ['name', '' + entry.name],
                            ['entryType', '' + entry.entryType],
                            ['startTime', '' + entry.startTime],
                            ['paintTime', '' + entry?.paintTime],
                            ['presentationTime', '' + entry?.presentationTime],
                            ['duration', '' + entry.duration],
                            ['navigationId', '' + entry.navigationId]
                        ]
                    }
                }
            });
        }
    });

    softNavObserver.observe({ type: "soft-navigation", buffered: true, includeSoftNavigationObservations: true });

    // ICP Track
    icpObserver = new PerformanceObserver((list) => {

        entries = list.getEntries();
        for (const entry of entries) {

            performance.mark('ICP', {
                start: entry.startTime,
                detail: {
                    devtools: {
                    dataType: 'track-entry',
                    track: 'Interaction Contentful Paint',
                    trackGroup: 'Native SPA',
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

    icpObserver.observe({ type: "interaction-contentful-paint", buffered: true, includeSoftNavigationObservations: true });

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if(mutation.addedNodes.length > 0) {
                // Mark nodes added
                performance.mark('Body Nodes Added', {
                    start: performance.now,
                    detail: {
                        devtools: {
                            dataType: 'track-entry',
                            track: 'Body Nodes Added',
                            trackGroup: 'Inferred SPA',
                            color: 'primary',
                            tooltipText: 'Body Nodes Added',
                            properties: [
                                ['addedNodes.length', '' + mutation.addedNodes.length],
                            ]
                        }
                    }
                });
                // Schedule mark for next frame
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        performance.mark('Frame after nodes added', {
                            start: performance.now(),
                            detail: {
                                devtools: {
                                    dataType: 'track-entry',
                                    track: 'rAF after Body Nodes Added',
                                    trackGroup: 'Inferred SPA',
                                    color: 'primary',
                                    tooltipText: 'rAF after Body Nodes Added',
                                    properties: [
                                        ['addedNodes.length', '' + mutation.addedNodes.length],
                                    ]   
                                }
                            }
                        });
                    });
                });

                // Stop listening for more mutations
//                observer.disconnect();

                // Don't need to wait for more mutations
//                break;
            }
        }
    }
    
    // Create an observer instance linked to the callback function
    const mutationObserver = new MutationObserver(callback);
    const targetNode = document.getElementsByTagName('body')[0];
    
    // Navigation API
    navigation.addEventListener("navigate", (event) => {

        // Mark navigation start
        performance.mark('navigate', {
            start: event.timeStamp,
            detail: {
                devtools: {
                    dataType: 'track-entry',
                    track: 'Navigation',
                    trackGroup: 'Inferred SPA',
                    color: 'primary',
                    tooltipText: 'navigation',
                    properties: [
                        ['destination.url', '' + event?.destination.url],
                        ['destination.sameDocument', '' + event?.destination.sameDocument]
                    ]
                }
            }
        });

        // Start observing the target node for configured mutations
        mutationObserver.observe(targetNode, { attributes: false, childList: true, subtree: true });
    });

})();