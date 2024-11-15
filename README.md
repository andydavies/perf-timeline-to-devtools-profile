# perf-timeline-to-devtools-profile
Chrome Extension that creates a custom track in the DevTools Performance Panel populated with entries from the Performance Timeline

Originally created to help visualise the LoAF entries in the context of a Chrome Trace

Registers Performance Observers for the following Events and adds performance.marks / measures anotated with data for DevTools
- LoAF
- LoAF Scripts
- Long Tasks
- LCP
- INP

## Usage

Clone the repo, load as an unpacked extension in Chrome and then profile a page using the performance panel

## Example Output

![Chrome Performance Panel with Custom Track showing Long Tasks, LoAF and LoAF script entries](images/example-output.png)

