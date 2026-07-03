/*!
    jquery.eventCalendar.js
    version: 2.0.0
    author: Gianpiero Caretti (@gpcaretti) / Refactored
    company: GP software engineering
    url: https://www.gpsoftware.it
*/
declare const moment: any;
declare namespace EventCalendar {
    interface IEvent {
        date?: number | string;
        offset?: number;
        title?: string;
        url?: string;
        description?: string;
        isLocked?: boolean;
        isSpecial?: boolean;
    }
    interface II18n {
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
        txt_undefinedDate: string;
        moment?: any;
    }
    interface IEventCalendarOptions {
        jsonData: IEvent[] | string;
        cacheJson?: boolean;
        localeKey?: string;
        i18n?: II18n;
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
        callbacks?: {
            changeDay?: (date: Date) => void;
            changeMonth?: () => void;
        };
    }
}
interface IEventCalendarPlugin {
    (options?: EventCalendar.IEventCalendarOptions): JQuery;
    options: EventCalendar.IEventCalendarOptions;
}
interface JQuery {
    eventCalendar: IEventCalendarPlugin;
}
interface ICalendarState {
    year: number;
    month: number;
    day: number;
    direction: "current" | "next" | "prev" | "month" | "day" | "";
}
/**
 * Core Class representing an isolated Event Calendar instance.
 */
declare class EventCalendarInstance {
    private $wrap;
    private options;
    private state;
    private cachedEvents;
    private directionLeftMove;
    constructor(element: HTMLElement, options: EventCalendar.IEventCalendarOptions);
    private mergeOptions;
    private init;
    private buildDOMStructure;
    private attachEventListeners;
    private changeMonth;
    private renderMonth;
    private fetchAndRenderEvents;
    private renderEventsList;
}
declare const pluginFn: IEventCalendarPlugin;
