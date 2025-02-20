export default function reportWebVitals(onPerfEntry?: (metric: any) => void) {
        if (onPerfEntry && onPerfEntry instanceof Function) {
          import('web-vitals').then((webVitals) => {
            webVitals.onCLS(onPerfEntry);
            webVitals.onFID(onPerfEntry);
            webVitals.onFCP(onPerfEntry);
            webVitals.onLCP(onPerfEntry);
            webVitals.onTTFB(onPerfEntry);
          });
        }
} 