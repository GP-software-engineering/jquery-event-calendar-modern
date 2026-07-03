"use strict";
/*!
    jquery.eventCalendar.js
    version: 2.0.0
    author: Gianpiero Caretti (@gpcaretti) / Refactored
    company: GP software engineering
    url: https://www.gpsoftware.it
*/
/**
 * Core Class representing an isolated Event Calendar instance.
 */
class EventCalendarInstance {
    $wrap;
    options;
    state;
    cachedEvents = null;
    directionLeftMove = 300;
    constructor(element, options) {
        this.$wrap = $(element);
        this.options = this.mergeOptions(options);
        this.state = { year: 0, month: -1, day: 0, direction: "" };
        this.init();
    }
    mergeOptions(options) {
        const defaults = $.fn.eventCalendar.options;
        return $.extend(true, {}, defaults, options);
    }
    init() {
        this.buildDOMStructure();
        this.attachEventListeners();
        this.directionLeftMove = this.$wrap.width() || 300;
        $(window).on('resize', () => { this.directionLeftMove = this.$wrap.width() || 300; });
        this.renderMonth("current");
        this.fetchAndRenderEvents();
    }
    buildDOMStructure() {
        const loadingTxt = this.options.i18n?.txt_loading || "loading...";
        this.$wrap.addClass('eventCalendar-wrap').html(`
            <div class='eventCalendar-slider'></div>
            <div class='eventCalendar-list-wrap'>
                <p class='eventCalendar-subtitle'></p>
                <span class='eventCalendar-loading'>${loadingTxt}</span>
                <div class='eventCalendar-list-content ${this.options.eventsScrollable ? "scrollable" : ""}'>
                    <ul class='eventCalendar-list'></ul>
                </div>
            </div>
        `);
    }
    attachEventListeners() {
        this.$wrap.on('click', '[name="arrow"]', (e) => {
            e.preventDefault();
            const direction = $(e.currentTarget).attr('data-dir');
            this.changeMonth(direction);
        });
        this.$wrap.on('click', 'li[id^="dayList_"] a', (e) => {
            e.preventDefault();
            const day = parseInt($(e.currentTarget).parent().attr('rel') || "0", 10);
            this.state = { ...this.state, day, direction: 'day' };
            this.fetchAndRenderEvents();
            if (this.options.callbacks?.changeDay) {
                this.options.callbacks.changeDay(new Date(this.state.year, this.state.month, day));
            }
        });
        this.$wrap.on('click', '.eventCalendar-eventTitle', (e) => {
            if (!this.options.showDescription) {
                e.preventDefault();
                const $desc = $(e.currentTarget).siblings('.eventCalendar-eventDesc');
                if (!$desc.find('a.bt').length) {
                    const url = $(e.currentTarget).attr('href');
                    const target = $(e.currentTarget).attr('target') || "_self";
                    const gotoTxt = this.options.i18n?.txt_GoToEventUrl || "Go to event";
                    $desc.append(`<a href="${url}" target="${target}" class="bt">${gotoTxt}</a>`);
                }
                if ($desc.is(':visible')) {
                    $desc.slideUp();
                }
                else {
                    if (this.options.onlyOneDescription) {
                        this.$wrap.find('.eventCalendar-eventDesc').slideUp();
                    }
                    $desc.slideDown();
                }
            }
        });
    }
    changeMonth(direction) {
        this.renderMonth(direction);
        const moveOperator = direction === "next" ? "-=" : "+=";
        const moveOpacity = this.options.moveOpacity ?? 0.15;
        const moveSpeed = this.options.moveSpeed ?? 500;
        this.$wrap.find('.eventCalendar-monthWrap.eventCalendar-oldMonth').animate({
            opacity: moveOpacity,
            left: `${moveOperator}${this.directionLeftMove}`
        }, moveSpeed, function () {
            $(this).remove();
        });
    }
    renderMonth(monthOrDirection) {
        const $slider = this.$wrap.find('.eventCalendar-slider');
        const date = new Date();
        this.$wrap.find('.eventCalendar-monthWrap.eventCalendar-currentMonth')
            .removeClass('eventCalendar-currentMonth')
            .addClass('eventCalendar-oldMonth');
        if (monthOrDirection !== "current") {
            date.setFullYear(this.state.year, this.state.month, 1);
            date.setMonth(date.getMonth() + (monthOrDirection === "prev" ? -1 : 1));
        }
        this.state.year = date.getFullYear();
        this.state.month = date.getMonth();
        const monthTitle = moment(new Date(this.state.year, this.state.month, 1)).format("MMMM YYYY");
        const $newMonthWrap = $(`
            <div class='eventCalendar-monthWrap eventCalendar-currentMonth'>
                <div class='eventCalendar-currentTitle'>
                    <a href='#' class='eventCalendar-monthTitle'>${monthTitle}</a>
                </div>
                <ul class='eventCalendar-daysList ${this.options.showDayAsWeeks ? "eventCalendar-showAsWeek" : ""}'></ul>
            </div>
        `);
        if (monthOrDirection === "current") {
            const txtPrev = this.options.i18n?.txt_prev || "prev";
            const txtNext = this.options.i18n?.txt_next || "next";
            $slider.append(`
                <a name='arrow' data-dir='prev' href='#' class='eventCalendar-arrow eventCalendar-prev'><span>${txtPrev}</span></a>
                <a name='arrow' data-dir='next' href='#' class='eventCalendar-arrow eventCalendar-next'><span>${txtNext}</span></a>
            `);
        }
        const $daysList = $newMonthWrap.find('.eventCalendar-daysList');
        const daysInMonth = new Date(this.state.year, this.state.month + 1, 0).getDate();
        const currentDay = new Date().getDate();
        const isCurrentMonth = date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = isCurrentMonth && day === currentDay ? "today" : "";
            $daysList.append(`<li id='dayList_${day}' rel='${day}' class='eventCalendar-day ${isToday}'><a href='#'>${day}</a></li>`);
        }
        $slider.append($newMonthWrap);
        $slider.css('height', $newMonthWrap.height() + 'px');
        if (monthOrDirection !== "current") {
            this.state.direction = monthOrDirection;
            this.fetchAndRenderEvents();
        }
    }
    fetchAndRenderEvents() {
        this.$wrap.find('.eventCalendar-loading').fadeIn();
        if (typeof this.options.jsonData === "string") {
            if (!this.options.cacheJson || !this.cachedEvents) {
                $.getJSON(`${this.options.jsonData}?limit=${this.options.eventsLimit}&year=${this.state.year}&month=${this.state.month}&day=${this.state.day}`)
                    .done((data) => {
                    this.cachedEvents = data;
                    this.renderEventsList(data);
                })
                    .fail(() => this.$wrap.find('.eventCalendar-loading').text("Error loading events").addClass("error"));
            }
            else {
                this.renderEventsList(this.cachedEvents);
            }
        }
        else {
            this.cachedEvents = this.options.jsonData;
            this.renderEventsList(this.cachedEvents);
        }
    }
    renderEventsList(data) {
        const $list = this.$wrap.find('.eventCalendar-list');
        let htmlEvents = [];
        data.forEach((event, index) => {
            const eventLinkTarget = this.options.openEventInNewWindow ? '_blank' : '_self';
            const eventTitle = event.url
                ? `<a href="${event.url}" target="${eventLinkTarget}" class="eventCalendar-eventTitle clearfix">${event.title}</a>`
                : `<span class="eventCalendar-eventTitle clearfix">${event.title}</span>`;
            const eventDescClass = !this.options.showDescription ? 'eventCalendar-hidden' : '';
            htmlEvents.push(`
                <li id="event_${index}" class="clearfix">
                    ${eventTitle}
                    <div class="eventCalendar-eventDesc ${eventDescClass}">${event.description}</div>
                </li>
            `);
        });
        if (htmlEvents.length === 0) {
            const noEventsTxt = this.options.i18n?.txt_noEvents || "No events";
            htmlEvents.push(`<li class="eventCalendar-noEvents clearfix"><p>${noEventsTxt}</p></li>`);
        }
        this.$wrap.find('.eventCalendar-loading').hide();
        const moveSpeed = this.options.moveSpeed ?? 500;
        $list.html(htmlEvents.join('')).hide().fadeIn(moveSpeed);
    }
}
// ============================================================================
// JQUERY PLUGIN ATTACHMENT
// ============================================================================
const pluginFn = function (options) {
    return this.each(function () {
        if (!$.data(this, "plugin_eventCalendar")) {
            $.data(this, "plugin_eventCalendar", new EventCalendarInstance(this, options || { jsonData: [] }));
        }
    });
};
// Default Global Options
pluginFn.options = {
    jsonData: [],
    eventsLimit: 4,
    localeKey: "en-US",
    showTimeOfEvent: true,
    showDayAsWeeks: true,
    showDescription: false,
    moveSpeed: 500,
    moveOpacity: 0.15
};
$.fn.eventCalendar = pluginFn;
