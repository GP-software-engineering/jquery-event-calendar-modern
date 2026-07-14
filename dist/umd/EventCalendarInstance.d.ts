import { GpsEventCalendar as Types } from "./types";
export declare namespace GpsEventCalendar {
    /**
     * Core Class representing an isolated Event Calendar instance.
     */
    class EventCalendarInstance {
        private $wrap;
        private options;
        private state;
        private cachedEvents;
        private directionLeftMove;
        private instanceId;
        private eventNamespace;
        constructor(element: HTMLElement, options: Types.IEventCalendarOptions);
        private escapeHtml;
        /**
         * Extracts and parses the event date based on the plugin configuration.
         * Restored dateTimeOffset logic from the legacy plugin.
         */
        private extractEventDate;
        destroy(): void;
        changeLocale(newLocale: string): void;
        private mergeOptions;
        private init;
        private resolveLocale;
        private applyFirstMonthWithEvents;
        private applyLocaleAndRender;
        private applyActualLocale;
        private buildDOMStructure;
        private attachEventListeners;
        private changeMonth;
        private renderMonth;
        private updateSubtitle;
        private fetchAndRenderEvents;
        private markDaysWithEvents;
        private renderEventsList;
    }
}
