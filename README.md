# 📅 jQuery Event Calendar

[![npm version](https://img.shields.io/npm/v/@gpsoftware/jquery-event-calendar.svg?color=blue)](https://www.npmjs.com/package/@gpsoftware/jquery-event-calendar)
[![npm downloads](https://img.shields.io/npm/dt/@gpsoftware/jquery-event-calendar.svg)](https://www.npmjs.com/package/@gpsoftware/jquery-event-calendar)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> A robust, lightweight, and fully responsive Event Calendar plugin for jQuery.
> Originally branched from v0.7 by Jaime Fernandez, this plugin has been completely refactored in modern TypeScript using Object-Oriented Programming principles to ensure strict typing, isolated instances, and ease of maintenance.

#### 👉 [Documentation and live demo](https://GP-software-engineering.github.io/jquery-event-calendar/)

#### 👉 [What's new](https://github.com/GP-software-engineering/jquery-event-calendar/blob/main/WHATSNEW.md)

#### 👉 [Direct link to the live demo](https://GP-software-engineering.github.io/jquery-event-calendar/examples/index.html)

---

## ✨ Features

* **JSON Driven**: Load events statically via arrays or dynamically via AJAX.
* **Modern Localization**: Global namespace-driven `i18n` with auto-fallback and runtime language switching.
* **Isolated Instances & Memory Safety**: Safely initialize, update, and `destroy()` multiple independent calendars on the same page without memory leaks.
* **Responsive & Mobile Ready**: Automatically adapts to container widths and features native **Swipe support** to navigate months on touch devices.
* **Custom Event Templates**: Fully customizable HTML rendering for events with built-in or custom XSS-safe builders.
* **Customizable Styles**: Uses CSS Custom Properties (`:root` variables) for seamless theming and Dark Mode.
* **Accessibility (A11y) Compliant**: Fully navigable via Tab, Enter, and Space keys. Features dynamic `aria-selected` and `aria-current` attributes for Screen Readers.

## 🚀 Installation

You can install the package via NPM:

```bash
npm install @gpsoftware/jquery-event-calendar
```

or you can include the plugin by grabbing the compiled JavaScript from the `/dist` folder.

**Dependencies required:**

* jQuery (v3.0+)
* Moment.js

```html
<!-- Core CSS -->
<link rel="stylesheet" href="css/eventCalendar.css">

<!-- Dependencies -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js"></script>

<!-- Core Plugin and Unified Locales -->
<script src="dist/umd/jquery.eventCalendar.js"></script>
<script src="dist/locales/all.min.js"></script>
```

**Include the Styles:**

You can use the pre-compiled CSS from the `dist/css` folder, or import the SCSS file directly into your build pipeline to override the default Sass variables (colors, borders, etc.):

```html
<link rel="stylesheet" href="dist/css/eventCalendar.css">
```

## 🛠️ Quick Start

Initialize the calendar by targeting an empty `<div>` and passing your options.
The plugin accepts events either as a static JavaScript array or as a URL string to fetch JSON via AJAX.<br>
Events must adhere to the IEvent interface:

```JavaScript
const myEvents = [
    {
        date: "2024-12-25 10:00:00",    // Date format depends on `jsonDateFormat` option
        title: "Christmas Track Day",   // Display name
        url: "https://example.com",     // Optional link
        description: "Join us on the track for Christmas!", 
        isLocked: false,                // Show the "cross" icon on the calendar
        isSpecial: true                 // Show the "exclamation" coin icon
    }
];

// Initialize
$('#myCalendar').eventCalendar({
    jsonData: myEvents,
    jsonDateFormat: "human", // "human" parses YYYY-MM-DD HH:MM:SS. "timestamp" parses unix ms.
    locale: "en-US",         // Forces English. If omitted, falls back to the browser's language.
    showDescription: true,
    openEventInNewWindow: true
});
```

#### Asynchronous Loading (AJAX)

If you pass a URL string instead of an array, the plugin will make a GET request to your server. It automatically appends current calendar state parameters so your backend can return paginated data:

```
GET /api/events?limit=4&year=2024&month=11&day=0
```

```JavaScript
$('#myCalendar').eventCalendar({
    jsonData: "/api/events",
    cacheJson: false // Set to false to trigger a new AJAX call every time the user changes the month
});
```

#### 🌍 **Internationalization (i18n)**

jQuery Event Calendar comes with a modern, namespace-driven localization system (``GpsEventCalendar.i18n``). You can load all languages at once using `all.min.js`, or load specific ones (e.g., `it-IT.js`).

Unlike older versions, ​**you do not need to manually pass the i18n object**​. Just define the `locale` property:

```html
<script src="dist/umd/jquery.eventCalendar.js"></script>
<script src="dist/locales/it-IT.js"></script>

<script>
  $(document).ready(function() {$("#calendar-wrapper").eventCalendar({
      jsonData: myEvents,
      // Just pass the locale code. The plugin will auto-resolve it from the global namespace!
      // It also supports smart fallbacks (e.g., passing 'it' will automatically resolve to 'it-IT').
      locale: 'it'
    });
  });
</script>
```

#### ⚡ **Runtime API Methods**

You can interact with an already initialized calendar using the public method dispatcher. Currently, you can change the calendar language on the fly without reloading the page or re-fetching events:

```JavaScript
// Change the language to Spanish dynamically (proper locale must be loaded)
$('#myCalendar').eventCalendar('changeLocale', 'es-ES');
```

**Destroy the instance safely:**
If you need to remove the calendar (e.g., in a Single Page Application), use the `destroy` method to safely unbind all events and prevent memory leaks:

```JavaScript
$('#myCalendar').eventCalendar('destroy');
```

#### 🧩 **Custom Event Templates (Advanced)**

If you want to render a completely custom UI for the events in the list (e.g., injecting images, custom buttons, or badges), you can pass an `eventTemplateBuilder` function in the options.

> ⚠️ **SECURITY WARNING:** When overriding the internal builder, the plugin bypasses its native HTML sanitization. You **must** sanitize the event data (`event.title`, `event.description`, etc.) to prevent XSS attacks if the data comes from a user or external API.

```JavaScript
$('#myCalendar').eventCalendar({
    jsonData: myEvents,
    eventTemplateBuilder: function(event, i18nText) {
        // Build your completely custom HTML structure
        return `
            <li class="custom-event-card">
                <h4>${escapeHtml(event.title)}</h4>
                <p>${escapeHtml(event.description)}</p>
                <button onclick="bookCourse('${escapeHtml(event.url)}')">Book Now</button>
            </li>
        `;
    }
});

// A simple utility to sanitize strings
function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
```

#### 🎨 Theming & Dark Mode (CSS Native Variables)

Version 2.0+ adopts CSS Custom Properties (`:root` variables) for styling. This makes the calendar easy to theme without needing to compile SCSS!

**Dark Mode is supported out-of-the-box.** The calendar automatically detects the user's OS preferences `(prefers-color-scheme: dark)` and flips the color palette seamlessly.

**How to force a mode**

If you want to force a mode regardless the local OS configuration, you can use this js code:

```JavaScript
// Toggle theme and enforce it globally
const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
document.documentElement.setAttribute('data-theme', newTheme);
```

**Custom theme**

If you want to create a custom theme or integrate the calendar into your brand colors, simply override the CSS variables in your own stylesheet:

```css
/* Your custom stylesheet (loaded after eventCalendar.css) */
:root {
    /* Change the main theme color to purple */
    --ec-title-bg: #6f42c1;
    --ec-event-title-color: #6f42c1;
    
    /* Change the current day highlight to red */
    --ec-today-bg: #dc3545;
}
```

Here is the list of the most commonly modified variables:

- `--ec-title-bg`: Background color of the top bar (Month/Year)
- `--ec-event-title-color`: Text color for events in the list
- `--ec-today-bg`: Highlight color for the current day
- `--ec-event-bg`: Highlight color for days containing events

---

## 🤝 Development & Contributing

If you want to contribute or modify the source:

1. Clone the repository.
2. Run `npm install` to grab all development dependencies.
3. Run `npm run build` to compile the TypeScript files into the `/dist` folder.
4. Run `npm run test` to execute the Jest test suites.

Maintained with ❤️ by GP Software Engineering.

