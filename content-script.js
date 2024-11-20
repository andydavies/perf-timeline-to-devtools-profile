
(function (){

inpEventCount = 0;

obs = new PerformanceObserver((list) => {

    entries = list.getEntries();
    for (const entry of entries) {
        // debugger;

        if(entry.entryType == 'event' && entry.interactionId > 0) {
            inpEventCount++;

            performance.measure('Input Delay', {
                start: entry.startTime,
                end: entry.processingStart, 
                detail: {
                    devtools: {
                        dataType: 'track-entry',
                        track: 'INP.' + inpEventCount,
                        trackGroup: 'INP',
                        color: 'primary-light',
                        tooltipText: 'Input Delay',
                        properties: [
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
                        track: 'INP.' + inpEventCount,
                        trackGroup: 'INP',
                        color: 'primary',
                        tooltipText: 'Processing Time',
                        properties: [
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
                        track: 'INP.' + inpEventCount,
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
        else if (entry.entryType == 'long-animation-frame') {

            // Set script entries before LoAF so Chrome can display them in the right order
            for(const script of entry.scripts) {
                performance.measure('script', {
                    start: script.startTime,
                    end: script.startTime + script.duration, 
                    detail: {
                        devtools: {
                            dataType: 'track-entry',
                            track: 'LoAF',
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
                  track: 'LoAF',
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
                performance.measure('Rendering', {
                    start: entry.renderStart,
                    end: entry.startTime + entry.duration, 
                    detail: {
                        devtools: {
                            dataType: 'track-entry',
                            track: 'LoAF',
                            trackGroup: 'Performance Timeline',
                            color: 'secondary-light',
                            tooltipText: 'Rendering'
                        }
                    }
                });
            }
  
        }
        else if (entry.entryType == 'longtask') {
        
            performance.measure('Long Task', {
                start: entry.startTime,
                end: entry.startTime + entry.duration, 
                detail: {
                    devtools: {
                    dataType: 'track-entry',
                    track: 'Long Task',
                    trackGroup: 'Performance Timeline',
                    color: 'primary',
                    tooltipText: 'Long Task'
                    }
                }
            });
        }
        else if (entry.entryType == 'largest-contentful-paint') {

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
    }
});

for (const type of ['event', 'largest-contentful-paint', 'long-animation-frame', 'longtask']) {
    obs.observe({ type, buffered: true, durationThreshold: 0, includeSoftNavigationObservations: true });
}

})();