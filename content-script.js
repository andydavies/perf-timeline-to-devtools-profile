
(function (){

inpEventCount = 0;

obs = new PerformanceObserver((list) => {

    entries = list.getEntries();
    for (const entry of entries) {
        // debugger;

        if(entry.entryType == 'event' && entry.interactionId > 0) {
            inpEventCount++;

            performance.measure("Input Delay", {
                start: entry.startTime,
                end: entry.processingStart, 
                detail: {
                    devtools: {
                        dataType: "track-entry",
                        track: "INP." + inpEventCount,
                        trackGroup: "INP",
                        color: "primary",
                        tooltipText: 'Input Delay',
                        properties: [
                            ['name', '' + entry.name],
                            ['target', '' + entry.target]
                        ]
                    }
                }
            });
            performance.measure("Processing Time", {
                start: entry.processingStart,
                end: entry.processingEnd, 
                detail: {
                    devtools: {
                        dataType: "track-entry",
                        track: "INP." + inpEventCount,
                        trackGroup: "INP",
                        color: "primary",
                        tooltipText: 'Processing Time',
                        properties: [
                            ['name', '' + entry.name],
                            ['target', '' + entry.target]
                        ]
                    }
                }
            });
            performance.measure("Presentation Delay", {
                start: entry.processingEnd,
                end: entry.startTime + entry.duration, 
                detail: {
                    devtools: {
                        dataType: "track-entry",
                        track: "INP." + inpEventCount,
                        trackGroup: "INP",
                        color: "primary",
                        tooltipText: 'Presentation Delay',
                        properties: [
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
                performance.measure("script", {
                    start: script.startTime,
                    end: script.startTime + script.duration, 
                    detail: {
                        devtools: {
                        dataType: "track-entry",
                        track: "LoAF",
                        trackGroup: "Performance Timeline",
                        color: "secondary",
                        tooltipText: script.sourceURL
                        }
                    }
                });
            }

            performance.measure("LoAF", {
              start: entry.startTime,
              end: entry.startTime + entry.duration, 
              detail: {
                devtools: {
                  dataType: "track-entry",
                  track: "LoAF",
                  trackGroup: "Performance Timeline",
                  color: "primary",
                  tooltipText: 'LoAF'
                }
              }
            });

            if(entry.styleAndLayoutStart > 0) {
                performance.measure("Layout + Paint", {
                    start: entry.styleAndLayoutStart,
                    end: entry.startTime + entry.duration, 
                    detail: {
                    devtools: {
                        dataType: "track-entry",
                        track: "LoAF",
                        trackGroup: "Performance Timeline",
                        color: "secondary-light",
                        tooltipText: 'Layout + Paint'
                    }
                    }
                });
            }
  
        }
        else if (entry.entryType == 'longtask') {
        
            performance.measure("Long Task", {
                start: entry.startTime,
                end: entry.startTime + entry.duration, 
                detail: {
                    devtools: {
                    dataType: "track-entry",
                    track: "Long Task",
                    trackGroup: "Performance Timeline",
                    color: "primary",
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
                    dataType: "track-entry",
                    track: "LCP",
                    trackGroup: "Performance Timeline",
                    color: "primary",
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