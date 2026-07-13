/**
 * Namespace encapsulating all types, interfaces, and configurations for the jQuery Event Calendar plugin.
 */
export declare namespace GpsEventCalendar {
    /**
     * Represents a single event object to be rendered on the calendar.
     */
    interface IEvent {
        /**
         * Date of the event. Can be a Unix timestamp (in milliseconds) or a formatted string.
         * The expected format depends on the `jsonDateFormat` option.
         * @default undefined
         */
        date?: number | string;
        /**
         * Optional offset for the event date calculation (in minutes).
         * Used to handle specific timezones for individual events.
         * @default undefined
         */
        offset?: number;
        /**
         * Title of the event displayed in the events list.
         * @default undefined
         */
        title?: string;
        /**
         * URL to redirect the user when the event title is clicked.
         * @default undefined
         */
        url?: string;
        /**
         * Detailed description of the event, displayed when the title is toggled or clicked.
         * @default undefined
         */
        description?: string;
        /**
         * Indicates if the event is locked (typically displays a padlock or cross icon).
         * @default false
         */
        isLocked?: boolean;
        /**
         * Indicates if the event is special (typically displays an exclamation mark or star icon).
         * @default false
         */
        isSpecial?: boolean;
    }
    /**
     * Localization settings for text strings, date formats, and Moment.js configuration.
     */
    interface II18n {
        /** The locale code identifier (e.g., 'en', 'it', 'de-DE'). */
        locale: string;
        /** Array of full month names (January to December). */
        monthNames: string[];
        /** Array of abbreviated month names (Jan to Dec). */
        monthNamesShort: string[];
        /** Array of full weekday names (Sunday to Saturday). */
        dayNames: string[];
        /** Array of abbreviated weekday names (Sun to Sat). */
        dayNamesShort: string[];
        /** Text displayed when no events are found in the selected period. */
        txt_noEvents: string;
        /** Prefix text displayed before the selected date in the subtitle. */
        txt_SpecificEvents_prev: string;
        /** Suffix text displayed after the selected date in the subtitle. */
        txt_SpecificEvents_after: string;
        /** Aria-label or fallback text for the "Next Month" navigation button. */
        txt_next: string;
        /** Aria-label or fallback text for the "Previous Month" navigation button. */
        txt_prev: string;
        /** Text displayed as a subtitle when showing upcoming events. */
        txt_NextEvents: string;
        /** Text used for the auto-generated "Go to event" link. */
        txt_GoToEventUrl: string;
        /** Text displayed while asynchronous resources (AJAX/JSON/Scripts) are loading. */
        txt_loading: string;
        /** Text displayed when an AJAX request to fetch events fails. */
        txt_errorLoading?: string;
        /** Fallback text displayed when an event lacks a valid date. */
        txt_undefinedDate: string;
        /** Embedded Moment.js localization settings. */
        moment?: any;
    }
    /**
     * Configuration options for initializing the EventCalendar plugin.
     */
    interface IEventCalendarOptions {
        /**
         * Array of event objects or a URL string to fetch events via AJAX.
         * @default []
         */
        jsonData: IEvent[] | string;
        /**
         * If true, caches JSON AJAX results to avoid redundant network calls for the previously fetched months.
         * @default true
         */
        cacheJson?: boolean;
        /**
         * Locale string (e.g., 'en-US', 'it-IT', 'it'). If omitted or invalid, the plugin falls back to the browser's language.
         * @default undefined
         */
        locale?: string;
        /**
         * Internal i18n object containing the loaded translations.
         * @internal Do not set this manually; it is managed by the plugin's localization engine.
         * @default undefined
         */
        i18n?: II18n;
        /**
         * Maximum number of events to display in the list. Use 0 for unlimited.
         * @default 4
         */
        eventsLimit?: number;
        /**
         * If true, displays the time of the event alongside the title.
         * @default true
         */
        showTimeOfEvent?: boolean;
        /**
         * If true, displays the calendar as a grid with weekdays headers.
         * @default true
         */
        showDayAsWeeks?: boolean;
        /**
         * If true, fills the empty grid cells at the beginning and end of the month with dates from adjacent months.
         * @default false
         */
        showDaysOfOtherMonths?: boolean;
        /**
         * If true, the week starts on Monday instead of Sunday.
         * Dynamically overridden by the selected locale's moment.js settings.
         * @default true
         */
        startWeekOnMonday?: boolean;
        /**
         * If true, shows day names in the calendar header. Requires `showDayAsWeeks` to be true.
         * @default true
         */
        showDayNameInCalendar?: boolean;
        /**
         * If true, shows events that have no date specified when no specific day is selected.
         * @default false
         */
        showEventsWithoutDate?: boolean;
        /**
         * If true, event descriptions are visible by default without requiring a click.
         * @default false
         */
        showDescription?: boolean;
        /**
         * If true, opening an event description automatically collapses all others (accordion style).
         * @default true
         */
        onlyOneDescription?: boolean;
        /**
         * If true, initializes the calendar on the first future month containing events instead of the current real-world month.
         * @default false
         */
        showFirstMonthWithEvents?: boolean;
        /**
         * If true, clicking an event URL opens it in a new browser tab (`target="_blank"`).
         * @default false
         */
        openEventInNewWindow?: boolean;
        /**
         * If true, adds a CSS class to make the events list container scrollable.
         * @default false
         */
        eventsScrollable?: boolean;
        /**
         * Specifies the date format in JSON. "timestamp" expects Unix ms, "human" expects 'YYYY-MM-DD HH:MM:SS'.
         * @default "timestamp"
         */
        jsonDateFormat?: "timestamp" | "human";
        /**
         * Speed of the slide animation during month transitions, in milliseconds.
         * @default 500
         */
        moveSpeed?: number;
        /**
         * Opacity level of the month grid and events list during transitions (0.0 to 1.0).
         * @default 0.15
         */
        moveOpacity?: number;
        /**
         * Optional function to build custom HTML for each event in the list.
         * SECURITY WARNING: If you provide a custom builder, YOU are responsible for sanitizing
         * the event data to prevent XSS (Cross-Site Scripting) attacks.
         * @default undefined
         */
        eventTemplateBuilder?: (event: IEvent, i18nText: II18n) => string;
        /**
         * Object containing callback hooks for user interactions.
         */
        callbacks?: {
            /**
             * Fired when the user clicks on a specific day in the grid.
             * @param date The JavaScript Date object representing the clicked day.
             * @default null
             */
            changeDay?: (date: Date) => void;
            /**
             * Fired when the user navigates to a different month using the arrows.
             * @default null
             */
            changeMonth?: () => void;
        };
    }
    /**
     * Tracks the current active state of the calendar view internally.
     */
    interface ICalendarState {
        /** The currently viewed year in the grid. */
        year: number;
        /** The currently viewed month (0-11 index). */
        month: number;
        /** The currently selected day. 0 if viewing the whole month. */
        day: number;
        /** The trigger that caused the last state change. */
        direction: "current" | "next" | "prev" | "month" | "day" | "";
    }
}
/**
 * Extends the jQuery plugin structure to expose public methods and global default options.
 */
export interface IEventCalendarPlugin {
    /**
     * Initializes the plugin or invokes a public method on an existing instance.
     * @param options Configuration object or string representing a public method name (e.g., 'changeLocale', 'destroy').
     * @param args Optional arguments passed to the public method.
     */
    (options?: GpsEventCalendar.IEventCalendarOptions | string, ...args: any[]): JQuery;
    /** Global default options shared across all instances. */
    options: GpsEventCalendar.IEventCalendarOptions;
}
declare global {
    interface Window {
        /** Global namespace for the Event Calendar plugin */
        GpsEventCalendar: {
            /** Dictionary of loaded localizations */
            i18n: {
                [key: string]: GpsEventCalendar.II18n;
            };
        };
    }
    interface JQuery {
        /** Binds the Event Calendar plugin to the matched DOM elements. */
        eventCalendar: IEventCalendarPlugin;
    }
}
