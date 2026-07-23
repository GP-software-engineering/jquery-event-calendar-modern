/**
 * Namespace encapsulating all types, interfaces, and configurations for the jQuery Event Calendar plugin.
 */
export namespace GpsEventCalendar {

    /**
     * Represents a single event object to be rendered on the calendar.
     */
    export interface IEvent {
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
        
        title?: string;
        url?: string;
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
    export interface II18n {
        locale: string;
        monthNames: string[];
        monthNamesShort: string[];
        dayNames: string[];
        dayNamesShort: string[];
        txt_noEvents: string;
        txt_SpecificEvents_prev: string;
        txt_SpecificEvents_after: string;
        txt_next: string;
        txt_prev: string;
        txt_NextEvents: string;
        txt_GoToEventUrl: string;
        txt_loading: string;
        txt_errorLoading?: string;
        txt_undefinedDate: string;
        moment?: any;
    }

    /**
     * Configuration options for initializing the EventCalendar plugin.
     */
    export interface IEventCalendarOptions {
        jsonData: IEvent[] | string;
        cacheJson?: boolean;
        locale?: string;
        i18n?: II18n;
        
        /** 
         * Unix date/time (UTC) or date format (e.g., "YYYY-MM-dd") or null.
         * Forces the calendar to initialize on this specific date.
         */
        startDate?: number | string;

        /** 
         * The default offset in minutes to apply to the passed date/time UTC (if a number). 
         * If this value is null, the local browser time zone will be applied.
         */
        dateTimeOffset?: number;

        eventsLimit?: number;
        showTimeOfEvent?: boolean;
        showDayAsWeeks?: boolean;
        showDaysOfOtherMonths?: boolean;
        startWeekOnMonday?: boolean;
        showDayNameInCalendar?: boolean;
        showEventsWithoutDate?: boolean;
        showDescription?: boolean;
        onlyOneDescription?: boolean;
        showFirstMonthWithEvents?: boolean;
        openEventInNewWindow?: boolean;
        eventsScrollable?: boolean;
        jsonDateFormat?: "timestamp" | "human";
        moveSpeed?: number;
        moveOpacity?: number;

        /**
         * Optional function to build custom HTML for each event in the list.
         * SECURITY WARNING: If you provide a custom builder, YOU are responsible for sanitizing
         * the event data to prevent XSS (Cross-Site Scripting) attacks.
         */
        eventTemplateBuilder?: (event: IEvent, i18nText: II18n) => string;
        
        callbacks?: {
            /** 
             * Fired when the user clicks on a specific day in the grid.
             * @param date The JavaScript Date object representing the clicked day.
             */
            changeDay?: (date: Date) => void;
        };
    }

    export interface ICalendarState {
        year: number;
        month: number;
        day: number;
        direction: "current" | "next" | "prev" | "month" | "day" | "";
    }
}

export interface IEventCalendarPlugin {
    (options?: GpsEventCalendar.IEventCalendarOptions | string, ...args: any[]): JQuery;
    options: GpsEventCalendar.IEventCalendarOptions;
}

declare global {

    /**
     * Defines the structure of the global GpsEventCalendar namespace and localization dictionary.
     */
    interface IGpsEventCalendarGlobal {
        i18n: { [key: string]: GpsEventCalendar.II18n };
    }

    /**
     * Extends the standard browser Window interface.
     */
    interface Window {
        GpsEventCalendar: IGpsEventCalendarGlobal;
    }

    /**
     * Declares the GpsEventCalendar variable in the universal global scope to merge this type into 'globalThis',
     */
    var GpsEventCalendar: IGpsEventCalendarGlobal;

    /**
     * Extends JQuery interface to include the custom eventCalendar plugin method.
     */
    interface JQuery {
        eventCalendar: IEventCalendarPlugin;
    }
}