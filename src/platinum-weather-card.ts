/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { HomeAssistant, LovelaceCardEditor, getLovelace, debounce, hasAction, handleAction } from 'custom-card-helpers';
import { stringComputeStateDisplay } from './compute_state_display';

//tjl add ifDefined in support of tap action
import { ifDefined } from "lit/directives/if-defined";
import { unsafeHTML } from "lit/directives/unsafe-html";

//tjl add HassFormatentity state formatting
//  This is the new method for formatting state data to the user and includes localization from user's profile.
//  https://developers.home-assistant.io/blog/2023/08/29/hass-format-state/
//  https://developers.home-assistant.io/docs/frontend/data/#entity-state-formatting
import type { timeFormat, WeatherCardConfig, HassFormatEntityState } from './types';

//tjl add subscribeForecast, ForecastEvent in support of 2023.9 method of getting forecasts data.
//  From  https://github.com/bramkragten/weather-card/blob/master/dist/weather-card.js
import { ForecastEvent, subscribeForecast, getForecast, ForecastAttribute } from './weather';

import { CARD_VERSION } from './const';


/* eslint no-console: 0 */
console.info(
  `%c  PLATINUM-WEATHER-CARD-TL  \n%c  Version ${CARD_VERSION}          `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'platinum-weather-card-plus-charts',
  name: 'Platinum Weather Card Plus Charts',
  description: 'An fully customisable weather card with a GUI configuration',
});


@customElement('platinum-weather-card-plus-charts')
export class PlatinumWeatherCard extends LitElement {
  //tjl from bramkragten
  static get properties() {
    return {
      _config: {},
      _forecastEvent: {},
      hass: {},
    };
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('platinum-weather-card-plus-charts-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  //tjl copied from HA front-end.  Supports subscribing to weather forecast events.
  //  https://github/homeassistant/frontend/src/panels/lovelace/cards/hui-weather-forecast-card.ts
  @state() private _subscribed?: Promise<() => void>;
  @state() private _forecastEvent?: ForecastEvent;

  // https://lit.dev/docs/components/properties/
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: WeatherCardConfig;

  private _resizeObserver!: ResizeObserver;

  @state() private _cardWidth = 492;

  private _error: string[] = [];

  //tjl added. 
  //  forecast1 is THE entity to subscribe for weather forecast events
  private forecast1!: ForecastAttribute[] | undefined;
  private hassExtended!: HassFormatEntityState;

  public getCardSize(): number {


    // Get the heights of each section
    const overiewSectionHeight = this._getCardSizeOverviewSection();
    const extendedSectionHeight = this._getCardSizeExtendedSection();
    const slotsSectionHeight = this._getCardSizeSlotsSection();
    const dailyForecastSectionHeight = this._getCardSizeDailyForecastSection();

    // Estimate the card height in pixels
    // Start with the value of the top/bottom borders (minimum card height) and add all the section heights
    const cardHeight = 16 + overiewSectionHeight + extendedSectionHeight + slotsSectionHeight + dailyForecastSectionHeight;

    // Now calculate an estimated cardsize
    const cardSize = Math.ceil(cardHeight / 50);


    return cardSize;
  }

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: WeatherCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    // ── Entity ID format: domain.object_id ─────────────────────────────────
    const entityIdPattern = /^[a-z0-9_]+\.[a-z0-9_]+$/;
    const entityFields = [
      'weather_entity', 'entity_temperature', 'entity_apparent_temp',
      'entity_forecast_icon', 'entity_summary', 'entity_extended',
      'entity_humidity', 'entity_pressure', 'entity_visibility',
      'entity_wind_bearing', 'entity_wind_speed', 'entity_wind_gust',
      'entity_wind_speed_kt', 'entity_wind_gust_kt',
      'entity_temp_next', 'entity_temp_following',
      'entity_forecast_max', 'entity_forecast_min',
      'entity_observed_max', 'entity_observed_min',
      'entity_fire_danger', 'entity_pop', 'entity_pos',
      'entity_sun', 'entity_moon', 'entity_uv_alert_summary',
      'entity_rainfall', 'entity_update_time',
    ] as const;
    for (const field of entityFields) {
      const value = config[field as keyof WeatherCardConfig];
      if (value && typeof value === 'string' && !entityIdPattern.test(value)) {
        throw new Error(
          `platinum-weather-card-plus-charts: "${field}" has invalid entity ID format: "${value}". ` +
          `Expected format: domain.object_id (e.g. sensor.temperature).`
        );
      }
    }

    // ── section_order: only valid section names ────────────────────────────
    const validSections = ['overview', 'extended', 'slots', 'daily_forecast', 'charts'];
    if (config.section_order) {
      if (!Array.isArray(config.section_order)) {
        throw new Error('platinum-weather-card: section_order must be an array.');
      }
      for (const section of config.section_order) {
        if (!validSections.includes(section)) {
          throw new Error(
            `platinum-weather-card-plus-charts: invalid section "${section}" in section_order. ` +
            `Valid values: ${validSections.join(', ')}.`
          );
        }
      }
    }

    // ── daily_forecast_days: integer 1–7 ──────────────────────────────────
    if (config.daily_forecast_days !== undefined) {
      const days = Number(config.daily_forecast_days);
      if (!Number.isInteger(days) || days < 1 || days > 7) {
        throw new Error(
          `platinum-weather-card-plus-charts: daily_forecast_days must be an integer between 1 and 7, got "${config.daily_forecast_days}".`
        );
      }
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this._config = {
      name: 'Weather',
      forecast_type: 'daily',  // default if not provided
      ...config,
    };
  }


  //tjl from bramkragten's weather-card 
  //  Change bramkragtent config check for "forecast" to "weather_entity"
  //  weather_entity is a new config. It is THE weather entity used to get forecast data
  _needForecastSubscription() {
    return (
      this._config &&
      this._config.weather_entity &&
      this._config.forecast_type &&
      this._config.forecast_type !== "legacy"
    );
  }

  //tjl copy from bramkragten's weather-card
  _unsubscribeForecastEvents() {
    if (this._subscribed) {
      this._subscribed.then((unsub) => unsub());
      this._subscribed = undefined;
    }
  }


  //tjl copy/modified from bramkragten weather-card
  async _subscribeForecastEvents() {
    this._unsubscribeForecastEvents();
    if (
      !this.isConnected ||
      !this.hass ||
      !this._config ||
      !this._needForecastSubscription()
    ) {
      return;
    }

//  //tjl - from bramkragten's weather card. Couldn't get this to build
//  this._subscribed = this.hass.connection.subscribeMessage(
//    (event) => {
//      this._forecastEvent = event;
//    },
//    {
//      type: "weather/subscribe_forecast",
//      forecast_type: this._config.forecast_type,
//      entity_id: this._config.weather_entity,
//    }
//  );
    //tjl - but could build this.  
    //  https://github/homeassistant/frontend/src/panels/lovelace/cards/hui-weather-forecast-card.ts
    //  Change "entity" (?:string) to new weather_entity type (string only)
    //  Note: forecast_type required to be set.
    //  Note: forecast_type daily supported by this card but not hourly nor twice_daily 
    if (!this.hass || !this._config) return;
    this._subscribed = subscribeForecast(
      this.hass,
    //this._config.entity,
      this._config.weather_entity,
      this._config.forecast_type as "daily" | "hourly" | "twice_daily",
      (event) => {
        this._forecastEvent = event;
      }
    );
  }


  //tjl from bramkragten's weather-card
  // Stable bound references so removeEventListener can find them
  private _boundPointerDown = this._onPointerDown.bind(this);
  private _boundPointerCancel = this._onPointerCancel.bind(this);
  private _boundCardClick = this._onCardClick.bind(this);

  connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated && this._config && this.hass) {
      this._subscribeForecastEvents();
    }
    this.addEventListener('pointerdown', this._boundPointerDown);
    this.addEventListener('pointercancel', this._boundPointerCancel);
    this.addEventListener('click', this._boundCardClick);
  }


  //tjl from bramkragten's weather-card
  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribeForecastEvents();
    this.removeEventListener('pointerdown', this._boundPointerDown);
    this.removeEventListener('pointercancel', this._boundPointerCancel);
    this.removeEventListener('click', this._boundCardClick);
    clearTimeout(this._pHoldTimer); clearTimeout(this._clickTimer);
  }


  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  // tjl - tweak to match forecastEvent checks in hasConfigOrEntityChanged in bramkragten's weather-card
  //   See also: https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/common/has-changed.ts
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) {
      return false;
    }
    //tjl from hasConfigOrEntityChanged
    if (changedProps.has("_config") || changedProps.has("_forecastEvent")) {
      return true;
    }

    //tjl from hasConfigOrEntityChanged w. inverted logic
    if (changedProps.has("hass")) {
      return true;
    }

    const oldHass = changedProps.get("hass") as HomeAssistant || undefined;

    if (
      !oldHass ||
      oldHass.themes !== this.hass.themes ||
      oldHass.locale !== this.hass.locale
    ) {
      return true;
    }



    // Check if any entities mentioned in the config have changed
    if (Object.keys(this._config).every(entity => {
      if (entity.match(/^entity_/) !== null) {
        if (oldHass.states[this._config[entity]] !== this.hass.states[this._config[entity]]) {
          return false;
        }
      }
      return true;
    }) === false) {
      return true;
    }

    // check if any of the calculated forecast entities have changed, but only if the daily slot is shown
    if (this._config.show_section_daily_forecast) {
      const days = this._config.daily_forecast_days || 5;
      for (const entity of ['entity_forecast_icon_1', 'entity_summary_1', 'entity_forecast_min_1', 'entity_forecast_max_1', 'entity_pop_1', 'entity_pos_1']) {
        if ((this._config[entity] !== undefined) && (this._config[entity].match('^weather.') === null)) {
          // check there is a number in the name
          const start = this._config[entity].match(/(\d+)(?!.*\d)/g);
          if (start) {
            // has a number so now check all the extra entities exist
            for (var _i = 1; _i < days; _i++) {
              const newEntity = this._config[entity].replace(/(\d+)(?!.*\d)/g, Number(start) + _i);
              if (oldHass.states[newEntity] !== this.hass.states[newEntity]) {
                return true;
              }
            }
          }
        }
      }
    }

    return changedProps.has('config');
  }

  //tjl from bramkragten's weather-card
  updated(changedProps) {
    if (!this.hass || !this._config) {
      return;
    }
    if (changedProps.has("_config") || !this._subscribed) {
      this._subscribeForecastEvents();
    }
  }

  protected firstUpdated(): void {
    this._resize();
    this._attachObserver();
  }

  private _attachObserver() {
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(
        debounce(() => this._resize(), 250, false)
      );
    }
    // Watch for changes in size
    const card = this.shadowRoot?.querySelector('ha-card');
    // If we show an error or warning there is no ha-card
    if (!card) {
      return;
    }
    // this._resizeObserver.observe(card);
    this._resizeObserver.observe(this);
  }

  private _resize() {
    if (!this.isConnected) {
      return;
    }

    const card = this.shadowRoot?.querySelector('ha-card');
    if (!card) return;
    this._cardWidth = card.getBoundingClientRect().width;
  }

  private _checkForErrors(): boolean {
    this._error = [];
    Object.keys(this._config).forEach(entity => {
      if (entity.match(/^entity_/) !== null) {
        if (this.hass.states[this._config[entity]] === undefined) {
          this._error.push(`'${entity}=${this._config[entity]}' not found`);
        }
      }
    });
    // tjl - build warning - says "days" never used, so for now comment it out

    //tjl add a few more configs to check if they are weather entities.
    for (const entityName of ['entity_forecast_icon_1', 'entity_summary_1', 'entity_forecast_min_1', 'entity_forecast_max_1', 
      'entity_pop_1', 'entity_pos_1', 'entity_extended_1']) {
      if (this._config[entityName] !== undefined) {
        // tjl - build warning - says "entity" never used, so for now comment it out
      //const entity = this.hass.states[this._config[entityName]];

        // check if we have a weather domain as the entity
        if (this._config[entityName].match('^weather.')) {
          // we are dealing with the weather domain

          //tjl using new forecast subscribe method.
          //  If any of the entityName items are weather entities, then user needs to configure a weather_entity 
          //    and the entityName item must be the same as weather_entity configuration.
          if ( this.hass.states[this._config.weather_entity] === undefined ) {
            this._error.push(`'weather_entity needs to be defined (not found).`);
            break;
          } else if ( this._config[entityName] !== this._config.weather_entity ) {
            this._error.push(`'${entityName} needs to be the same as weather_entity.`);
            break;
          }
          const forecast = this.forecast1;
          if (forecast !== undefined ) {

            // check that attributes exist for the first day
            const forecastDate = new Date();
            forecastDate.setDate(forecastDate.getDate() + 1);
            switch (entityName) {
              //tjl use new forecast subscribe method below
              case 'entity_forecast_icon_1':
                if (this._getForecastPropFromWeather(forecast, forecastDate, 'condition') === undefined) {
              //if (this._getForecastPropFromWeather(entity.attributes.forecast, forecastDate, 'condition') === undefined) {}
                  this._error.push(`'${entityName} attribute forecast[1].condition not found`);
                }
                break
              case 'entity_forecast_min_1':
                if (this._getForecastPropFromWeather(forecast, forecastDate, 'templow') === undefined) {
              //if (this._getForecastPropFromWeather(entity.attributes.forecast, forecastDate, 'templow') === undefined) {}
                  this._error.push(`'${entityName} attribute forecast[1].templow not found`);
                }
                break
              case 'entity_forecast_max_1':
                if (this._getForecastPropFromWeather(forecast, forecastDate, 'temperature') === undefined) {
              //if (this._getForecastPropFromWeather(entity.attributes.forecast, forecastDate, 'temperature') === undefined) {}
                  this._error.push(`'${entityName} attribute forecast[1].temperature not found`);
                }
                break;
              case 'entity_pop_1':
                if (this._getForecastPropFromWeather(forecast, forecastDate, 'precipitation_probability') === undefined) {
              //if (this._getForecastPropFromWeather(entity.attributes.forecast, forecastDate, 'precipitation_probability') === undefined) {}
                  this._error.push(`'${entityName} attribute forecast[1].precipitation_probability not found`);
                }
                break;
              case 'entity_pos_1':
                if (this._getForecastPropFromWeather(forecast, forecastDate, 'precipitation') === undefined) {
              //if (this._getForecastPropFromWeather(entity.attributes.forecast, forecastDate, 'precipitation') === undefined) {}
                  this._error.push(`'${entityName} attribute forecast[1].precipitation not found`);
                }
                break;
            }  
          }
        } else {
          // we are dealing with the sensor domain
          // check there is a number in the name (needed for day-increment pattern)
          // Note: we intentionally do NOT check if entity+1 exists — this causes
          // false positives for sensors with multi-digit numbers (e.g. ivarna103_*)
          // or when some forecast day sensors are deliberately disabled.
          const start = this._config[entityName].match(/(\d+)(?!.*\d)/g);
          if (!start) {
            this._error.push(`'${entityName}=${this._config[entityName]}' value needs to have a number`);
          }
        }
      }
    }
      //tjl add warning if new method for getting forecast is used and forecast_type not 'daily'
      if (this._config.weather_entity !== undefined ) {
        if ( this._config.forecast_type !== undefined ) {
          if ( !['daily','hourly','twice_daily'].includes(this._config.forecast_type)) {
            this._error.push(`'forecast_type must be daily, hourly, or twice_daily`);
          }
        } else {  
            this._error.push(`'forecast_type needs to be configured.`);
        }
      }
    return this._error.length !== 0;
  }



  private _renderUpdateTime(): TemplateResult {
    if ((this._config.entity_update_time) && (this.hass.states[this._config.entity_update_time]) && (this.hass.states[this._config.entity_update_time].state !== undefined)) {
      if (this._config.update_time_use_attr === true) {
        if (this._config.update_time_name_attr !== undefined) {
          const attribute = this._config.update_time_name_attr.toLowerCase().split(".").reduce((retval, value) => retval !== undefined ? retval[value] : undefined, this.hass.states[this._config.entity_update_time].attributes);
          if (attribute !== undefined) {
            const d = new Date(`${attribute}`);
            switch (this.timeFormat) {
              case '12hour':
                return html`${d.toLocaleString(this.locale || navigator.language, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" ", "") + ", " + this._formatDate(d)}`;
              case '24hour':
                return html`${d.toLocaleString(this.locale || navigator.language, { hour: '2-digit', minute: '2-digit', hour12: false }) + ", " + this._formatDate(d)}`;
              case 'system':
                return html`${d.toLocaleTimeString(this.locale || navigator.language, { timeStyle: 'short' }).replace(" ", "") + ", " + this._formatDate(d)}`;
            }
          }
        }
      } else {
        const d = new Date(this.hass.states[this._config.entity_update_time].state);
        switch (this.timeFormat) {
          case '12hour':
            return html`${d.toLocaleString(this.locale || navigator.language, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" ", "") + ", " + this._formatDate(d)}`;
          case '24hour':
            return html`${d.toLocaleString(this.locale || navigator.language, { hour: '2-digit', minute: '2-digit', hour12: false }) + ", " + this._formatDate(d)}`;
          case 'system':
            return html`${d.toLocaleTimeString(this.locale || navigator.language, { timeStyle: 'short' }).replace(" ", "") + ", " + this._formatDate(d)}`;
        }
      }
    }
    return html`---`;
  }

  private _renderCompleteOverviewSection(): TemplateResult {
    if (this._config?.show_section_overview === false) return html``;

    const weatherIcon = this._weatherIcon(this.forecastIcon);
    const url = { href: this._getIconUrl(weatherIcon) };
    const hoverText = weatherIcon !== 'unknown' ? '' : `Unknown condition\n${this.forecastIcon}`;
    const unknownDiv = weatherIcon !== 'unknown' ? html`` : html`<div class="unknown-forecast">${this.forecastIcon}</div>`;
    const biggerIcon = html`<div class="big-icon"><img src="${url.href}" width="100%" height="100%" title="${hoverText}"></div>`;

    const currentTemp = html`
      <div class="current-temp">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="unit-temp-big">${this.getUOM('temperature')}</div>
      </div>
    `;

    const apparent = this.currentApparentTemperature;
    const apparentTemp = apparent != '' ? html`
      <div class="apparent-temp">
        <div class="apparent">${this.localeTextFeelsLike}&nbsp;${apparent}</div>
        <div class="unit-temp-small"> ${this.getUOM('temperature')}</div>
      </div>
    ` : html``;

    const separator = this._config.option_show_overview_separator === true ? html`<hr class=line>` : ``;

  //tjl use the new formatEntityState method for formatting an entity's presentation state (sunny to Sunny).
    const forecastText = (this._config.entity_summary) && (this.hass.states[this._config.entity_summary]) ?
      html`<div class="forecast-text">${this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary])}</div>` ?? html`<div class="forecast-text">---</div>` : html``;
    //html`<div class="forecast-text">${entityComputeStateDisplay(this.hass.localize, this.hass.states[this._config.entity_summary], getLocale(this.hass))}</div>` ?? html`<div class="forecast-text">---</div>` : html``;

    return html`
      <div class="overview-section section">
        ${this._config.text_card_title ? html`<div class="card-header">${this._config.text_card_title}</div>` : html``}
        ${this._config.text_card_title_2 ? html`<div class="card-header">${this._config.text_card_title_2}</div>` : html``}
        ${this._config.entity_update_time ? html`<div class="updated">${this._config.text_update_time_prefix ? this._config.text_update_time_prefix + ' ' : ''}${this._renderUpdateTime()}</div>` : html``}
        <div class="overview-top">
          <div class="top-left">${biggerIcon}${unknownDiv}</div>
          <div class="currentTemps">${currentTemp}${apparentTemp}</div>
        </div>
        ${forecastText}
        ${separator}
      </div>
    `;
  }

  private _renderObservationsOverviewSection(): TemplateResult {
    if (this._config?.show_section_overview === false) return html``;

    const stack = (this._cardWidth >= 344) ? ' stacked' : '';

    const currentTemp = html`
      <div class="current-temp">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="unit-temp-big">${this.getUOM('temperature')}</div>
      </div>
    `;

    const apparent = this.currentApparentTemperature;
    const apparentTemp = apparent != '' ? html`
      <div class="apparent-temp">
        <div class="apparent">${this.localeTextFeelsLike}&nbsp;${apparent}</div>
        <div class="unit-temp-small"> ${this.getUOM('temperature')}</div>
      </div>
    ` : html``;

    const separator = this._config.option_show_overview_separator === true ? html`<hr class=line>` : ``;

    return html`
      <div class="overview-section section${stack}">
        ${this._config.text_card_title ? html`<div class="card-header">${this._config.text_card_title}</div>` : html``}
        ${this._config.text_card_title_2 ? html`<div class="card-header">${this._config.text_card_title_2}</div>` : html``}
        ${this._config.entity_update_time ? html`<div class="updated">${this._config.text_update_time_prefix ? this._config.text_update_time_prefix + ' ' : ''}${this._renderUpdateTime()}</div>` : html``}
      </div>
      <div class="overview-section section">
        <div class="overview-top">
          <div class="top-left-obs"></div>
          <div class="currentTemps">${currentTemp}${apparentTemp}</div>
        </div>
        ${separator}
      </div>
    `;
  }

  private _renderTitleOnlyOverviewSection(): TemplateResult {
    if (this._config?.show_section_overview === false) return html``;

    const separator = this._config.option_show_overview_separator === true ? html`<hr class=line>` : ``;

    return html`
      <div class="overview-section section">
        ${this._config.text_card_title ? html`<div class="card-header">${this._config.text_card_title}</div>` : html``}
        ${this._config.text_card_title_2 ? html`<div class="card-header">${this._config.text_card_title_2}</div>` : html``}
        ${this._config.entity_update_time ? html`<div class="updated">${this._config.text_update_time_prefix ? this._config.text_update_time_prefix + ' ' : ''}${this._renderUpdateTime()}</div>` : html``}
        ${separator}
      </div>
    `;
  }
  private _renderForecastOverviewSection(): TemplateResult {
    if (this._config?.show_section_overview === false) return html``;

    const weatherIcon = this._weatherIcon(this.forecastIcon);
    const url = { href: this._getIconUrl(weatherIcon) };
    const hoverText = weatherIcon !== 'unknown' ? '' : `Unknown condition\n${this.forecastIcon}`;
    const unknownDiv = weatherIcon !== 'unknown' ? html`` : html`<div class="unknown-forecast">${this.forecastIcon}</div>`;
    const biggerIcon = html`<div class="big-icon"><img src="${url.href}" width="100%" height="100%" title="${hoverText}"></div>`;

    const separator = this._config.option_show_overview_separator === true ? html`<hr class=line>` : ``;


  //tjl use the new formatEntityState method for formatting an entity's presentation state (sunny to Sunny).
    const forecastText = (this._config.entity_summary) && (this.hass.states[this._config.entity_summary]) ?
      html`<div class="forecast-text-right">${this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary])}</div>` ?? html`<div class="forecast-text-right">---</div>` : html``;

  //  html`<div class="forecast-text-right">${entityComputeStateDisplay(this.hass.localize, this.hass.states[this._config.entity_summary], getLocale(this.hass))}</div>` ?? html`<div class="forecast-text-right">---</div>` : html``;

    return html`
      <div class="overview-section section">
        ${this._config.text_card_title ? html`<div class="card-header">${this._config.text_card_title}</div>` : html``}
        ${this._config.text_card_title_2 ? html`<div class="card-header">${this._config.text_card_title_2}</div>` : html``}
        ${this._config.entity_update_time ? html`<div class="updated">${this._config.text_update_time_prefix ? this._config.text_update_time_prefix + ' ' : ''}${this._renderUpdateTime()}</div>` : html``}
        <div class="overview-top">
          <div class="top-left">${biggerIcon}${unknownDiv}</div>
          ${forecastText}
        </div>
        ${separator}
      </div>
    `;
  }

  private _getCardSizeOverviewSection(): number {
    var sectionHeight = 0;
    if (this._config.show_section_overview !== false) {
      if (this._config.overview_layout === 'observations') {
        return 76;
      } else {
        sectionHeight = 16;
        sectionHeight += this._config.text_card_title !== undefined ? 20 : 0;
        sectionHeight += this._config.text_card_title_2 !== undefined ? 20 : 0;
        sectionHeight += this._config.entity_update_time !== undefined ? 20 : 0;
      }
      if (this._config.overview_layout !== 'title only') {
        sectionHeight += (this._config.overview_layout !== 'forecast') && (this._config.entity_summary !== undefined) ? 145 : 120;
      }
    }
    return sectionHeight;
  }

  private _renderOverviewSection(): TemplateResult {
    if (this._config?.show_section_overview === false) return html``;

    const layout = this._config.overview_layout || 'complete';
    switch (layout) {
      case 'observations':
        return this._renderObservationsOverviewSection();
      case 'forecast':
        return this._renderForecastOverviewSection();
      case 'title only':
        return this._renderTitleOnlyOverviewSection();
      case 'complete':
      default:
        return this._renderCompleteOverviewSection();
    }
  }

  private _getCardSizeExtendedSection(): number {
    var sectionHeight = 0;
    if (this._config.show_section_extended !== false) {
      // Add the basic margins
      sectionHeight += 16;
      // this is a guess. assume 2 lines of text and add an extra 1 if uv or fire danger is added
      sectionHeight += this._config.entity_extended ? 40 : 0;
      sectionHeight += (this._config.entity_todays_uv_forecast !== undefined) || (this._config.entity_todays_fire_danger !== undefined) ? 20 : 0;
    }
    return sectionHeight;
  }

  private _renderExtendedSection(): TemplateResult {
    if ((this._config?.show_section_extended === false) || (this._config.entity_extended === undefined) && (this._config.entity_todays_uv_forecast === undefined) && (this._config.entity_todays_fire_danger === undefined)) return html``;

    const extendedEntity = this._config.entity_extended || '';
    var extended: TemplateResult[] = [];
    if (this.hass.states[extendedEntity] !== undefined) {

      //tjl Feature add for entity_extended.  Add support for weather entity.
      //  Weather entity whose forecast attribute for today is defined by extended_name_attr.
      //    Example: extended_name_attr is "detailed_description"
      //    this is forecast[0].detailed_description or forecast[0]["detailed_description"]
      //  otherwise continue using any other non-weather entity
      if (this._config.entity_extended?.match('^weather.')) {
        const forecast = this.forecast1;
        if (forecast !== undefined ) {
          var attrib: string | undefined;
          attrib = undefined;
          if (this._config.extended_use_attr === true) {
            if (this._config.extended_name_attr !== undefined) {
              attrib = forecast[0][this._config.extended_name_attr];
            }
          }  else {
            attrib = "extended_use_attr: - must be set to true when entity_extended is set to a weather entity";
          }
          if (attrib !== undefined) extended.push(html`${attrib}`);
        }
      } else {
        if (this._config.extended_use_attr === true) {
          if (this._config.extended_name_attr !== undefined) {
            const attribute = this._config.extended_name_attr.toLowerCase().split(".").reduce((retval, value) => retval !== undefined ? retval[value] : undefined, this.hass.states[extendedEntity].attributes);
            if (attribute !== undefined) extended.push(html`${attribute}`);
          }
        } else {
          if (this.hass.states[extendedEntity] !== undefined) {
            const extState = this.hass.states[extendedEntity].state;
            if (extState !== 'unknown' && extState !== 'unavailable') extended.push(html`${extState}`);
          }
        }
      }
    }
    extended.push(html`${this._config.entity_todays_uv_forecast && this.hass.states[this._config.entity_todays_uv_forecast] &&
      this.hass.states[this._config.entity_todays_uv_forecast].state !== "unknown" ? " " +
    this.hass.states[this._config.entity_todays_uv_forecast].state : ""}`);
    extended.push(html`${this._config.entity_todays_fire_danger && this.hass.states[this._config.entity_todays_fire_danger] &&
      this.hass.states[this._config.entity_todays_fire_danger].state !== "unknown" ? " " +
    this.hass.states[this._config.entity_todays_fire_danger].state : ""}`);

    return html`
      <div class="extended-section section">
        <div class="f-extended">
          ${extended}
        </div>
      </div>
    `;
  }

  private _getCardSizeSlotsSection(): number {
    var sectionHeight = 0;
    if (this._config.show_section_slots !== false) {
      // Calculate the max number of slots in both left and right
      var slotsLeft =
        (this._config.slot_l1 !== 'remove' ? 1 : 0) +
        (this._config.slot_l2 !== 'remove' ? 1 : 0) +
        (this._config.slot_l3 !== 'remove' ? 1 : 0) +
        (this._config.slot_l4 !== 'remove' ? 1 : 0) +
        (this._config.slot_l5 !== 'remove' ? 1 : 0) +
        ((this._config.slot_l6 !== undefined) && (this._config.slot_l6 !== 'remove') ? 1 : 0) +
        ((this._config.slot_l7 !== undefined) && (this._config.slot_l7 !== 'remove') ? 1 : 0) +
        ((this._config.slot_l8 !== undefined) && (this._config.slot_l8 !== 'remove') ? 1 : 0);
      var slotsRight =
        (this._config.slot_r1 !== 'remove' ? 1 : 0) +
        (this._config.slot_r2 !== 'remove' ? 1 : 0) +
        (this._config.slot_r3 !== 'remove' ? 1 : 0) +
        (this._config.slot_r4 !== 'remove' ? 1 : 0) +
        (this._config.slot_r5 !== 'remove' ? 1 : 0) +
        ((this._config.slot_r6 !== undefined) && (this._config.slot_r6 !== 'remove') ? 1 : 0) +
        ((this._config.slot_r7 !== undefined) && (this._config.slot_r7 !== 'remove') ? 1 : 0) +
        ((this._config.slot_r8 !== undefined) && (this._config.slot_r8 !== 'remove') ? 1 : 0);
      sectionHeight += 16 + Math.max(slotsLeft, slotsRight) * 24;
    }
    return sectionHeight;
  }

  private _renderSlotsSection(): TemplateResult {
    if (this._config?.show_section_slots === false) return html``;

    var slot_section = (this._config.use_old_column_format === true) ? html`
      <div>
        <ul class="variations-ugly">
          <li>
            <ul class="slot-list">${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}</ul>
          </li>
          <li>
            <ul class="slot-list">${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}</ul>
          </li>
        </ul>
      </div>
    ` : html`
      <div>
        <ul class="variations">
          <li class="slot-list-item-1">
            <ul class="slot-list">
              ${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}
            </ul>
          </li>
          <li>
            <ul class="slot-list">
              ${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}
            </ul>
          </li>
        </ul>
      </div>
    `;

    return html`
      <div class="slot-section section">${slot_section}</div>
    `;
  }

  private _renderHorizontalDailyForecastSection(): TemplateResult {
    const htmlDays: TemplateResult[] = [];
    const days = this._config.daily_forecast_days || 5;

    for (var i = 0; i < days; i++) {
      const forecastDate = new Date();
      forecastDate.setDate(forecastDate.getDate() + i + (this._config.option_show_current_day ? 0 : 1));
      var htmlIcon: TemplateResult;
      var maxTemp: string | undefined;
      var minTemp: string | undefined;


      if (this._config.entity_forecast_icon_1?.match('^weather.')) {
        // using a weather domain entity
        const iconEntity = this._config.entity_forecast_icon_1;

        //tjl using new forecast subscribe method
        var condition: string | undefined;
        if (this.forecast1 !== undefined ) {
          condition = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'condition');
        }
      //const condition = this._getForecastPropFromWeather(this.hass.states[iconEntity].attributes.forecast, forecastDate, 'condition');
        if (condition === undefined) {
          break;
        }

        const url = { href: this._getIconUrl(iconEntity && condition ? this._weatherIcon(condition) : 'unknown', true) };
        htmlIcon = html`<li class="f-slot-horiz-icon"><i class="icon" style="background: none, url(${url.href}) no-repeat; background-size: contain;"></i></li>`;
      } else {
        // using sensor domain entities
        var start = this._config.entity_forecast_icon_1 ? this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g) : false;
        const iconEntity = this._config.entity_forecast_icon_1 ? this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
        if ((iconEntity === undefined) || (this.hass.states[iconEntity] === undefined)) { // if there is no data then cut the forecast short
          break;
        }
        const url = { href: this._getIconUrl(iconEntity && this.hass.states[iconEntity] ? this._weatherIcon(this.hass.states[iconEntity].state) : 'unknown', true) };
        htmlIcon = html`<i class="icon" style="background: none, url(${url.href}) no-repeat; background-size: contain;"></i>`;
      }
      if (this._config.entity_forecast_max_1?.match('^weather.')) {

       //tjl using new forecast subscribe method
        if (this.forecast1 !== undefined ) {
          maxTemp = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'temperature');
        }
      //maxTemp = this._getForecastPropFromWeather(this.hass.states[this._config.entity_forecast_max_1].attributes.forecast, forecastDate, 'temperature');
      } else {
        start = this._config.entity_forecast_max_1 ? this._config.entity_forecast_max_1.match(/(\d+)(?!.*\d)/g) : false;
        maxTemp = start && this._config.entity_forecast_max_1 ? this.hass.states[this._config.entity_forecast_max_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i))].state : undefined;
      }
      if (this._config.entity_forecast_min_1?.match('^weather.')) {

       //tjl using new forecast subscribe method
        if (this.forecast1 !== undefined ) {
          minTemp = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'templow');
        }
      //minTemp = this._getForecastPropFromWeather(this.hass.states[this._config.entity_forecast_min_1].attributes.forecast, forecastDate, 'templow');
      } else {
        start = this._config.entity_forecast_min_1 ? this._config.entity_forecast_min_1.match(/(\d+)(?!.*\d)/g) : false;
        minTemp = start && this._config.entity_forecast_min_1 ? this.hass.states[this._config.entity_forecast_min_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i))].state : undefined;
      }
      const tempUnit = html`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`;
      const minMax = this._config.old_daily_format === true
        ?
        html`
          <li class="f-slot-horiz-text">
            <span>
              <div class="slot-text highTemp">${maxTemp ? Number(maxTemp).toLocaleString(this.locale, { minimumFractionDigits: this._config.option_forecast_decimals ? 1 : 0, maximumFractionDigits: this._config.option_forecast_decimals ? 1 : 0 }) : '---'}</div>
              ${tempUnit}
            </span>
          </li>
          <li class="f-slot-horiz-text">
            <span>
              <div class="slot-text lowTemp">${minTemp ? Number(minTemp).toLocaleString(this.locale, { minimumFractionDigits: this._config.option_forecast_decimals ? 1 : 0, maximumFractionDigits: this._config.option_forecast_decimals ? 1 : 0 }) : '---'}</div>
              ${tempUnit}
            </span>
          </li>`
        :
        this._config.tempformat === "highlow"
          ?
          html`
            <li class="f-slot-horiz-text">
              <span>
                <div class="slot-text highTemp">${maxTemp ? Number(maxTemp).toLocaleString(this.locale, { minimumFractionDigits: this._config.option_forecast_decimals ? 1 : 0, maximumFractionDigits: this._config.option_forecast_decimals ? 1 : 0 }) : "---"}</div>
                <div class="slot-text slash">/</div>
                <div class="slot-text lowTemp">${minTemp ? Number(minTemp).toLocaleString(this.locale, { minimumFractionDigits: this._config.option_forecast_decimals ? 1 : 0, maximumFractionDigits: this._config.option_forecast_decimals ? 1 : 0 }) : "---"}</div>
                ${tempUnit}
              </span>
            </li>`
          :
          html`
            <li class="f-slot-horiz-text">
              <span>
                <div class="slot-text lowTemp">${minTemp ? Number(minTemp).toLocaleString(this.locale, { minimumFractionDigits: this._config.option_forecast_decimals ? 1 : 0, maximumFractionDigits: this._config.option_forecast_decimals ? 1 : 0 }) : "---"}</div>
                <div class="slot-text slash">/</div>
                <div class="slot-text highTemp">${maxTemp ? Number(maxTemp).toLocaleString(this.locale, { minimumFractionDigits: this._config.option_forecast_decimals ? 1 : 0, maximumFractionDigits: this._config.option_forecast_decimals ? 1 : 0 }) : "---"}</div>
                ${tempUnit}
              </span>
            </li>
          `;

      var pop: TemplateResult;
      var pos: TemplateResult;
      var tooltip: TemplateResult;
      if (this._config.entity_pop_1?.match('^weather.')) {
        const popEntity = this._config.entity_pop_1;

        //tjl using new forecast subscribe method
        var popData: string | undefined;
        if (this.forecast1 !== undefined ) {
          popData = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'precipitation_probability');
        }
      //const popData = this._getForecastPropFromWeather(this.hass.states[popEntity].attributes.forecast, forecastDate, 'precipitation_probability');
        pop = popEntity && this._config.option_show_forecast_pop !== false ? html`<li class="f-slot-horiz-text"><span><div class="slot-text pop">${this.hass.states[popEntity] && popData !== undefined ? Math.round(Number(popData)) : "---"}</div><div class="unit">%</div></span></li>` : html``;
      } else {
        start = this._config.entity_pop_1 ? this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g) : false;
        const popEntity = start && this._config.entity_pop_1 ? this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
        pop = start && this._config.option_show_forecast_pop !== false ? html`<li class="f-slot-horiz-text"><span><div class="slot-text pop">${popEntity && this.hass.states[popEntity] ? Math.round(Number(this.hass.states[popEntity].state)) : "---"}</div><div class="unit">%</div></span></li>` : html``;
      }
      if (this._config.entity_pos_1?.match('^weather.')) {
        const posEntity = this._config.entity_pos_1;

        //tjl using new forecast subscribe method
        var posData: string | undefined;
        if (this.forecast1 !== undefined ) {
          posData = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'precipitation');
        }
      //const posData = this._getForecastPropFromWeather(this.hass.states[posEntity].attributes.forecast, forecastDate, 'precipitation');
        pos = posEntity ? html`<li class="f-slot-horiz-text"><span><div class="pos">${this.hass.states[posEntity] && posData !== undefined ? posData : "---"}</div><div class="unit">${this.getUOM('precipitation')}</div></span></li>` : html``;
      } else {
        start = this._config.entity_pos_1 ? this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g) : false;
        const posEntity = start && this._config.entity_pos_1 ? this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
        pos = start ? html`<li class="f-slot-horiz-text"><span><div class="pos">${posEntity && this.hass.states[posEntity] ? this.hass.states[posEntity].state : "---"}</div><div class="unit">${this.getUOM('precipitation')}</div></span></li>` : html``;
      }
      if (this._config.entity_summary_1?.match('^weather.')) {
        const tooltipEntity = this._config.entity_summary_1;

       //tjl using new forecast subscribe method
        var tooltipData: string | undefined;
        if (this.forecast1 !== undefined ) {
          tooltipData = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'detailed_description') ?? this._getForecastPropFromWeather(this.forecast1, forecastDate, 'condition');
        }
      //const tooltipData = this._getForecastPropFromWeather(this.hass.states[tooltipEntity].attributes.forecast, forecastDate, 'detailed_description') ?? this._getForecastPropFromWeather(this.hass.states[tooltipEntity].attributes.forecast, forecastDate, 'condition');
          const _fi = (this._config.option_show_current_day ? 0 : 1) + i;
          const _fe = this.forecast1 && this.forecast1[_fi];
          const _cMapW: {[k:string]:number} = {N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337};
          const _wbRawW = _fe?.wind_bearing;
          let _wbDegW: number | null = null;
          if (_wbRawW !== undefined && _wbRawW !== null) { const _nW = Number(_wbRawW); _wbDegW = !isNaN(_nW) ? _nW : (_cMapW[String(_wbRawW).toUpperCase().trim()] ?? null); }
          const _fdate = forecastDate ? forecastDate.toLocaleDateString(this.locale, { weekday: 'long', month: 'short', day: 'numeric' }) : '';
          const _cond = this.hass.states[tooltipEntity] && tooltipData !== undefined ? stringComputeStateDisplay(this.hass.localize, tooltipData) : '';
          const _wEntF = this._config.entity ? this.hass.states[this._config.entity] : null;
          const _rows = this._buildTooltipRows({ date: _fdate, condition: _cond, maxT: _fe?.temperature !== undefined ? Number(_fe.temperature) : null, minT: _fe?.templow !== undefined ? Number(_fe.templow) : null, precip: _fe?.precipitation !== undefined ? Number(_fe.precipitation) : null, windSpeed: _fe?.wind_speed !== undefined ? Math.round(Number(_fe.wind_speed)) : null, windBearDeg: _wbDegW, uomPrecip: (_wEntF?.attributes?.precipitation_unit as string) || this.getUOM('precipitation'), uomWind: this._getWindUnit() });
          tooltip = html`<div class="fcasttooltipblock" id="fcast-summary-${i}" style="width:${days * 100}%;left:-${i * 100}%;">${unsafeHTML(_rows)}<span style="content:'';position:absolute;top:100%;left:${(100 / days / 2) + i * (100 / days)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`;
      } else {
        start = this._config.entity_summary_1 ? this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g) : false;
        const tooltipEntity = start && this._config.entity_summary_1 ? this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
          const _fi2b = (this._config.option_show_current_day ? 0 : 1) + i;
          const _fe2b = this.forecast1 && this.forecast1[_fi2b];
          const _cMap2b: {[k:string]:number} = {N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337};
          const _wb2b = _fe2b?.wind_bearing;
          let _wbDeg2b: number | null = null;
          if (_wb2b !== undefined && _wb2b !== null) { const _n2b = Number(_wb2b); _wbDeg2b = !isNaN(_n2b) ? _n2b : (_cMap2b[String(_wb2b).toUpperCase().trim()] ?? null); }
          const _fdate2b = forecastDate ? forecastDate.toLocaleDateString(this.locale, { weekday: 'long', month: 'short', day: 'numeric' }) : '';
          const _cond2b = this._config.option_tooltips && tooltipEntity && this.hass.states[tooltipEntity]
            ? (this._config.summary_1_use_attr && this._config.summary_1_name_attr
                ? (this.hass.states[tooltipEntity].attributes[this._config.summary_1_name_attr] ?? '')
                : this.hass.states[tooltipEntity].state)
            : '';
          const _wEntF2 = this._config.entity ? this.hass.states[this._config.entity] : null;
          const _rows2b = this._buildTooltipRows({ date: _fdate2b, condition: _cond2b, maxT: _fe2b?.temperature !== undefined ? Number(_fe2b.temperature) : null, minT: _fe2b?.templow !== undefined ? Number(_fe2b.templow) : null, precip: _fe2b?.precipitation !== undefined ? Number(_fe2b.precipitation) : null, windSpeed: _fe2b?.wind_speed !== undefined ? Math.round(Number(_fe2b.wind_speed)) : null, windBearDeg: _wbDeg2b, uomPrecip: (_wEntF2?.attributes?.precipitation_unit as string) || this.getUOM('precipitation'), uomWind: this._getWindUnit() });
          tooltip = html`<div class="fcasttooltipblock" id="fcast-summary-${i}" style="width:${days * 100}%;left:-${i * 100}%;">${unsafeHTML(_rows2b)}<span style="content:'';position:absolute;top:100%;left:${(100 / days / 2) + i * (100 / days)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`;
      }

      htmlDays.push(html`
        <div class="day-horiz fcasttooltip">
          <ul class="f-slot-horiz">
            <li class="f-slot-horiz-text"><span class="dayname">${forecastDate ? forecastDate.toLocaleDateString(this.locale, { weekday: 'short' }) : "---"}</span></li>
            ${htmlIcon}
            ${this._config.option_show_temperature_chart ? html`` : minMax}
            ${pop}
            ${this._config.option_show_precipitation_chart ? html`` : pos}
            ${this._config.option_show_forecast_wind === true ? (() => {
              const fi = (this._config.option_show_current_day ? 0 : 1) + i;
              const fe = this.forecast1 && this.forecast1[fi];
              if (!fe || fe.wind_speed === undefined) return html``;
              const wSpeed = Math.round(Number(fe.wind_speed));
              // Convert bearing: numeric degrees OR compass string → degrees
              const compassMap: {[k:string]:number} = {
                N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,
                S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337
              };
              let wBear: number | null = null;
              if (fe.wind_bearing !== undefined && fe.wind_bearing !== null) {
                const asNum = Number(fe.wind_bearing);
                if (!isNaN(asNum)) {
                  wBear = asNum;
                } else {
                  const key = String(fe.wind_bearing).toUpperCase().trim();
                  wBear = compassMap[key] ?? null;
                }
              }
              const arrowSvg = wBear !== null
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 10 10" style="transform:rotate(${(wBear + 180) % 360}deg);display:inline-block;vertical-align:middle;margin-right:1px;"><polygon points="5,0 8.5,9 5,6.5 1.5,9" fill="currentColor"/></svg>`
                : '';
              return html`<li class="f-slot-horiz-text"><span>${unsafeHTML(arrowSvg)}${wSpeed}</span></li>`;
            })() : html``}

          </ul>
          ${tooltip}
        </div>
      `);
    }
    return html`
      <div class="daily-forecast-horiz-section section">
        ${htmlDays}
      </div>
    `;
  }

  private _renderVerticalDailyForecastSection(): TemplateResult {
    const htmlDays: TemplateResult[] = [];
    const days = this._config.daily_forecast_days || 5;

    for (var i = 0; i < days; i++) {
      const forecastDate = new Date();
      forecastDate.setDate(forecastDate.getDate() + i + (this._config.option_show_current_day ? 0 : 1));
      var htmlIcon: TemplateResult;
      var maxTemp: string | undefined;
      var minTemp: string | undefined;
      var pop: TemplateResult;
      var pos: TemplateResult;
      var fireDanger: TemplateResult;
      var condition: string | undefined; //tjl moved to here; changed to var


      if (this._config.entity_forecast_icon_1?.match('^weather.')) {
        // using a weather domain entity
        const iconEntity = this._config.entity_forecast_icon_1;

        //tjl using new forecast subscribe method
        if (this.forecast1 !== undefined ) {
          condition = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'condition');
        }
      //const condition = this._getForecastPropFromWeather(this.hass.states[iconEntity].attributes.forecast, forecastDate, 'condition');
        if (condition === undefined) {
          break;
        }

        const url = { href: this._getIconUrl(iconEntity && condition ? this._weatherIcon(condition) : 'unknown', true) };
        htmlIcon = html`<i class="icon" style="background: none, url(${url.href}) no-repeat; background-size: contain;"></i><br>`;
      } else {
        // using sensor domain entities
        var start = this._config.entity_forecast_icon_1 ? this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g) : false;
        const iconEntity = start && this._config.entity_forecast_icon_1 ? this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
        if (!iconEntity || this.hass.states[iconEntity] === undefined || this.hass.states[iconEntity].state === 'unknown') { // Stop adding forecast days as soon as an undefined entity is encountered
          break;
        }
        const url = { href: this._getIconUrl(this.hass.states[iconEntity] !== undefined ? this._weatherIcon(this.hass.states[iconEntity].state) : 'unknown', true) };
        htmlIcon = html`<i class="icon" style="background: none, url(${url.href}) no-repeat; background-size: contain;"></i><br>`;
      }

      //tjl Feature add for entity_summary_1.  Add support for weather entity using the forecast attribute 'condition'. 
      //tjl Use new forecast subscribe method
      if (this._config.entity_summary_1?.match('^weather.')) {
        if (this.forecast1 !== undefined ) {
          condition = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'condition');
        }
        start = true;
        //tjl use the new formatEntityState method for formatting an entity's presentation state (sunny to Sunny).
        //  Since the we're using attribute 'condition' instead of actual state,
        //    formatEntityState supports a hack where you can force a textual state.  Ex. hass.formatEntityState(hass.states["light.my_light"], 'off');
        //    So get the forecast 'condtion' and make it the textual state.
        var summary = start ? html`
          <div class="f-summary-vert">${this.hass.states[this._config.entity_summary_1] ? this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary_1],condition) : "---"}</div>` : ``;
      } else {
        start = this._config.entity_summary_1 ? this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g) : false;
        const summaryEntity = start && this._config.entity_summary_1 ? this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
        const _sumState = summaryEntity && this.hass.states[summaryEntity]
          ? (this._config.summary_1_use_attr && this._config.summary_1_name_attr
              ? this.hass.states[summaryEntity].attributes[this._config.summary_1_name_attr]
              : this.hass.states[summaryEntity].state)
          : "---";
        var summary = start ? html`
          <div class="f-summary-vert">${_sumState ?? "---"}</div>` : ``;
      }

      if (this._config.entity_forecast_max_1?.match('^weather.')) {

        //tjl using new forecast subscribe method
        if (this.forecast1 !== undefined ) {
          maxTemp = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'temperature');
        }
      //maxTemp = this._getForecastPropFromWeather(this.hass.states[this._config.entity_forecast_max_1].attributes.forecast, forecastDate, 'temperature');

      } else {
        start = this._config.entity_forecast_max_1 ? this._config.entity_forecast_max_1.match(/(\d+)(?!.*\d)/g) : false;
        maxTemp = start && this._config.entity_forecast_max_1 ? this.hass.states[this._config.entity_forecast_max_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i))].state : undefined;
      }
      if (this._config.entity_forecast_min_1?.match('^weather.')) {

       //tjl using new forecast subscribe method
        if (this.forecast1 !== undefined ) {
          minTemp = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'templow');
        }
      //minTemp = this._getForecastPropFromWeather(this.hass.states[this._config.entity_forecast_min_1].attributes.forecast, forecastDate, 'templow');
      } else {
        start = this._config.entity_forecast_min_1 ? this._config.entity_forecast_min_1.match(/(\d+)(?!.*\d)/g) : false;
        minTemp = start && this._config.entity_forecast_min_1 ? this.hass.states[this._config.entity_forecast_min_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i))].state : undefined;
      }
      const tempUnit = html`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`;
      const min = minTemp ? html`
        <div class="f-slot-vert">
          <div class="temp-label">Min: </div>
          <div class="low-temp">${Number(minTemp).toLocaleString(this.locale, { minimumFractionDigits: this._config.option_forecast_decimals ? 1 : 0, maximumFractionDigits: this._config.option_forecast_decimals ? 1 : 0 })}</div>${tempUnit}
        </div>` : html`---`;
      const max = maxTemp ? html`
        <div class="f-slot-vert">
          <div class="temp-label">Max: </div>
          <div class="high-temp">${Number(maxTemp).toLocaleString(this.locale, { minimumFractionDigits: this._config.option_forecast_decimals ? 1 : 0, maximumFractionDigits: this._config.option_forecast_decimals ? 1 : 0 })}</div>${tempUnit}
        </div>` : html`---`;
      if (this._config.entity_pop_1?.match('^weather.')) {
        const popEntity = this._config.entity_pop_1;

       //tjl using new forecast subscribe method
        var popData: string | undefined;
        if (this.forecast1 !== undefined ) {
          popData = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'precipitation_probability');
        }
      //const popData = this._getForecastPropFromWeather(this.hass.states[popEntity].attributes.forecast, forecastDate, 'precipitation_probability');
        pop = popEntity ? html`<div class="f-slot-vert"><div class="f-label">Chance of rain </div>
        <div class="pop">${this.hass.states[popEntity] && popData !== undefined ? Math.round(Number(popData)) : "---"}</div><div class="unit">%</div></div>` : html``;
      } else {
        start = this._config.entity_pop_1 ? this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g) : false;
        const popEntity = start && this._config.entity_pop_1 ? this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
        pop = start ? html`
          <div class="f-slot-vert"><div class="f-label">Chance of rain </div>
          <div class="pop">${popEntity && this.hass.states[popEntity] ? Math.round(Number(this.hass.states[popEntity].state)) : "---"}</div><div class="unit">%</div></div>` : html``;
      }
      if (this._config.entity_pos_1?.match('^weather.')) {
        const posEntity = this._config.entity_pos_1;

       //tjl using new forecast subscribe method
        var posData: string | undefined;
        if (this.forecast1 !== undefined ) {
          posData = this._getForecastPropFromWeather(this.forecast1, forecastDate, 'precipitation');
        }
      //const posData = this._getForecastPropFromWeather(this.hass.states[posEntity].attributes.forecast, forecastDate, 'precipitation');
        pos = posEntity ? html`<div class="f-slot-vert"><div class="f-label">Possible rain </div>
        <div class="pos">${this.hass.states[posEntity] && posData !== undefined ? posData : "---"}</div><div class="unit">${this.getUOM('precipitation')}</div></div>` : html``;
      } else {
        start = this._config.entity_pos_1 ? this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g) : false;
        const posEntity = start && this._config.entity_pos_1 ? this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
        pos = start ? html`
          <div class="f-slot-vert"><div class="f-label">Possible rain </div>
          <div class="pos">${posEntity && this.hass.states[posEntity] ? this.hass.states[posEntity].state : "---"}</div>
          <div class="unit">${this.getUOM('precipitation')}</div></div>` : html``;
      }

      //tjl Feature add for entity_extended_1  Add support for weather entity 
      //  This will require use of configured daily_extended_name_attr. 
      //tjl Use new forecast subscribe method
      var extended: TemplateResult = html``;
      if (this._config.entity_extended_1?.match('^weather.')) {
        if (this.forecast1 !== undefined ) {
          var attrib: string | undefined;
          attrib = undefined;
          if (this._config.daily_extended_use_attr === true) {
            if (this._config.daily_extended_name_attr !== undefined) {
              attrib = this._getForecastPropFromWeather(this.forecast1, forecastDate, this._config.daily_extended_name_attr);
            }
          }  else {
            attrib = "daily_extended_use_attr: - must be set to true when entity_extended_1 is set to a weather entity";
          }
          if (attrib !== undefined) 
          extended = attrib ? html`<div class="f-extended">${attrib}</div>` : html``;
        }


      } else {
        start = this._config.entity_extended_1 && i < (this._config.daily_extended_forecast_days !== 0 ? this._config.daily_extended_forecast_days || 7 : 0) ? this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g) : false;
      //var extended: TemplateResult = html``;//tjl move this higher up to cover both sensor entities and new weather entity
        if (i < (this._config.daily_extended_forecast_days ? this._config.daily_extended_forecast_days : 7)) {
          if (this._config.daily_extended_use_attr === true) {
            start = this._config.entity_extended_1 ? this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g) : false;
            const extendedEntity = start && this._config.entity_extended_1 ? this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : this._config.entity_extended_1;
            if (extendedEntity && this.hass.states[extendedEntity] !== undefined) {
              start = this._config.daily_extended_name_attr && i < (this._config.daily_extended_forecast_days !== 0 ? this._config.daily_extended_forecast_days || 7 : 0) ? this._config.daily_extended_name_attr.match(/(\d+)(?!.*\d)/g) : false;
              const attribute = start == null && extendedEntity && this._config.daily_extended_name_attr ? this.hass.states[extendedEntity].attributes[this._config.daily_extended_name_attr] : start && this._config.daily_extended_name_attr && extendedEntity ? this._config.daily_extended_name_attr.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)).toLowerCase().split(".").reduce((retval, value) => retval !== undefined ? retval[value] : undefined, this.hass.states[extendedEntity].attributes) : undefined;
              extended = attribute ? html`<div class="f-extended">${attribute}</div>` : html``;
            }
          } else {
            const extendedEntity = start && this._config.entity_extended_1 ? this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
            extended = start ? html`<div class="f-extended">${extendedEntity && this.hass.states[extendedEntity] ? this.hass.states[extendedEntity].state :
              "---"}</div>` : html``;
          }
        }
      }

      start = this._config.entity_fire_danger_1 ? this._config.entity_fire_danger_1.match(/(\d+)(?!.*\d)/g) : false;
      fireDanger = html``;
      const fireDangerEntity = start && this._config.entity_fire_danger_1 ? this._config.entity_fire_danger_1.replace(/(\d+)(?!.*\d)/g, String(Number(start) + i)) : undefined;
      if ((start) && (fireDangerEntity)) {
        var fireStyle = this._config.option_daily_color_fire_danger !== false && this.hass.states[fireDangerEntity].attributes.color_fill ? `background-color:${this.hass.states[fireDangerEntity].attributes.color_fill}; color:${this.hass.states[fireDangerEntity].attributes.color_text};` : "";
        if (this._config.option_daily_color_fire_danger === false) {
          fireDanger = start && this.hass.states[fireDangerEntity].state !== 'unknown' ? html`
          <div class="f-firedanger-vert">${fireDangerEntity && this.hass.states[fireDangerEntity] ? this.hass.states[fireDangerEntity].state : "---"}</div>` : html``;
        } else {
          if (fireStyle === '') {
            fireStyle = "font-weight:300;";
          }
          fireDanger = start && this.hass.states[fireDangerEntity].state !== 'unknown' ? html`
          <div class="f-firedanger-vert">
            <p class="fire-danger-text-color" style="${fireStyle}">${fireDangerEntity && this.hass.states[fireDangerEntity] ? this.hass.states[fireDangerEntity].state.toUpperCase() : "---"}</p>
          </div>` : html``;
        }
      }

      htmlDays.push(html`
        <div class="day-vert fcasttooltip">
          <div class="day-vert-top">
            <div class="dayname-vert">${forecastDate ? forecastDate.toLocaleDateString(this.locale, { weekday: 'short' }) : "---"}</div>
            ${summary}
          </div>
          <div>
            ${fireDanger}
          </div>
          <div class="day-vert-middle">
            <div class="day-vert-dayicon">
              ${htmlIcon}
            </div>
            <div class="day-vert-temps">
              ${min}
              ${max}
            </div>
            <div class="day-vert-rain">
              ${pop}
              ${pos}
            </div>
          </div>
          <div class="day-vert-bottom">
            ${extended}
          </div>
        </div>
      `);
    }

    return html`
      <div class="daily-forecast-vert-section section">
        ${htmlDays}
      </div>
    `;
  }

  private _getForecastPropFromWeather(forecast: Array<any>, date: Date, propKey: string): string | undefined {
    const day = date.toDateString();
    const forecastForThisDay = forecast.filter(o => new Date(o.datetime).toDateString() === day);
    if (forecastForThisDay.length === 1) {
      return forecastForThisDay[0][propKey] !== undefined ? String(forecastForThisDay[0][propKey]) : undefined;
    }
    else if (forecastForThisDay.length === 2) {
      const dayForecast = forecastForThisDay.find(o => o.daytime === true);
      const nightForecast = forecastForThisDay.find(o => o.daytime === false);

      //Get low temp from night forecast
      if (propKey === 'templow') {
        return nightForecast && nightForecast['temperature'] !== undefined ? String(nightForecast['temperature']) : undefined;
      }
      return dayForecast && dayForecast[propKey] !== undefined ? String(dayForecast[propKey]) : undefined;
    }

    return undefined;
  }

  private _getCardSizeDailyForecastSection(): number {
    var sectionHeight = 0;
    if (this._config.show_section_daily_forecast !== false) {
      if (this._config.daily_forecast_layout !== 'vertical') {
        // Horizontal layout
        sectionHeight += 146;
      } else {
        // Vertical layout
        // Add the stats part of each day
        sectionHeight += 18 + (this._config.daily_forecast_days || 5) * 87;
        // Add the guess for the extended forecast text (guess at 2 lines per forecast)
        if (this._config.daily_extended_forecast_days !== 0) {
          sectionHeight += Math.min(this._config.daily_forecast_days || 5, this._config.daily_extended_forecast_days || 7) * 48;
        }
      }
    }
    return sectionHeight;
  }



  /** Returns wind speed unit from entity attribute, with robust fallback (never returns m/s for metric) */
  private _getWindUnit(): string {
    const fromEnt = this._config.entity
      ? (this.hass.states[this._config.entity]?.attributes?.wind_speed_unit as string | undefined)
      : undefined;
    if (fromEnt) return fromEnt;
    // HA unit_system.wind_speed can be 'm/s' for metric — weather entities typically use km/h
    const sys = this.hass.config?.unit_system?.wind_speed;
    if (sys && sys !== 'm/s') return sys;
    return this.hass.config?.unit_system?.length === 'km' ? 'km/h' : 'mph';
  }

  /** Translates common unit strings to the app language */
  private _localizeUnit(unit: string): string {
    const lang = (this.hass?.language || 'en').toLowerCase();
    if (lang.startsWith('bg')) {
      const map: {[k: string]: string} = {
        'km/h': 'км/ч', 'kph': 'км/ч', 'm/s': 'м/с', 'mph': 'мph',
        'mm': 'мм', 'in': 'инч', 'cm': 'см',
      };
      return map[unit] || unit;
    }
    return unit;
  }

  /**
   * Builds unified tooltip row HTML used by both forecast and chart tooltips.
   * Returns an HTML string ready for insertion into a fcasttooltipblock.
   */
  private _buildTooltipRows(opts: {
    date?: string;
    condition?: string;
    maxT?: number | null;
    minT?: number | null;
    precip?: number | null;
    windSpeed?: number | null;
    windBearDeg?: number | null;
    uomPrecip?: string;
    uomWind?: string;
  }): string {
    const { date, condition, maxT, minT, precip, windSpeed, windBearDeg, uomPrecip = '', uomWind = '' } = opts;
    let rows = '';

    if (date) {
      rows += `<div class="fcasttooltiptext" style="color:#fff;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:3px;margin-bottom:4px;">${date}</div>`;
    }
    if (condition) {
      rows += `<div class="fcasttooltiptext" style="color:#fff;margin-bottom:2px;">${condition}</div>`;
    }
    if (maxT !== undefined && maxT !== null) {
      rows += `<div class="fcasttooltiptext" style="color:#fff;margin-top:2px;"><b style="color:#ef5350;">↑ ${Math.round(maxT)}°</b>&nbsp;&nbsp;<b style="color:#90caf9;">↓ ${minT !== undefined && minT !== null ? Math.round(minT) + '°' : '---'}</b></div>`;
    }
    if (precip !== undefined && precip !== null && precip > 0) {
      rows += `<div class="fcasttooltiptext" style="color:#fff;">💧 ${precip.toFixed(1)} ${this._localizeUnit(uomPrecip)}</div>`;
    }
    if (windSpeed !== undefined && windSpeed !== null) {
      const arrow = windBearDeg !== null && windBearDeg !== undefined
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" style="transform:rotate(${(windBearDeg+180)%360}deg);display:inline-block;vertical-align:middle;margin-right:2px;"><polygon points="5,0 8.5,9 5,6.5 1.5,9" fill="currentColor"/></svg>`
        : '';
      rows += `<div class="fcasttooltiptext" style="color:#fff;">${arrow}${windSpeed} ${this._localizeUnit(uomWind)}</div>`;
    }
    return rows;
  }

  private _renderChartSection(): TemplateResult {
    if (this._config.show_section_charts === false) return html``;
    const showTemp   = this._config.option_show_temperature_chart === true;
    const showPrecip = this._config.option_show_precipitation_chart === true;
    if (!showTemp && !showPrecip) return html``;
    if (!this.forecast1 || this.forecast1.length === 0) return html``;

    const days     = Math.min(this._config.daily_forecast_days || 5, this.forecast1.length);
    const startIdx = this._config.option_show_current_day ? 0 : 1;

    const compassMapC: {[k:string]:number} = {N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337};
    const data: { maxT: number; minT: number; precip: number; windSpeed: number | null; windBear: number | null; datetime: string }[] = [];
    for (let i = 0; i < days; i++) {
      const f = this.forecast1[startIdx + i];
      if (!f) break;
      const wbRawC = f.wind_bearing;
      let wbDegC: number | null = null;
      if (wbRawC !== undefined && wbRawC !== null) { const nc = Number(wbRawC); wbDegC = !isNaN(nc) ? nc : (compassMapC[String(wbRawC).toUpperCase().trim()] ?? null); }
      data.push({
        maxT:      Number(f.temperature   ?? 0),
        minT:      Number(f.templow       ?? f.temperature ?? 0),
        precip:    Number(f.precipitation ?? 0),
        windSpeed: f.wind_speed !== undefined ? Math.round(Number(f.wind_speed)) : null,
        windBear:  wbDegC,
        datetime:  String(f.datetime ?? ''),
      });
    }
    if (data.length === 0) return html``;

    const tempH   = showTemp   ? 75 : 52;
    const totalH  = tempH + (showPrecip ? 16 : 0); // 16px label strip below if precip enabled
    const BH = 13;
    const MIN_SEP = BH + 5;

    // ── Pre-calculate y positions with min separation ──────────────────────
    const tAll = showTemp ? data.flatMap(d => [d.maxT, d.minT]) : [];
    const tMax2 = showTemp ? Math.max(...tAll) : 0;
    const tMin2 = showTemp ? Math.min(...tAll) : 0;
    const tRng2 = tMax2 - tMin2 || 1;
    const tTop2 = 16;
    const tBot2 = tempH - 16;
    const tyRaw = (t: number) => tTop2 + (tMax2 - t) / tRng2 * (tBot2 - tTop2);

    const tempYs: { maxY: number; minY: number }[] = data.map(d => {
      let maxY = tyRaw(d.maxT);
      let minY = tyRaw(d.minT);
      const sep = minY - maxY;
      if (sep < MIN_SEP) {
        const push = (MIN_SEP - sep) / 2;
        maxY -= push;
        minY += push;
      }
      return { maxY, minY };
    });

    // ── SVG overlay for temperature lines ─────────────────────────────────
    const n = data.length;
    const cw = 100 / n;
    const cx2 = (i: number) => (i + 0.5) * cw;
    const linesSvg = showTemp ? (() => {
      const maxPts = tempYs.map((y, i) => `${cx2(i)},${y.maxY}`).join(' ');
      const minPts = tempYs.map((y, i) => `${cx2(i)},${y.minY}`).join(' ');
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ${totalH}" preserveAspectRatio="none"` +
        ` style="position:absolute;top:0;left:0;width:100%;height:${totalH}px;overflow:visible;pointer-events:none;">` +
        `<polyline points="${maxPts}" fill="none" stroke="rgba(255,152,0,0.9)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>` +
        `<polyline points="${minPts}" fill="none" stroke="rgba(90,150,210,0.9)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>` +
        (showPrecip ? (() => {
          // baseline at bottom of temp area
          return `<line x1="0" y1="${tempH}" x2="100" y2="${tempH}" stroke="rgba(115,198,239,0.2)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>`;
        })() : '') +
        `</svg>`;
    })() : '';

    // ── Per-column HTML ────────────────────────────────────────────────────
    const colItems = data.map((d, i) => {
      let colHtml = '';
      if (showTemp) {
        const maxTop = tempYs[i].maxY - BH / 2;
        const minTop = tempYs[i].minY - BH / 2;
        colHtml += `<div style="position:absolute;top:${maxTop}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(255,152,0,0.9);border-radius:2.5px;background:rgba(10,14,24,0.85);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${Math.round(d.maxT)}°</div>`;
        colHtml += `<div style="position:absolute;top:${minTop}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(90,150,210,0.9);border-radius:2.5px;background:rgba(10,14,24,0.85);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${Math.round(d.minT)}°</div>`;
      }
      if (showPrecip) {
        const pMax  = Math.max(...data.map(x => x.precip), 0.1);
        const maxBarH = tempH * 0.85; // bars use up to 85% of the temp area height
        if (d.precip > 0) {
          const bH    = Math.max((d.precip / pMax) * maxBarH, 2);
          const bTop  = tempH - bH;
          const label = (d.precip % 1 === 0 ? String(d.precip) : d.precip.toFixed(1)) + ' мм';
          // Bar behind everything (z-index 0), rising from bottom of temp area
          colHtml = `<div style="position:absolute;top:${bTop}px;left:0;right:0;height:${bH}px;background:rgba(151,230,255,0.50);border-radius:2px 2px 0 0;z-index:0;"></div>` + colHtml;
          // Label centered ON the baseline
          colHtml += `<div style="position:absolute;top:${tempH - 6}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(115,198,239,0.85);border-radius:2.5px;background:rgba(10,14,24,0.9);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${label}</div>`;
        } else {
          // 0mm: subtle dash at baseline
          colHtml += `<div style="position:absolute;top:${tempH - 1}px;left:0;right:0;height:2px;background:rgba(151,230,255,0.15);border-radius:1px;"></div>`;
        }
      }
      const colDivH = totalH;
      // Hover tooltip (same CSS mechanism as forecast section)
      const locale = this._config.option_locale || 'bg';
      const ttDate = d.datetime ? new Date(d.datetime).toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' }) : '';
      // wind arrow built in _buildTooltipRows via _getWindUnit()
      // Get condition text from entity_summary_1 — same mechanism as forecast tooltip
      const _summaryStart = this._config.entity_summary_1 ? this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g) : false;
      let _chartCond = '';
      if (this._config.entity_summary_1?.match('^weather.')) {
        const _chartForecast = this.forecast1 && this.forecast1[startIdx + i];
        _chartCond = _chartForecast ? String(_chartForecast.detailed_description ?? _chartForecast.condition ?? '') : '';
      } else if (_summaryStart && this._config.entity_summary_1) {
        const _summaryEntity = this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g, String(Number(_summaryStart) + i));
        _chartCond = this.hass.states[_summaryEntity] ? this.hass.states[_summaryEntity].state : '';
      }
      const _uomWind = this._getWindUnit();
      const _uomPrecip = (this._config.entity ? (this.hass.states[this._config.entity]?.attributes?.precipitation_unit as string | undefined) : undefined) || this.getUOM('precipitation');
      const ttRows3 = this._buildTooltipRows({ date: ttDate, condition: _chartCond, maxT: showTemp ? d.maxT : null, minT: showTemp ? d.minT : null, precip: d.precip, windSpeed: d.windSpeed, windBearDeg: d.windBear, uomPrecip: _uomPrecip, uomWind: _uomWind });
      const tooltipHtml = `<div class="fcasttooltipblock" style="width:${data.length * 100}%;left:-${i * 100}%;">`
        + ttRows3
        + `<span style="position:absolute;top:100%;left:${(100/data.length/2)+i*(100/data.length)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span>`
        + `</div>`;
      return `<div class="day-horiz fcasttooltip" style="position:relative;height:${colDivH}px;overflow:visible;">${tooltipHtml}${colHtml}</div>`;
    }).join('');

    return html`<div class="daily-forecast-horiz-section section"
        style="position:relative;margin-top:4px;margin-bottom:4px;padding-top:0;padding-bottom:0;">
      ${unsafeHTML(linesSvg + colItems)}
    </div>`;
  }

     private _renderDailyForecastSection(): TemplateResult {
    if (this._config?.show_section_daily_forecast === false) return html``;

    if (this._config.daily_forecast_layout !== 'vertical') {
      return this._renderHorizontalDailyForecastSection();
    } else {
      return this._renderVerticalDailyForecastSection();
    }
  }

  protected render(): TemplateResult | void {
    const htmlCode: TemplateResult[] = [];

    //tjl added. Extend Hass to include "formatEntityState"
    this.hassExtended = this.hass as HassFormatEntityState;

    //tjl added/modified
    //  from: https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-weather-forecast-card.ts
    const forecastData = getForecast(
   // WeatherObj.attributes,
      this._forecastEvent,
      this._config?.forecast_type
    );

    //tjl added/modified
    //  from: https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-weather-forecast-card.ts
    this.forecast1 = 
    //this._config?.show_forecast !== false && forecastData?.forecast?.length
      this._config.weather_entity && forecastData?.forecast?.length
      //? forecastData.forecast.slice(0, 5)
        ? forecastData.forecast.slice(0, this._config.daily_forecast_days ? this._config.daily_forecast_days : 5)
        : undefined;
  
    if (this._checkForErrors()) htmlCode.push(this._showConfigWarning(this._error));

    const sections: TemplateResult[] = [];
    if (this._config.section_order !== undefined) {
      this._config.section_order.forEach(section => {
        switch (section) {
          case 'overview':
            sections.push(this._renderOverviewSection());
            break;
          case 'extended':
            sections.push(this._renderExtendedSection());
            break;
          case 'slots':
            sections.push(this._renderSlotsSection());
            break;
          case 'daily_forecast':
            sections.push(this._renderDailyForecastSection());
            sections.push(this._renderChartSection());
            break;
        }
      });
    }

    //tjl modify the ha-card below to match hui-weather-card (except keep class="card" to retain margins, etc). 
    //  from: https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-weather-forecast-card.ts
    // In support of tap/hold/double_tap actions. 

    htmlCode.push(html`
      <style>
        ${this.styles}
      </style>
      <ha-card class="card"
        tabindex=${ifDefined(
          hasAction(this._config.tap_action) ? "0" : undefined
        )}
        ><div class="content">
          ${sections}
        </div>
      </ha-card>
    `);
    return html`${htmlCode}`;
  }

  // ── Action handling ──────────────────────────────────────────────────────
  // click  → tap / double-tap (browser fires only on real tap, not on scroll)
  // pointerdown + 500ms → hold (timer fires before pointercancel on mobile)

  private _pHoldFired = false;
  private _pHoldTimer?: number;
  private _clickCount = 0;
  private _clickTimer?: number;

  private _onPointerDown(e: PointerEvent): void {
    // Only primary pointer (ignore multi-touch)
    if (!e.isPrimary) return;
    this._pHoldFired = false;
    clearTimeout(this._pHoldTimer);
    if (this.hass && this._config && hasAction(this._config?.hold_action)) {
      this._pHoldTimer = window.setTimeout(() => {
        this._pHoldFired = true;
        if (this.hass && this._config) handleAction(this, this.hass, this._config, 'hold');
      }, 500);
    }
  }

  private _onPointerCancel(): void {
    clearTimeout(this._pHoldTimer);
    this._pHoldFired = false;
  }

  private _onCardClick(): void {
    // Suppress click that follows a hold
    if (this._pHoldFired) { this._pHoldFired = false; return; }
    if (!this.hass || !this._config) return;

    if (hasAction(this._config?.double_tap_action)) {
      this._clickCount++;
      if (this._clickCount === 1) {
        this._clickTimer = window.setTimeout(() => {
          this._clickCount = 0;
          if (this.hass && this._config && hasAction(this._config?.tap_action))
            handleAction(this, this.hass, this._config, 'tap');
        }, 250);
      } else {
        clearTimeout(this._clickTimer);
        this._clickCount = 0;
        handleAction(this, this.hass, this._config, 'double_tap');
      }
    } else {
      if (hasAction(this._config?.tap_action)) handleAction(this, this.hass, this._config, 'tap');
    }
  }

  // slots - returns the value to be displyed in a specific current condition slot
  get slotL1(): TemplateResult {
    return this.slotValue('l1', this._config.slot_l1);
  }

  get slotL2(): TemplateResult {
    return this.slotValue('l2', this._config.slot_l2);
  }

  get slotL3(): TemplateResult {
    return this.slotValue('l3', this._config.slot_l3);
  }

  get slotL4(): TemplateResult {
    return this.slotValue('l4', this._config.slot_l4);
  }

  get slotL5(): TemplateResult {
    return this.slotValue('l5', this._config.slot_l5);
  }

  get slotL6(): TemplateResult {
    return this.slotValue('l6', this._config.slot_l6);
  }

  get slotL7(): TemplateResult {
    return this.slotValue('l7', this._config.slot_l7);
  }

  get slotL8(): TemplateResult {
    return this.slotValue('l8', this._config.slot_l8);
  }

  get slotR1(): TemplateResult {
    return this.slotValue('r1', this._config.slot_r1);
  }

  get slotR2(): TemplateResult {
    return this.slotValue('r2', this._config.slot_r2);
  }

  get slotR3(): TemplateResult {
    return this.slotValue('r3', this._config.slot_r3);
  }

  get slotR4(): TemplateResult {
    return this.slotValue('r4', this._config.slot_r4);
  }

  get slotR5(): TemplateResult {
    return this.slotValue('r5', this._config.slot_r5);
  }

  get slotR6(): TemplateResult {
    return this.slotValue('r6', this._config.slot_r6);
  }

  get slotR7(): TemplateResult {
    return this.slotValue('r7', this._config.slot_r7);
  }

  get slotR8(): TemplateResult {
    return this.slotValue('r8', this._config.slot_r8);
  }

  // slots - calculates the specific slot value
  slotValue(slot: string, value: string | undefined): TemplateResult {
    switch (value) {
      case 'pop': return this.slotPop;
      case 'popforecast': return this.slotPopForecast;
      case 'possible_today': return this.slotPos;
      case 'possible_tomorrow': return this.slotPossibleTomorrow;
      case 'rainfall': return this.slotRainfall;
      case 'humidity': return this.slotHumidity;
      case 'pressure': return this.slotPressure;
      case 'observed_max': return this.slotObservedMax;
      case 'observed_min': return this.slotObservedMin;
      case 'forecast_max': return this.slotForecastMax;
      case 'forecast_min': return this.slotForecastMin;
      case 'temp_next': return this.slotTempNext;
      case 'temp_following': return this.slotTempFollowing;
      case 'temp_maximums': return this.slotTempMaximums;
      case 'temp_minimums': return this.slotTempMinimums;
      case 'uv_summary': return this.slotUvSummary;
      case 'fire_danger': return this.slotFireDanger;
      case 'wind': return this.slotWind;
      case 'wind_gust': return this.slotWindGust;
      case 'wind_kt': return this.slotWindKt;
      case 'visibility': return this.slotVisibility;
      case 'sun_next': return this.slotSunNext;
      case 'sun_following': return this.slotSunFollowing;
      case 'moon': return this.slotMoon;
      case 'custom1': return this.slotCustom1;
      case 'custom2': return this.slotCustom2;
      case 'custom3': return this.slotCustom3;
      case 'custom4': return this.slotCustom4;
      case 'empty': return this.slotEmpty;
      case 'remove': return this.slotRemove;
    }

    // If no value can be matched pass back a default for the slot
    switch (slot) {
      case 'l1': return this.slotForecastMax;
      case 'l2': return this.slotForecastMin;
      case 'l3': return this.slotWind;
      case 'l4': return this.slotPressure;
      case 'l5': return this.slotSunNext;
      case 'l6': return this.slotRemove;
      case 'l7': return this.slotRemove;
      case 'l8': return this.slotRemove;
      case 'r1': return this.slotPopForecast;
      case 'r2': return this.slotHumidity;
      case 'r3': return this.slotUvSummary;
      case 'r4': return this.slotMoon;
      case 'r5': return this.slotSunFollowing;
      case 'r6': return this.slotRemove;
      case 'r7': return this.slotRemove;
      case 'r8': return this.slotRemove;
    }
    return this.slotEmpty;
  }

  // getters that return the html for an individual slot
  get slotEmpty(): TemplateResult {
    return html`<li>&nbsp;</li>`;
  }

  get slotRemove(): TemplateResult {
    return html``;
  }

  get slotPopForecast(): TemplateResult {
    //tjl use new forecast subscribe method below
    const forecast_pop = this.forecast1 !== undefined ? this.forecast1[0].precipitation_probability : undefined;

    const pop = this._config.entity_pop && this.hass.states[this._config.entity_pop] !== undefined
      ? this._config.entity_pop.match('^weather.') === null
        ? (this.hass.states[this._config.entity_pop].state === 'unknown' || this.hass.states[this._config.entity_pop].state === 'unavailable')
          ? '---'
          : Math.round(Number(this.hass.states[this._config.entity_pop].state))
        : forecast_pop !== undefined ? Math.round(Number(forecast_pop)) : '---'
      : "---";
    const pop_units = pop !== "---" ? html`<div class="slot-text unit">%</div>` : html``;

    const forecast_pos = this.forecast1 !== undefined ? this.forecast1[0].precipitation : undefined;

    const pos = this._config.entity_pos && this.hass.states[this._config.entity_pos] !== undefined
      ? this._config.entity_pos.match('^weather.') === null
        ? (this.hass.states[this._config.entity_pos].state === 'unknown' || this.hass.states[this._config.entity_pos].state === 'unavailable')
          ? '---'
          : this.hass.states[this._config.entity_pos].state
        : forecast_pos !== undefined ? forecast_pos : '---'
      : "---";
    const pos_units = pos !== "---" ? html`<div class="slot-text unit">${this.getUOM('precipitation')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${pop}</div>${pop_units}<div class="slot-text">&nbsp;</div>
          <div class="slot-text pop-text-today">${pos}</div>${pos_units}
        </div>
      </li>
    `;
  }

  get slotPop(): TemplateResult {
    //tjl using new forecast subscribe method.
    const forecast_pop = this.forecast1 !== undefined ? this.forecast1[0].precipitation_probability : undefined;

    const pop = this._config.entity_pop && this.hass.states[this._config.entity_pop] !== undefined
      ? this._config.entity_pop.match('^weather.') === null
        ? Math.round(Number(this.hass.states[this._config.entity_pop].state))
      //: this.hass.states[this._config.entity_pop].attributes.forecast[0].precipitation_probability !== undefined
        : forecast_pop !== undefined
          ? Math.round(Number(forecast_pop))
        //? Math.round(Number(this.hass.states[this._config.entity_pop].attributes.forecast[0].precipitation_probability))
          : '---'
      : "---";
    const pop_units = pop !== "---" ? html`<div class="slot-text unit">%</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${pop}</div>${pop_units}<div class="slot-text"></div>
        </div>
      </li>
    `;
  }

  get slotPos(): TemplateResult {
    //tjl use new forecast subscribe method below
    const forecast_pos = this.forecast1 !== undefined ? this.forecast1[0].precipitation : undefined;

    const pos = this._config.entity_pos && this.hass.states[this._config.entity_pos] !== undefined
      ? this._config.entity_pos.match('^weather.') === null
        ? this.hass.states[this._config.entity_pos].state
        : forecast_pos !== undefined
      //: this.hass.states[this._config.entity_pos].attributes.forecast[0].precipitation !== undefined
          ? forecast_pos
        //? this.hass.states[this._config.entity_pos].attributes.forecast[0].precipitation
          : '---'
      : "---";
    const units = pos !== "---" ? html`<div class="slot-text unit">${this.getUOM('precipitation')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosToday}&nbsp;<div class="slot-text possible_today-text">${pos}</div>${units}
        </div>
      </li>
    `;
  }

  get slotPossibleTomorrow(): TemplateResult {
    //tjl use new forecast subscribe method below
    const forecast_pos = this.forecast1 !== undefined && this.forecast1.length > 1 ? this.forecast1[1].precipitation : undefined;

    const pos = this._config.entity_possible_tomorrow && this.hass.states[this._config.entity_possible_tomorrow] !== undefined
      ? this._config.entity_possible_tomorrow.match('^weather.') === null
        ? this.hass.states[this._config.entity_possible_tomorrow].state
        : forecast_pos !== undefined
      //: this.hass.states[this._config.entity_possible_tomorrow].attributes.forecast[1].precipitation !== undefined
          ? forecast_pos
        //? this.hass.states[this._config.entity_possible_tomorrow].attributes.forecast[1].precipitation
          : '---'
      : "---";
    const units = pos !== "---" ? html`<div class="slot-text unit">${this.getUOM('precipitation')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosTomorrow}&nbsp;<div class="slot-text possible_tomorrow-text">${pos}</div>${units}
        </div>
      </li>
    `;
  }

  get slotRainfall(): TemplateResult {
    const rainfall = this.currentRainfall;
    const units = rainfall !== "---" ? html`<div class="slot-text unit"></span>${this.getUOM('precipitation')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text rainfall-text">${rainfall}</div>${units}
        </div>
      </li>
    `;
  }

  get slotHumidity(): TemplateResult {
    const humidity = this.currentHumidity;
    const units = humidity !== '---' ? html`<div class="slot-text unit">%</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:water-percent"></ha-icon>
          </div>
          <div class="slot-text humidity-text">${humidity}</div>${units}
        </div>
      </li>`;
  }

  get slotPressure(): TemplateResult {
    const pressure = this.currentPressure;
    const units = pressure !== "---" ? html`<div class="slot-text unit">${this._config.pressure_units ? this._config.pressure_units : this.getUOM('air_pressure')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:gauge"></ha-icon>
          </div>
          <div class="slot-text pressure-text">${this.currentPressure}</div>${units}
        </div>
      </li>
    `;
  }

  get slotObservedMax(): TemplateResult {
    const digits = this._config.option_today_temperature_decimals === true ? 1 : 0;
    const temp = this._config.entity_observed_max && this.hass.states[this._config.entity_observed_max] !== undefined ? (Number(this.hass.states[this._config.entity_observed_max].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp !== "---" ? html`<div class="unit-temp-small">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${temp}</div>${units}
        </div>
      </li>
    `;
  }

  get slotObservedMin(): TemplateResult {
    const digits = this._config.option_today_temperature_decimals === true ? 1 : 0;
    const temp = this._config.entity_observed_min && this.hass.states[this._config.entity_observed_min] !== undefined ? (Number(this.hass.states[this._config.entity_observed_min].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp !== "---" ? html`<div class="unit-temp-small">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${temp}</div>${units}
        </div>
      </li>
    `;
  }

  get slotForecastMax(): TemplateResult {
    //tjl using new forecast subscribe method.
    const temp_max = this.forecast1 !== undefined ? this.forecast1[0].temperature : undefined;

    const digits = this._config.option_today_temperature_decimals === true ? 1 : 0;
    
    const temp = this._config.entity_forecast_max && this.hass.states[this._config.entity_forecast_max] !== undefined
      ? this._config.entity_forecast_max.match('^weather.') === null
        ? (Number(this.hass.states[this._config.entity_forecast_max].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
        : temp_max !== undefined
      //: this.hass.states[this._config.entity_forecast_max].attributes.forecast[0].temperature !== undefined
          ? (Number(temp_max)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
        //? (Number(this.hass.states[this._config.entity_forecast_max].attributes.forecast[0].temperature)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
          : '---'
      : "---";

    const units = temp !== "---" ? html`<div class="unit-temp-small">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMax}&nbsp;</div>
          <div class="slot-text forecast-max-text">${temp}</div>${units}
        </div>
      </li>
    `;
  }

  get slotForecastMin(): TemplateResult {
    //tjl using new forecast subscribe method.
    const temp_low = this.forecast1 !== undefined ? this.forecast1[0].templow : undefined;

    const digits = this._config.option_today_temperature_decimals === true ? 1 : 0;
    const temp = this._config.entity_forecast_min && this.hass.states[this._config.entity_forecast_min] !== undefined
      ? this._config.entity_forecast_min.match('^weather.') === null
        ? (Number(this.hass.states[this._config.entity_forecast_min].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
        : temp_low !== undefined
      //: this.hass.states[this._config.entity_forecast_min].attributes.forecast[0].templow !== undefined
          ? (Number(temp_low)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
        //? (Number(this.hass.states[this._config.entity_forecast_min].attributes.forecast[0].templow)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
          : '---'
      : "---";
    const units = temp !== "---" ? html`<div class="unit-temp-small">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMin}&nbsp;</div>
          <div class="slot-text forecast-min-text">${temp}</div>${units}
        </div>
      </li>
    `;
  }

  get slotTempNext(): TemplateResult {
    const digits = this._config.option_today_temperature_decimals === true ? 1 : 0;
    const icon = this._config.entity_temp_next_label && this.hass.states[this._config.entity_temp_next_label] !== undefined ? this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("min") || this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("low") ? "mdi:thermometer-low" : "mdi:thermometer-high" : "mdi:help-box";
    const temp = this._config.entity_temp_next && this.hass.states[this._config.entity_temp_next] !== undefined ? (Number(this.hass.states[this._config.entity_temp_next].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const label = this._config.entity_temp_next_label && this.hass.states[this._config.entity_temp_next_label] !== undefined ? this.hass.states[this._config.entity_temp_next_label].state : "";
    const units = temp !== "---" ? html`<div class="slot-text unit-temp-small">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${icon}"></ha-icon>
          </div>
          <div class="slot-text temp-next-text">${label} ${temp}</div>
          ${units}
        </div>
      </li>
    `;
  }

  get slotTempFollowing(): TemplateResult {
    const digits = this._config.option_today_temperature_decimals === true ? 1 : 0;
    const icon = this._config.entity_temp_following_label && this.hass.states[this._config.entity_temp_following_label] !== undefined ? this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("min") || this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("low") ? "mdi:thermometer-low" : "mdi:thermometer-high" : "mdi:help-box";
    const temp = this._config.entity_temp_following && this.hass.states[this._config.entity_temp_following] !== undefined ? (Number(this.hass.states[this._config.entity_temp_following].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const label = this._config.entity_temp_following_label && this.hass.states[this._config.entity_temp_following_label] !== undefined ? this.hass.states[this._config.entity_temp_following_label].state : "";
    const units = temp !== "---" ? html`<div class="slot-text unit-temp-small">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${icon}"></ha-icon>
          </div>
          <div class="slot-text temp-following-text">${label} ${temp}</div>
          ${units}
        </div>
      </li>
    `;
  }

  get slotTempMaximums(): TemplateResult {
    const digits = this._config.option_today_temperature_decimals === true ? 1 : 0;
    const temp_obs = this._config.entity_observed_max && this.hass.states[this._config.entity_observed_max] !== undefined ? (Number(this.hass.states[this._config.entity_observed_max].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const temp_for = this._config.entity_forecast_max && this.hass.states[this._config.entity_forecast_max] !== undefined ? (Number(this.hass.states[this._config.entity_forecast_max].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp_obs !== "---" ? html`<div class="unit-temp-small">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${temp_obs}</div>${units}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-max-text">${temp_for}</div>${units}
          <div class="slot-text">)</div>
        </div>
      </li>
    `;
  }

  get slotTempMinimums(): TemplateResult {
    const digits = this._config.option_today_temperature_decimals === true ? 1 : 0;
    const temp_obs = this._config.entity_observed_min && this.hass.states[this._config.entity_observed_min] !== undefined ? (Number(this.hass.states[this._config.entity_observed_min].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const temp_for = this._config.entity_forecast_min && this.hass.states[this._config.entity_forecast_min] !== undefined ? (Number(this.hass.states[this._config.entity_forecast_min].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "---";
    const units = temp_obs !== "---" ? html`<div class="unit-temp-small">${this.getUOM('temperature')}</div>` : html``;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${temp_obs}</div>${units}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-min-text">${temp_for}</div>${units}
          <div class="slot-text">)</div>
        </div>
      </li>
    `;
  }

  get slotUvSummary(): TemplateResult {
    const uv = this._config.entity_uv_alert_summary && this.hass.states[this._config.entity_uv_alert_summary] !== undefined ? this.hass.states[this._config.entity_uv_alert_summary].state !== "unknown" ? this.hass.states[this._config.entity_uv_alert_summary].state : "Not Applicable" : "---";
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-sunny"></ha-icon>
          </div>
          <div class="slot-text daytime-uv-text">${this.localeTextUVRating} ${uv}</div>
        </div>
      </li>
    `;
  }

  get slotFireDanger(): TemplateResult {
    const entity = this._config.entity_fire_danger;
    const fire = entity && this.hass.states[entity] !== undefined ? this.hass.states[entity].state !== 'unknown' ? this._config.option_color_fire_danger === false ? this.hass.states[entity].state : this.hass.states[entity].state.toLocaleUpperCase() : "Not Applicable" : "---";
    var fireStyle = entity && this._config.option_color_fire_danger !== false && this.hass.states[entity].attributes.color_fill ? `background-color:${this.hass.states[entity].attributes.color_fill}; color:${this.hass.states[entity].attributes.color_text};` : "";
    if (this._config.option_color_fire_danger === false) {
      return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:fire"></ha-icon>
          </div>
          <div class="slot-text fire-danger-text" style="${fireStyle}">${fire} </div>
        </div>
      </li>`;
    } else {
      if (fireStyle === '') {
        fireStyle = "font-weight:300; padding-left:0px;";
      }
      return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:fire"></ha-icon>
          </div>
          <div class="slot-text fire-danger-text">
            <p class="fire-danger-text-color" style="${fireStyle}">${fire}</p>
          </div>
        </div>
      </li>`;
    }
  }

  get slotWind(): TemplateResult {
    const beaufort = this._config.entity_wind_speed && this._config.option_show_beaufort ? html`<div class="slot-text">BFT: ${this.currentBeaufort} -&nbsp;</div>` : "";
    const bearing = this._config.entity_wind_bearing ? html`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>` : "";
    const units = html`<div class="slot-text unit">${this.currentWindSpeedUnit}</div>`;
    const speed = this._config.entity_wind_speed ? html`<div class="slot-text">${this.currentWindSpeed}</div>${units}&nbsp;` : "";
    const gust = this._config.entity_wind_gust && this._config.option_show_gust_in_wind !== false ? html`<div class="slot-text">(${this.localeTextGust} ${this.currentWindGust}</div>${units})` : "";
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${beaufort}${bearing}${speed}${gust}
        </div>
      </li>
    `;
  }

  get slotWindGust(): TemplateResult {
    if (!this._config.entity_wind_gust) return html``;
    const units = html`<div class="slot-text unit">${this.currentWindSpeedUnit}</div>`;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy-variant"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextGust}&nbsp;</div>
          <div class="slot-text">${this.currentWindGust}</div>${units}
        </div>
      </li>
    `;
  }

  get slotWindKt(): TemplateResult {
    const beaufort = this._config.entity_wind_speed_kt && this._config.option_show_beaufort ? html`<div class="slot-text">BFT: ${this.currentBeaufortKt} -&nbsp;</div>` : "";
    const bearing = this._config.entity_wind_bearing ? html`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>` : "";
    const units = html`<div class="slot-text unit">Kt</div>`;
    const speed = this._config.entity_wind_speed_kt ? html`<div class="slot-text">${this.currentWindSpeedKt}</div>${units}&nbsp;` : "";
    const gust = this._config.entity_wind_gust_kt ? html`<div class="slot-text">(${this.localeTextGust} ${this.currentWindGustKt}</div>${units})` : "";
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${beaufort}${bearing}${speed}${gust}
        </div>
      </li>
    `;
  }

  get slotVisibility(): TemplateResult {
    const vis = this.currentVisibility;
    const units = vis !== "---" ? this.getUOM('length') : "";
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-fog"></ha-icon>
          </div>
          <div class="slot-text visibility-text">${vis}</div>
          <div class="slot-text unit">${units}</div>
        </div>
      </li>
    `;
  }

  get slotSunNext(): TemplateResult {
    return this._config.entity_sun ? this.sunSet.next : html``;
  }

  get slotSunFollowing(): TemplateResult {
    return this._config.entity_sun ? this.sunSet.following : html``;
  }


  get slotMoon(): TemplateResult {
    if (!this._config.entity_moon) return html``;
    const state = this.hass.states[this._config.entity_moon];
    if (!state) return html``;
    const phase = state.state;
    return html`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${this.moonPhaseIcon(phase)}"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextMoonPhase(phase)}</div>
        </div>
      </li>
    `;
  }

  moonPhaseIcon(phase: string): string {
    switch (phase) {
      case 'new_moon':        return 'mdi:moon-new';
      case 'waxing_crescent': return 'mdi:moon-waxing-crescent';
      case 'first_quarter':   return 'mdi:moon-first-quarter';
      case 'waxing_gibbous':  return 'mdi:moon-waxing-gibbous';
      case 'full_moon':       return 'mdi:moon-full';
      case 'waning_gibbous':  return 'mdi:moon-waning-gibbous';
      case 'last_quarter':    return 'mdi:moon-last-quarter';
      case 'waning_crescent': return 'mdi:moon-waning-crescent';
      default:                return 'mdi:moon-full';
    }
  }

  localeTextMoonPhase(phase: string): string {
    switch (this.locale) {
      case 'bg': switch (phase) {
        case 'new_moon':        return 'Новолуние';
        case 'waxing_crescent': return 'Растящ полумесец';
        case 'first_quarter':   return 'Първа четвърт';
        case 'waxing_gibbous':  return 'Растяща луна';
        case 'full_moon':       return 'Пълнолуние';
        case 'waning_gibbous':  return 'Намаляваща луна';
        case 'last_quarter':    return 'Последна четвърт';
        case 'waning_crescent': return 'Намаляващ полумесец';
        default: break;
      } break;
      case 'ru': switch (phase) {
        case 'new_moon':        return 'Новолуние';
        case 'waxing_crescent': return 'Растущий серп';
        case 'first_quarter':   return 'Первая четверть';
        case 'waxing_gibbous':  return 'Растущая луна';
        case 'full_moon':       return 'Полнолуние';
        case 'waning_gibbous':  return 'Убывающая луна';
        case 'last_quarter':    return 'Последняя четверть';
        case 'waning_crescent': return 'Убывающий серп';
        default: break;
      } break;
      case 'ua': switch (phase) {
        case 'new_moon':        return 'Новий місяць';
        case 'waxing_crescent': return 'Молодий місяць';
        case 'first_quarter':   return 'Перша чверть';
        case 'waxing_gibbous':  return 'Зростаючий місяць';
        case 'full_moon':       return 'Повний місяць';
        case 'waning_gibbous':  return 'Спадаючий місяць';
        case 'last_quarter':    return 'Остання чверть';
        case 'waning_crescent': return 'Старий місяць';
        default: break;
      } break;
      case 'de': switch (phase) {
        case 'new_moon':        return 'Neumond';
        case 'waxing_crescent': return 'Zunehmende Sichel';
        case 'first_quarter':   return 'Erstes Viertel';
        case 'waxing_gibbous':  return 'Zunehmender Mond';
        case 'full_moon':       return 'Vollmond';
        case 'waning_gibbous':  return 'Abnehmender Mond';
        case 'last_quarter':    return 'Letztes Viertel';
        case 'waning_crescent': return 'Abnehmende Sichel';
        default: break;
      } break;
      case 'fr': switch (phase) {
        case 'new_moon':        return 'Nouvelle lune';
        case 'waxing_crescent': return 'Croissant';
        case 'first_quarter':   return 'Premier quartier';
        case 'waxing_gibbous':  return 'Lune croissante';
        case 'full_moon':       return 'Pleine lune';
        case 'waning_gibbous':  return 'Lune décroissante';
        case 'last_quarter':    return 'Dernier quartier';
        case 'waning_crescent': return 'Dernier croissant';
        default: break;
      } break;
      case 'it': switch (phase) {
        case 'new_moon':        return 'Luna nuova';
        case 'waxing_crescent': return 'Luna crescente';
        case 'first_quarter':   return 'Primo quarto';
        case 'waxing_gibbous':  return 'Luna quasi piena';
        case 'full_moon':       return 'Luna piena';
        case 'waning_gibbous':  return 'Luna calante';
        case 'last_quarter':    return 'Ultimo quarto';
        case 'waning_crescent': return 'Falce calante';
        default: break;
      } break;
      case 'nl': switch (phase) {
        case 'new_moon':        return 'Nieuwe maan';
        case 'waxing_crescent': return 'Wassende sikkel';
        case 'first_quarter':   return 'Eerste kwartier';
        case 'waxing_gibbous':  return 'Wassende maan';
        case 'full_moon':       return 'Volle maan';
        case 'waning_gibbous':  return 'Afnemende maan';
        case 'last_quarter':    return 'Laatste kwartier';
        case 'waning_crescent': return 'Afnemende sikkel';
        default: break;
      } break;
      case 'pl': switch (phase) {
        case 'new_moon':        return 'Nów';
        case 'waxing_crescent': return 'Sierp rosnący';
        case 'first_quarter':   return 'Pierwsza kwadra';
        case 'waxing_gibbous':  return 'Rosnący księżyc';
        case 'full_moon':       return 'Pełnia';
        case 'waning_gibbous':  return 'Malejący księżyc';
        case 'last_quarter':    return 'Ostatnia kwadra';
        case 'waning_crescent': return 'Sierp ubywający';
        default: break;
      } break;
      case 'da': switch (phase) {
        case 'new_moon':        return 'Nymåne';
        case 'waxing_crescent': return 'Voksende måne';
        case 'first_quarter':   return 'Første kvartal';
        case 'waxing_gibbous':  return 'Voksende måne';
        case 'full_moon':       return 'Fuldmåne';
        case 'waning_gibbous':  return 'Aftagende måne';
        case 'last_quarter':    return 'Sidste kvartal';
        case 'waning_crescent': return 'Aftagende måne';
        default: break;
      } break;
      case 'es': switch (phase) {
        case 'new_moon':        return 'Luna nueva';
        case 'waxing_crescent': return 'Creciente';
        case 'first_quarter':   return 'Cuarto creciente';
        case 'waxing_gibbous':  return 'Luna creciente';
        case 'full_moon':       return 'Luna llena';
        case 'waning_gibbous':  return 'Luna menguante';
        case 'last_quarter':    return 'Cuarto menguante';
        case 'waning_crescent': return 'Menguante';
        default: break;
      } break;
      case 'he': switch (phase) {
        case 'new_moon':        return 'ירח חדש';
        case 'waxing_crescent': return 'סהר בגדילה';
        case 'first_quarter':   return 'רבע ראשון';
        case 'waxing_gibbous':  return 'ירח גדל';
        case 'full_moon':       return 'ירח מלא';
        case 'waning_gibbous':  return 'ירח קטן';
        case 'last_quarter':    return 'רבע אחרון';
        case 'waning_crescent': return 'סהר בקטנה';
        default: break;
      } break;
    }
    // default: capitalise the HA phase key
    return phase.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  get slotCustom1(): TemplateResult {
    var icon = this._config.custom1_icon ? this._config.custom1_icon : 'mdi:help-box';
    var value = this._config.custom1_value && this.hass.states[this._config.custom1_value] !== undefined ? this.hass.states[this._config.custom1_value].state : 'unknown';
    var unit = this._config.custom1_units ? this._config.custom1_units : '';
    var label = this._config.custom1_label ? this._config.custom1_label : '';
    return html`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        ${label ? html`<div class="slot-text label-text">${label}</div>` : html``}
        <div class="slot-text custom-1-text">${value}</div><div class="slot-text unit">${unit}</div>
      </li>
    `;
  }

  get slotCustom2(): TemplateResult {
    var icon = this._config.custom2_icon ? this._config.custom2_icon : 'mdi:help-box';
    var value = this._config.custom2_value && this.hass.states[this._config.custom2_value] !== undefined ? this.hass.states[this._config.custom2_value].state : 'unknown';
    var unit = this._config.custom2_units ? this._config.custom2_units : '';
    var label = this._config.custom2_label ? this._config.custom2_label : '';
    return html`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        ${label ? html`<div class="slot-text label-text">${label}</div>` : html``}
        <div class="slot-text custom-2-text">${value}</div><div class="slot-text unit">${unit}</div>
      </li>
    `;
  }

  get slotCustom3(): TemplateResult {
    var icon = this._config.custom3_icon ? this._config.custom3_icon : 'mdi:help-box';
    var value = this._config.custom3_value && this.hass.states[this._config.custom3_value] !== undefined ? this.hass.states[this._config.custom3_value].state : 'unknown';
    var unit = this._config.custom3_units ? this._config.custom3_units : '';
    var label = this._config.custom3_label ? this._config.custom3_label : '';
    return html`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        ${label ? html`<div class="slot-text label-text">${label}</div>` : html``}
        <div class="slot-text custom-3-text">${value}</div><div class="slot-text unit">${unit}</div>
      </li>
    `;
  }

  get slotCustom4(): TemplateResult {
    var icon = this._config.custom4_icon ? this._config.custom4_icon : 'mdi:help-box';
    var value = this._config.custom4_value && this.hass.states[this._config.custom4_value] !== undefined ? this.hass.states[this._config.custom4_value].state : 'unknown';
    var unit = this._config.custom4_units ? this._config.custom4_units : '';
    var label = this._config.custom4_label ? this._config.custom4_label : '';
    return html`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${icon}></ha-icon>
        </div>
        ${label ? html`<div class="slot-text label-text">${label}</div>` : html``}
        <div class="slot-text custom-4-text">${value}</div><div class="slot-text unit">${unit}</div>
      </li>
    `;
  }

  // getters that return the value to be shown
  get forecastIcon(): string {
    const entity = this._config.entity_forecast_icon;
    return entity && this.hass.states[entity]
      ? this.hass.states[entity].state
      : '---';
  }

  get currentTemperature(): string {
    const entity = this._config.entity_temperature;
    const digits = this._config.option_show_overview_decimals === true ? 1 : 0;
    return entity && this.hass.states[entity]
      ? entity.match('^weather.') === null
        ? (Number(this.hass.states[entity].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
        : this.hass.states[entity].attributes.temperature !== undefined
          ? (Number(this.hass.states[entity].attributes.temperature)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
          : '---'
      : '---';
  }

  get currentApparentTemperature(): string {
    const entity = this._config.entity_apparent_temp;
    const digits = this._config.option_show_overview_decimals === true ? 1 : 0;
    //tjl Feature Add - Add capability to get Apparent Temperature from weather entity attribute
    if ( entity && this.hass.states[entity] ){
      return entity && this.hass.states[entity]
        ? entity.match('^weather.') === null
          ? (Number(this.hass.states[entity].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
          : this.hass.states[entity].attributes.apparent_temperature !== undefined
            ? (Number(this.hass.states[entity].attributes.apparent_temperature)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
            : '---'
        : '---';
    } else {
      return '';
    }
  //return entity && this.hass.states[entity]
  //  ? (Number(this.hass.states[entity].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
  //  : '';
  }

  get currentHumidity(): string {
    const entity = this._config.entity_humidity;
    return entity && this.hass.states[entity]
      ? entity.match('^weather.') === null
        ? (this.hass.states[entity].state === 'unknown' || this.hass.states[entity].state === 'unavailable')
          ? '---'
          : (Number(this.hass.states[entity].state)).toLocaleString(this.locale)
        : this.hass.states[entity].attributes.humidity !== undefined
          ? (Number(this.hass.states[entity].attributes.humidity)).toLocaleString(this.locale)
          : '---'
      : '---';
  }

  get currentRainfall(): string {
    const entity = this._config.entity_rainfall;
    const digits = this._config.option_today_rainfall_decimals === true ? 1 : 0;
    return entity && this.hass.states[entity]
      ? (this.hass.states[entity].state === 'unknown' || this.hass.states[entity].state === 'unavailable')
        ? '---'
        : (Number(this.hass.states[entity].state)).toLocaleString(this.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
      : '---';
  }

  get currentPressure(): string {
    const entity = this._config.entity_pressure;
    var places = this._config.option_pressure_decimals ? Math.max(Math.min(this._config.option_pressure_decimals, 3), 0) : 0;
    return entity && this.hass.states[entity]
      ? entity.match('^weather.') === null
        ? (this.hass.states[entity].state === 'unknown' || this.hass.states[entity].state === 'unavailable')
          ? '---'
          : (Number(this.hass.states[entity].state)).toLocaleString(this.locale, { minimumFractionDigits: places, maximumFractionDigits: places })
        : this.hass.states[entity].attributes.pressure !== undefined
          ? (Number(this.hass.states[entity].attributes.pressure)).toLocaleString(this.locale)
          : '---'
      : '---';
  }

  get currentVisibility(): string {
    const entity = this._config.entity_visibility;
    return entity && this.hass.states[entity]
      ? entity.match('^weather.') === null
        ? (this.hass.states[entity].state === 'unknown' || this.hass.states[entity].state === 'unavailable')
          ? '---'
          : (Number(this.hass.states[entity].state)).toLocaleString(this.locale)
        : this.hass.states[entity].attributes.visibility !== undefined
          ? (Number(this.hass.states[entity].attributes.visibility)).toLocaleString(this.locale)
          : '---'
      : '---';
  }

  get currentWindBearing(): string {
    const entity = this._config.entity_wind_bearing;
    return entity && this.hass.states[entity]
      ? entity.match('^weather.') === null
        ? isNaN(Number(this.hass.states[entity].state))
          ? this.hass.states[entity].state
          : this.windDirections[(Math.round((Number(this.hass.states[entity].state) / 360) * 16))]
        : this.hass.states[entity].attributes.wind_bearing !== undefined
          ? isNaN(Number(this.hass.states[entity].attributes.wind_bearing))
            ? this.hass.states[entity].attributes.wind_bearing
            : this.windDirections[(Math.round((Number(this.hass.states[entity].attributes.wind_bearing) / 360) * 16))]
          : '---'
      : '---';
  }

  get currentWindSpeed(): string {
    const entity = this._config.entity_wind_speed;
    return entity && this.hass.states[entity]
      ? entity.match('^weather.') === null
        ? Math.round(Number(this.hass.states[entity].state)).toLocaleString(this.locale)
        : this.hass.states[entity].attributes.wind_speed !== undefined
          ? Math.round(Number(this.hass.states[entity].attributes.wind_speed)).toLocaleString(this.locale)
          : '---'
      : '---';
  }

  get currentWindSpeedUnit(): string {
    const entity = this._config.entity_wind_speed;
    if (!entity || !this.hass.states[entity]) return this.getUOM('length') + '/h';
    if (entity.match('^weather.') !== null) {
      const unit = this.hass.states[entity].attributes.wind_speed_unit;
      return unit !== undefined ? unit : this.getUOM('length') + '/h';
    }
    return this.getUOM('length') + '/h';
  }

  get currentWindGust(): string {
    const entity = this._config.entity_wind_gust;

    //tjl Feature Add - Add capability to get current Wind Gust from weather entity attribute
    return entity && this.hass.states[entity]
      ? entity.match('^weather.') === null
        ? Math.round(Number(this.hass.states[entity].state)).toLocaleString(this.locale)
        : this.hass.states[entity].attributes.wind_gust_speed !== undefined
          ? Math.round(Number(this.hass.states[entity].attributes.wind_gust_speed)).toLocaleString(this.locale)
          : '---'
      : '---';

  //return entity && this.hass.states[entity]
  //  ? Math.round(Number(this.hass.states[entity].state)).toLocaleString(this.locale) : '---';
  }

  get currentWindSpeedKt(): string {
    const entity = this._config.entity_wind_speed_kt;
    return entity && this.hass.states[entity]
      ? entity.match('^weather.') === null
        ? Math.round(Number(this.hass.states[entity].state)).toLocaleString(this.locale)
        : this.hass.states[entity].attributes.wind_speed !== undefined
          ? Math.round(Number(this.hass.states[entity].attributes.wind_speed)).toLocaleString(this.locale)
          : '---'
      : '---';
  }

  get currentWindGustKt(): string {
    const entity = this._config.entity_wind_gust_kt;
    return entity && this.hass.states[entity]
      ? Math.round(Number(this.hass.states[entity].state)).toLocaleString(this.locale) : '---';
  }

  // windDirections - returns set of possible wind directions by specified language
  get windDirections(): string[] {
    const windDirections_en = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
    const windDirections_fr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO', 'N'];
    const windDirections_de = ['N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
    const windDirections_nl = ['N', 'NNO', 'NO', 'ONO', 'O', 'OZO', 'ZO', 'ZZO', 'Z', 'ZZW', 'ZW', 'WZW', 'W', 'WNW', 'NW', 'NNW', 'N'];
    const windDirections_he = ['צפון', 'צ-צ-מז', 'צפון מזרח', 'מז-צ-מז', 'מזרח', 'מז-ד-מז', 'דרום מזרח', 'ד-ד-מז', 'דרום', 'ד-ד-מע', 'דרום מערב', 'מע-ד-מע', 'מערב', 'מע-צ-מע', 'צפון מערב', 'צ-צ-מע', 'צפון'];
    const windDirections_da = ['N', 'NNØ', 'NØ', 'ØNØ', 'Ø', 'ØSØ', 'SØ', 'SSØ', 'S', 'SSV', 'SV', 'VSV', 'V', 'VNV', 'NV', 'NNV', 'N'];
    const windDirections_ru = ['С', 'ССВ', 'СВ', 'ВСВ', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ', 'С'];
    const windDirections_es = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO', 'N'];
    const windDirections_bg = ['С', 'ССИ', 'СИ', 'ИСИ', 'И', 'ИЮИ', 'ЮИ', 'ЮЮИ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ', 'С'];

    switch (this.locale) {
      case "it":
      case "fr":
        return windDirections_fr;
      case "de":
        return windDirections_de;
      case "nl":
        return windDirections_nl;
      case "es":
        return windDirections_es;
      case "he":
        return windDirections_he;
      case "ru":
        return windDirections_ru;
      case "da":
        return windDirections_da;
      case "bg":
        return windDirections_bg;
      default:
        return windDirections_en;
    }
  }

  // beaufortWind - returns the wind speed on the beaufort scale
  // reference https://en.wikipedia.org/wiki/Beaufort_scale
  get currentBeaufort(): string {
    const entity = this._config.entity_wind_speed;
    if (entity && this.hass.states[entity] && !isNaN(Number(this.hass.states[entity].state))) {
      const value = Number(this.hass.states[entity].state);
      switch (this.hass.states[entity].attributes.unit_of_measurement) {
        case 'mph':
          if (value >= 73) return '12';
          if (value >= 64) return '11';
          if (value >= 55) return '10';
          if (value >= 47) return '9';
          if (value >= 39) return '8';
          if (value >= 32) return '7';
          if (value >= 25) return '6';
          if (value >= 19) return '5';
          if (value >= 13) return '4';
          if (value >= 8) return '3';
          if (value >= 4) return '2';
          if (value >= 1) return '1';
          return '0';
        case 'm/s':
          if (value >= 32.7) return '12';
          if (value >= 28.5) return '11';
          if (value >= 24.5) return '10';
          if (value >= 20.8) return '9';
          if (value >= 17.2) return '8';
          if (value >= 13.9) return '7';
          if (value >= 10.8) return '6';
          if (value >= 8) return '5';
          if (value >= 5.5) return '4';
          if (value >= 3.4) return '3';
          if (value >= 1.6) return '2';
          if (value >= 0.5) return '1';
          return '0';
        default: // Assume km/h
          if (value >= 118) return '12';
          if (value >= 103) return '11';
          if (value >= 89) return '10';
          if (value >= 75) return '9';
          if (value >= 62) return '8';
          if (value >= 50) return '7';
          if (value >= 39) return '6';
          if (value >= 29) return '5';
          if (value >= 20) return '4';
          if (value >= 12) return '3';
          if (value >= 6) return '2';
          if (value >= 2) return '1';
          return '0';
      }
    }
    return '---';
  }

  get currentBeaufortKt(): string {
    const entity = this._config.entity_wind_speed_kt;
    if (entity && this.hass.states[entity] && !isNaN(Number(this.hass.states[entity].state))) {
      const value = Number(this.hass.states[entity].state);
      {
        if (value >= 64) return '12';
        if (value >= 56) return '11';
        if (value >= 48) return '10';
        if (value >= 41) return '9';
        if (value >= 34) return '8';
        if (value >= 28) return '7';
        if (value >= 22) return '6';
        if (value >= 17) return '5';
        if (value >= 11) return '4';
        if (value >= 7) return '3';
        if (value >= 4) return '2';
        if (value >= 1) return '1';
        return '0';
      }
    }
    return '---';
  }

  // SunSetAndRise: returns set and rise information
  get sunSet(): { next: TemplateResult, following: TemplateResult, nextText: string, followingText: string, nextIcon: string, followingIcon: string } {
    var nextSunSet: string;
    var nextSunRise: string;
    switch (this.timeFormat) {
      case '12hour':
        nextSunSet = this._config.entity_sun && (this.hass.states[this._config.entity_sun] !== undefined) ? new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" am", "am").replace(" pm", "pm") : "";
        nextSunRise = this._config.entity_sun && (this.hass.states[this._config.entity_sun] !== undefined) ? new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(" am", "am").replace(" pm", "pm") : "";
        break;
      case '24hour':
        nextSunSet = this._config.entity_sun && (this.hass.states[this._config.entity_sun] !== undefined) ? new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit', hour12: false }) : "";
        nextSunRise = this._config.entity_sun && (this.hass.states[this._config.entity_sun] !== undefined) ? new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit', hour12: false }) : "";
        break;
      case 'system':
        nextSunSet = this._config.entity_sun && (this.hass.states[this._config.entity_sun] !== undefined) ? new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(navigator.language, { timeStyle: 'short' }).replace(" am", "am").replace(" pm", "pm") : "";
        nextSunRise = this._config.entity_sun && (this.hass.states[this._config.entity_sun] !== undefined) ? new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(navigator.language, { timeStyle: 'short' }).replace(" am", "am").replace(" pm", "pm") : "";
        break;
    }
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    if ((this._config.entity_sun) && (this.hass.states[this._config.entity_sun] !== undefined)) {
      const _sunElevation = this.hass.states[this._config.entity_sun].attributes?.elevation;
      const _sunAbove = _sunElevation !== undefined ? _sunElevation > 0 : this.hass.states[this._config.entity_sun].state === 'above_horizon';
      if (_sunAbove) {
        nextSunRise = nextDate.toLocaleDateString(this.locale, { weekday: 'short' }) + " " + nextSunRise;
        return {
          'next': html`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${nextSunSet}</div>
            </li>`,
          'following': html`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${nextSunRise}</div>
            </li>`,
          'nextText': nextSunSet,
          'followingText': nextSunRise,
          'nextIcon': "mdi:weather-sunset-down",
          'followingIcon': "mdi:weather-sunset-up",
        };
      } else {
        if (new Date().getDate() != new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).getDate()) {
          nextSunRise = nextDate.toLocaleDateString(this.locale, { weekday: 'short' }) + " " + nextSunRise;
          nextSunSet = nextDate.toLocaleDateString(this.locale, { weekday: 'short' }) + " " + nextSunSet;
        }
        return {
          'next': html`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${nextSunRise}</div>
            </li>`,
          'following': html`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${nextSunSet}</div>
            </li>`,
          'nextText': nextSunRise,
          'followingText': nextSunSet,
          'nextIcon': "mdi:weather-sunset-up",
          'followingIcon': "mdi:weather-sunset-down",
        };
      }
    } else {
      return {
        'next': html``,
        'following': html``,
        nextText: "",
        followingText: "",
        nextIcon: "",
        followingIcon: ""
      }
    }
  }

  // is12Hour - returns true if 12 hour clock or false if 24
  get timeFormat(): timeFormat {
    if (this._config.option_time_format && this._config.option_time_format !== 'system') {
      return this._config.option_time_format;
    }
    // Read from HA system settings (Settings → Profile → Time format)
    const haTimeFormat = this.hass?.locale?.time_format;
    if (haTimeFormat === '12') return '12hour';
    if (haTimeFormat === '24') return '24hour';
    return 'system';
  }

  private _formatDate(d: Date): string {
    const haDateFormat = (this.hass?.locale as any)?.date_format;
    const locale = this.locale || navigator.language;
    switch (haDateFormat) {
      case 'DMY':
        return d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).replace(',', '');
      case 'MDY':
        return d.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).replace(',', '');
      case 'YMD':
        return d.toLocaleDateString(locale, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).replace(',', '');
      default:
        // 'language' or undefined — use locale default
        return d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).replace(',', '');
    }
  }

  // get the icon that matches the current conditions
  private _getIconUrl(iconName: string, forForecast = false): string {
    const pack = this._config?.icon_pack ?? 'default';
    const adjusted = forForecast ? iconName.replace('-night', '-day') : iconName;

    if (pack === 'default') {
      const prefix = this._config?.option_static_icons ? 's-' : 'a-';
      return this._iconBaseUrl() + prefix + adjusted + '.svg';
    }

    const wccName = this._iconToWcc(adjusted);
    if (pack === 'wcc-2') return `/hacsfiles/weather-chart-card/icons2/${wccName}.svg`;
    const metName = this._iconToMeteocons(adjusted);
    if (pack === 'meteocons-fill') return `https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/fill/all/${metName}.svg`;
    if (pack === 'meteocons-line') return `https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/line/all/${metName}.svg`;
    if (pack === 'custom' && this._config?.icon_pack_path)
      return this._config.icon_pack_path.replace('{condition}', wccName);

    // fallback to default
    const prefix = this._config?.option_static_icons ? 's-' : 'a-';
    return this._iconBaseUrl() + prefix + adjusted + '.svg';
  }

  // Base directory of the card JS — strips filename AND query string
  // (import.meta.url may carry ?v=/?hacstag= cache-busting params that
  //  must not leak into icon URLs)
  private _iconBaseUrl(): string {
    const url = import.meta.url.split('?')[0];
    return url.substring(0, url.lastIndexOf('/') + 1);
  }

  private _iconToWcc(iconName: string): string {
    // Maps the OUTPUT of _weatherIcon() (internal icon names) to WCC filenames
    const map: { [key: string]: string } = {
      'clear-day':                      'clear-day',
      'clear-night':                    'clear-night',
      'cloudy-1-day':                   'partlycloudy-day',
      'cloudy-1-night':                 'partlycloudy-night',
      'cloudy-2-day':                   'partlycloudy-day',
      'cloudy-2-night':                 'partlycloudy-night',
      'cloudy':                         'cloudy',
      'haze-day':                       'fog',
      'haze-night':                     'fog',
      'frost-day':                      'snow',
      'frost-night':                    'snow',
      'rainy-2':                        'rain',
      'wind':                           'wind',
      'fog-day':                        'fog',
      'fog-night':                      'fog',
      'rainy-1-day':                    'rain',
      'rainy-1-night':                  'rain',
      'rainy-3-day':                    'rain',
      'rainy-3-night':                  'rain',
      'dust':                           'exceptional',
      'snowy-3':                        'snow',
      'snow-and-sleet-mix':             'sleet',
      'scattered-thunderstorms-day':    'lightning-rain',
      'scattered-thunderstorms-night':  'lightning-rain',
      'rainy-3':                        'pouring',
      'tropical-storm':                 'exceptional',
      'rain-and-sleet-mix':             'sleet',
      'hail':                           'hail',
      'isolated-thunderstorms-day':     'lightning',
      'isolated-thunderstorms-night':   'lightning',
      'unknown':                        'exceptional',
    };
    return map[iconName] ?? 'exceptional';
  }

  private _iconToMeteocons(iconName: string): string {
    // Maps the OUTPUT of _weatherIcon() (internal icon names) to Meteocons filenames
    const map: { [key: string]: string } = {
      'clear-day':                      'clear-day',
      'clear-night':                    'clear-night',
      'cloudy-1-day':                   'partly-cloudy-day',
      'cloudy-1-night':                 'partly-cloudy-night',
      'cloudy-2-day':                   'partly-cloudy-day',
      'cloudy-2-night':                 'partly-cloudy-night',
      'cloudy':                         'cloudy',
      'haze-day':                       'haze',
      'haze-night':                     'haze',
      'frost-day':                      'snow',
      'frost-night':                    'snow',
      'rainy-2':                        'drizzle',
      'wind':                           'wind',
      'fog-day':                        'fog',
      'fog-night':                      'fog',
      'rainy-1-day':                    'rain',
      'rainy-1-night':                  'rain',
      'rainy-3-day':                    'rain',
      'rainy-3-night':                  'rain',
      'dust':                           'dust-wind',
      'snowy-3':                        'snow',
      'snow-and-sleet-mix':             'sleet',
      'scattered-thunderstorms-day':    'thunderstorms-rain',
      'scattered-thunderstorms-night':  'thunderstorms-rain',
      'rainy-3':                        'rain',
      'tropical-storm':                 'tornado',
      'rain-and-sleet-mix':             'sleet',
      'hail':                           'hail',
      'isolated-thunderstorms-day':     'thunderstorms',
      'isolated-thunderstorms-night':   'thunderstorms',
      'unknown':                        'not-available',
    };
    return map[iconName] ?? 'not-available';
  }

  private _weatherIcon(conditions: string): string {
    switch (conditions) {
      case 'sunny':
      case 'clear': return this.iconClear;
      case 'mostly-sunny':
      case 'mostly_sunny': return this.iconMostlySunny;
      case 'partly-cloudy':
      case 'partly_cloudy':
      case 'partlycloudy': return this.iconPartlyCloudy;
      case 'cloudy': return this.iconCloudy;
      case 'hazy':
      case 'hazey':
      case 'haze': return this.iconHazy;
      case 'frost': return this.iconFrost;
      case 'light-rain':
      case 'light_rain': return this.iconLightRain;
      case 'wind':
      case 'windy': return this.iconWindy;
      case 'fog':
      case 'foggy': return this.iconFog;
      case 'showers':
      case 'shower': return this.iconShowers;
      case 'rain':
      case 'rainy': return this.iconRain;
      case 'dust':
      case 'dusty': return this.iconDust;
      case 'snow':
      case 'snowy': return this.iconSnow;
      case 'snowy-rainy':
      case 'snowy_rainy':
      case 'snowyrainy': return this.iconSnowRain;
      case 'storm':
      case 'stormy': return this.iconStorm;
      case 'light-showers':
      case 'light-shower':
      case 'light_showers':
      case 'light_shower': return this.iconLightShowers;
      case 'heavy-showers':
      case 'heavy-shower':
      case 'heavy_showers':
      case 'heavy_shower':
      case 'pouring': return this.iconHeavyShowers;
      case 'tropical-cyclone':
      case 'tropical_cyclone':
      case 'tropicalcyclone': return this.iconCyclone;
      case 'clear-day':
      case 'clear_day': return this.iconClearDay;
      case 'clear-night':
      case 'clear_night': return this.iconClearNight;
      case 'sleet': return this.iconSleet;
      case 'partly-cloudy-day':
      case 'partly_cloudy_day': return this.iconPartlyCloudyDay;
      case 'partly-cloudy-night':
      case 'partly_cloudy_night': return this.iconPartlyCloudyNight;
      case 'hail': return this.iconHail;
      case 'lightning':
      case 'lightning-rainy':
      case 'lightning_rainy':
      case 'thunderstorm': return this.iconLightning;
      case 'windy-variant':
      case 'windy_variant': return this.iconWindyVariant;
    }
    return 'unknown';
  }

  get dayOrNight(): string {
    if (this._config.entity_sun && this.hass.states[this._config.entity_sun] !== undefined) {
      const sun = this.hass.states[this._config.entity_sun];
      // Use numeric elevation attribute — language-independent (state string is translated in non-English HA)
      if (sun.attributes?.elevation !== undefined) {
        return sun.attributes.elevation > 0 ? 'day' : 'night';
      }
      // Fallback: English state strings only
      return sun.state === 'above_horizon' ? 'day' : 'night';
    }
    return 'day';
  }

  get iconClear(): string {
    return `clear-${this.dayOrNight}`;
  }

  get iconMostlySunny(): string {
    return `cloudy-1-${this.dayOrNight}`;
  }

  get iconPartlyCloudy(): string {
    return `cloudy-2-${this.dayOrNight}`;
  }

  get iconCloudy(): string {
    return `cloudy`;
  }

  get iconHazy(): string {
    return `haze-${this.dayOrNight}`;
  }

  get iconFrost(): string {
    return `frost-${this.dayOrNight}`;
  }

  get iconLightRain(): string {
    return `rainy-2`;
  }

  get iconWindy(): string {
    return `wind`;
  }

  get iconFog(): string {
    return `fog-${this.dayOrNight}`;
  }

  get iconShowers(): string {
    return `rainy-1-${this.dayOrNight}`;
  }

  get iconRain(): string {
    return `rainy-3-${this.dayOrNight}`;
  }

  get iconDust(): string {
    return `dust`;
  }

  get iconSnow(): string {
    return `snowy-3`;
  }

  get iconSnowRain(): string {
    return `snow-and-sleet-mix`;
  }

  get iconStorm(): string {
    return `scattered-thunderstorms-${this.dayOrNight}`;
  }

  get iconLightShowers(): string {
    return `rainy-1-${this.dayOrNight}`;
  }

  get iconHeavyShowers(): string {
    return `rainy-3`;
  }

  get iconCyclone(): string {
    return `tropical-storm`;
  }

  get iconClearDay(): string {
    return `clear-day`;
  }

  get iconClearNight(): string {
    return `clear-night`;
  }

  get iconSleet(): string {
    return `rain-and-sleet-mix`;
  }

  get iconPartlyCloudyDay(): string {
    return `cloudy-1-day`;
  }

  get iconPartlyCloudyNight(): string {
    return `cloudy-1-night`;
  }

  get iconHail(): string {
    return `hail`;
  }

  get iconLightning(): string {
    return `isolated-thunderstorms-${this.dayOrNight}`;
  }

  get iconWindyVariant(): string {
    return `wind`;
  }

  get compact(): boolean {
    return this._config?.option_compact_slots === true;
  }

  get locale(): string | undefined {
    try {
      Intl.NumberFormat(this._config.option_locale);
      return this._config.option_locale;
    } catch (e) {
      return undefined;
    }
  }

  get localeTextFeelsLike(): string {
    switch (this.locale) {
      case 'it': return "Percepito";
      case 'fr': return "Ressenti";
      case 'de': return "Gefühlt";
      case 'nl': return "Voelt als";
      case 'pl': return "Odczuwalne";
      case 'he': return "מרגיש כמו";
      case 'da': return "Føles som";
      case 'ru': return "Ощущается как";
      case 'es': return "Sensación";
      case 'ua': return "Відчувається як";
      case 'bg': return "Усеща се като";
      default: return "Feels like";
    }
  }

  get localeTextObservedMax(): string {
    if (this.compact) return this.localeTextObsMax;
    switch (this.locale) {
      case 'it': return "Osservata Max";
      case 'fr': return "Observé Max";
      case 'de': return "Beobachtet Max";
      case 'nl': return "Opgemerkt Max";
      case 'pl': return "Zaobserwowany Max";
      case 'he': return "נצפה מקסימום";
      case 'da': return "Observeret Max";
      case 'ru': return "Наблюдаемый макс.";
      case 'es': return "Observado Max";
      case 'ua': return "Спостережуваний макс.";
      case 'bg': return "Наблюдавано макс.";
      default: return "Observed Max";
    }
  }

  get localeTextObservedMin(): string {
    if (this.compact) return this.localeTextObsMin;
    switch (this.locale) {
      case 'it': return "Osservata Min";
      case 'fr': return "Observé Min";
      case 'de': return "Beobachtet Min";
      case 'nl': return "Opgemerkt Min";
      case 'pl': return "Zaobserwowany Min";
      case 'he': return "נצפה מינימום";
      case 'da': return "Observeret Min";
      case 'ru': return "Наблюдаемый мин.";
      case 'es': return "Observado Min";
      case 'ua': return "Спостережуваний мін.";
      case 'bg': return "Наблюдавано мин.";
      default: return "Observed Min";
    }
  }

  get localeTextObsMax(): string {
    switch (this.locale) {
      case 'it': return "Oss Max";
      case 'fr': return "Obs Max";
      case 'de': return "Beob Max";
      case 'nl': return "Opgem Max";
      case 'pl': return "Obs Max";
      case 'he': return "נצפה מקס";
      case 'da': return "Obs Max";
      case 'ru': return "Набл макс.";
      case 'es': return "Obs Max";
      case 'ua': return "Спост макс.";
      case 'bg': return "Набл. макс.";
      default: return "Obs Max";
    }
  }

  get localeTextObsMin(): string {
    switch (this.locale) {
      case 'it': return "Oss Min";
      case 'fr': return "Obs Min";
      case 'de': return "Beob Min";
      case 'nl': return "Opgem Min";
      case 'pl': return "Obs Min";
      case 'he': return "נצפה מינ";
      case 'da': return "Obs Min";
      case 'ru': return "Набл мин.";
      case 'es': return "Obs Min";
      case 'ua': return "Спост мін.";
      case 'bg': return "Набл. мин.";
      default: return "Obs Min";
    }
  }

  get localeTextForecastMax(): string {
    if (this.compact) {
      switch (this.locale) {
        case 'ru': return "Макс"; case 'ua': return "Макс"; case 'bg': return "Макс";
        case 'he': return "מקס"; default: return "Max";
      }
    }
    switch (this.locale) {
      case 'it': return "Max oggi";
      case 'fr': return "Max aujourd'hui";
      case 'de': return "Max heute";
      case 'nl': return "Max vandaag";
      case 'pl': return "Maks Temperatura";
      case 'he': return "מקסימלי היום";
      case 'da': return "Højeste i dag";
      case 'ru': return "Макс сегодня";
      case 'es': return "Máx hoy";
      case 'ua': return "Макс сьогодні";
      case 'bg': return "Макс днес";
      default: return "Forecast Max";
    }
  }

  get localeTextForecastMin(): string {
    if (this.compact) {
      switch (this.locale) {
        case 'ru': return "Мин"; case 'ua': return "Мін"; case 'bg': return "Мин";
        case 'he': return "מינ"; default: return "Min";
      }
    }
    switch (this.locale) {
      case 'it': return "Min oggi";
      case 'fr': return "Min aujourd'hui";
      case 'de': return "Min heute";
      case 'nl': return "Min vandaag";
      case 'pl': return "Min Temperatura";
      case 'he': return "דקות היום";
      case 'da': return "Laveste i dag";
      case 'ru': return "Мин сегодня";
      case 'es': return "Mín hoy";
      case 'ua': return "Мін сьогодні";
      case 'bg': return "Мин днес";
      default: return "Forecast Min";
    }
  }

  get localeTextPosToday(): string {
    if (this.compact) return "";
    switch (this.locale) {
      case 'it': return "Previsione";
      case 'fr': return "Prévoir";
      case 'de': return "Vorhersage";
      case 'nl': return "Prognose";
      case 'pl': return "Prognoza";
      case 'he': return "תַחֲזִית";
      case 'da': return "Vejrudsigt";
      case 'ru': return "Прогноз";
      case 'es': return "Previsión";
      case 'ua': return "Прогноз";
      case 'bg': return "Прогноза";
      default: return "Forecast";
    }
  }

  get localeTextPosTomorrow(): string {
    if (this.compact) {
      switch (this.locale) {
        case 'ru': return "Завтра"; case 'ua': return "Завтра"; case 'bg': return "Утре";
        case 'he': return "מחר"; case 'de': return "Morgen"; case 'nl': return "Morgen";
        case 'da': return "Morgen"; case 'pl': return "Jutro"; case 'it': return "Dom";
        case 'fr': return "Dem"; case 'es': return "Mañ"; default: return "Tom";
      }
    }
    switch (this.locale) {
      case 'it': return "Prev per domani";
      case 'fr': return "Prév demain";
      case 'de': return "Prog morgen";
      case 'nl': return "Prog morgen";
      case 'pl': return "Prog jutro";
      case 'he': return "תחזית מחר";
      case 'da': return "Prog i morgen";
      case 'ru': return "Прогноз на завтра";
      case 'es': return "Prev mañana";
      case 'ua': return "Прогноз на завтра";
      case 'bg': return "Прогноза за утре";
      default: return "Fore Tom";
    }
  }

  get localeTextFore(): string {
    switch (this.locale) {
      case 'it': return "Prev";
      case 'fr': return "Prév";
      case 'de': return "Prog";
      case 'nl': return "Prog";
      case 'pl': return "Prog";
      case 'he': return "תַחֲזִית";
      case 'da': return "Prog";
      case 'ru': return "Прогноз";
      case 'es': return "Prev";
      case 'ua': return "Прогноз";
      case 'bg': return "Прогноза";
      default: return "Fore";
    }
  }

  get localeTextUVRating(): string {
    switch (this.locale) {
      case 'it': return "UV";
      case 'fr': return "UV";
      case 'de': return "UV";
      case 'nl': return "UV";
      case 'pl': return "UV";
      case 'he': return "UV";
      case 'da': return "UV";
      case 'ru': return "УФ";
      case 'es': return "UV";
      case 'ua': return "УФ";
      case 'bg': return "UV";
      default: return "UV";
    }
  }

  get localeTextFireDanger(): string {
    switch (this.locale) {
      case 'it': return "Fuoco";
      case 'fr': return "Feu";
      case 'de': return "Feuer";
      case 'nl': return "Brand";
      case 'pl': return "Ogień";
      case 'he': return "אֵשׁ";
      case 'da': return "Brand";
      case 'ru': return "Огонь";
      case 'es': return "Fuego";
      case 'ua': return "Вогонь";
      case 'bg': return "Пожар";
      default: return "Fire";
    }
  }

  get localeTextGust(): string {
    switch (this.locale) {
      case 'it': return "Raffica";
      case 'fr': return "Rafale";
      case 'de': return "Böe";
      case 'nl': return "Windstoot";
      case 'pl': return "Poryw";
      case 'he': return "נשיבה";
      case 'da': return "Vindstød";
      case 'ru': return "Порыв";
      case 'es': return "Ráfaga";
      case 'ua': return "Порив";
      case 'bg': return "Пориви";
      default: return "Gust";
    }
  }

  getUOM(measure: string): string {
    const lengthUnit = this.hass.config.unit_system.length;

    switch (measure) {
      case 'air_pressure':
        // tjl Feature Add. Add weather entity and get air pressure units from weather entity attributes.
        const entity = this._config.entity_pressure;
        return entity && this.hass.states[entity]
          ? entity.match('^weather.') === null
            ? this.hass.states[entity].attributes.unit_of_measurement !== undefined 
              ? this.hass.states[entity].attributes.unit_of_measurement as string 
              : lengthUnit === 'km' 
                ? 'hPa' 
                : 'mbar'
            : this.hass.states[entity].attributes.pressure_unit !== undefined 
              ? this.hass.states[entity].attributes.pressure_unit 
              : '--'
          : '--';

//      return this._config.entity_pressure !== undefined && this.hass.states[this._config.entity_pressure].attributes.unit_of_measurement !== undefined ?
//        this.hass.states[this._config.entity_pressure].attributes.unit_of_measurement as string :
//        lengthUnit === 'km' ?
//          'hPa' :
//          'mbar';
      case 'length':
        return lengthUnit;
      case 'precipitation':
        return lengthUnit === 'km' ? 'mm' : 'in';
      case 'intensity':
        return lengthUnit === 'km' ? 'mm/h' : 'in/h';
      default:
        return this.hass.config.unit_system[measure] || '';
    }
  }

  private _showConfigWarning(warnings: string[]): TemplateResult {
    // const errorCard = <LovelaceCard>document.createElement('hui-error-card');
    // eslint-disable-next-line no-console
    return html`
      <hui-warning>
        <div>Weather Card</div>
        ${warnings.map(warning => html`<div>${warning}</div>`)}
      </hui-warning>
    `;
  }

  private _showWarning(warning: string): TemplateResult {
    return html`<hui-warning>${warning}</hui-warning>`;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this._config,
    });

    return html`${errorCard}`;
  }

  // https://lit.dev/docs/components/styles/
  get styles(): CSSResult {
    // Get config flags or set defaults if not configured
    const tooltipVisible = this._config.option_tooltips ? "visible" : "hidden";
    const tempFontWeight = this._config.temp_font_weight || "300";
    const tempFontSize = this._config.temp_font_size || "4em";
    const forecastTextFontSize = this._config.forecast_text_font_size || "21px";
    const forecastTextAlignment = this._config.forecast_text_alignment || "center";

    //tjl add ha-card styles from bramkragten's Weather-Card w/o margins, etc (which are already in the .card styles). 
    //  Provides for cursor to show on the card in support of tap/hold/double_tap actions
    return css`
      ha-card {
        cursor: pointer;
        overflow: hidden;
      }

      .card {
        padding: 8px 16px 8px 16px;
      }
      .content {
        align-items: center;
      }
      .card-header {
        font-size: 1.5em;
        color: var(--primary-text-color);
      }
      .section {
        margin: -1px;
        border: 1px solid transparent;
        padding-top: 8px;
        padding-bottom: 8px;
      }
      .updated {
        font-size: 0.9em;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .overview-top {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
      }
      .stacked {
        position: absolute;
      }
      .top-left {
        display: flex;
        flex-direction: column;
        height: 120px;
      }
      .top-left-obs {
        display: flex;
        flex-direction: column;
      }
      .big-icon {
        height: 120px;
        width: 140px;
        position: relative;
      }
      .unknown-forecast {
        position: relative;
        top: -30px;
        text-align: center;
      }
      .currentTemps {
        display: flex;
        align-self: flex-start;
        flex-direction: column;
        height: 60px;
      }
      .current-temp {
        display: table-row;
        margin-left: auto;
        padding: 2px 0px;
      }
      .temp {
        display:table-cell;
        font-weight: ${unsafeCSS(tempFontWeight)};
        font-size: ${unsafeCSS(tempFontSize)};
        color: var(--primary-text-color);
        position: relative;
        line-height: 74%;
      }
      .unit-temp-big {
        display: table-cell;
        vertical-align: top;
        font-weight: ${unsafeCSS(tempFontWeight)};
        font-size: 1.5em;
        color: var(--primary-text-color);
        position: relative;
        line-height: 74%;
      }
      .apparent-temp {
        display: table-row;
        margin-left: auto;
        height: 24px;
      }
      .apparent {
        display: table-cell;
        color: var(--primary-text-color);
        font-weight: 300;
        position: relative;
        line-height: 24px;
      }
      .unit-temp-small {
        display: table-cell;
        vertical-align: top;
        font-size: 10.5px;
        color: var(--primary-text-color);
        position: relative;
        line-height: 14px;
        padding-top: 3.6px;
        padding-left: 1px;
      }
      .line {
        margin-top : 7px;
        margin-bottom: -9px;
        color: var(--primary-text-color);
      }
      .forecast-text {
        font-size: ${unsafeCSS(forecastTextFontSize)};
        text-align: ${unsafeCSS(forecastTextAlignment)};
        line-height: 25px;
      }
      .forecast-text-right {
        font-size: ${unsafeCSS(forecastTextFontSize)};
        text-align: ${unsafeCSS(forecastTextAlignment)};
        width: 100%;
        align-items: center;
        display: flex;
        justify-content: center;
        line-height: 25px;
        margin-left: -40px;
      }
      .variations {
        display: flex;
        flex-flow: row wrap;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 8px;
      }
      .slot-list-item-1 {
        min-width:50%;
        padding-right: 8px;
      }
      .slot-list {
        list-style: none;
        padding: 0;
      }
      .slot-list li {
        height:24px;
      }
      .variations-ugly {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 8px;
      }
      .ha-icon {
        height: 24px;
        margin-right: 5px;
        color: var(--paper-item-icon-color);
      }
      .unit {
        font-size: 0.8em;
        display: table-cell;
        padding-left: 1px;
      }
      .slot {
        display: table-row;
      }
      .slot-icon {
        display: table-cell;
        position: relative;
        height: 18px;
        padding-right: 5px;
        color: var(--paper-item-icon-color);
      }
      .slot-text {
        display: table-cell;
        position: relative;
      }
      .label-text {
        display: table-cell;
        position: relative;
        font-size: 0.85em;
        color: var(--secondary-text-color);
        padding-right: 4px;
      }
      .fire-danger-text-color {
        display: inline-block;
        height: 18px;
        line-height: 20px;
        text-align: left;
        vertical-align: middle;
        margin: 0;
        padding-left: 4px;
        font-weight: 600;
        width: 108px;
      }
      .daily-forecast-horiz-section {
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        margin: 0;
        clear: both;
      }
      .daily-forecast-horiz-section .day-horiz:nth-last-child(1) {
        border-right: transparent;
      }
      .day-horiz {
        flex: 1;
        min-width: 0;
        text-align: center;
        color: var(--primary-text-color);
        border-right: 0.5px solid rgba(217,217,217,0.25);
        box-sizing: border-box;
      }
      .daily-forecast-vert-section {
        display: flex;
        flex-flow: column nowrap;
        margin: 0 auto;
        clear: both;
      }
      .day-vert {
        flex: 1;
        color: var(--primary-text-color);
        border-top: 1px solid #d9d9d9;
        line-height: 24px;
        box-sizing: border-box;
        padding-bottom: 8px;
      }
      .day-vert-top {
        display: flex;
        width: 100%;
      }
      .day-vert-middle {
        display: flex;
        float: left;
        width: 100%;
      }
      .day-vert-bottom {
        text-align: left;
        float: left;
      }
      .day-vert-dayicon {
        width: 40px;
        text-align: left;
        float: left;
        margin-bottom: -8px;
      }
      .day-vert-temps {
        flex: 1;
        text-align: left;
        float: left;
        padding-left: 1em;
        padding-top: 0.5em;
      }
      .day-vert-rain {
        flex: 2;
        text-align: left;
        float: left;
        padding-left: 1em;
        padding-top: 0.5em;
      }
      .dayname {
        text-transform: uppercase;
      }
      .dayname-vert {
        min-width: 40px;
        max-width: 40px;
        text-transform: uppercase;
      }
      .icon {
        width: 49px;
        height: 42px;
        margin: auto;
        display: inline-block;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        text-indent: -9999px;
      }
      .f-slot-horiz {
        display: inline-block;
        text-align: center;
        list-style: none;
        overflow: hidden;
        font-weight: 300;
        padding: 0;
        margin-block-start: 0;
        margin-block-end: -12px;
      }
      .f-slot-horiz-text {
        height:20px;
      }
      .f-slot-horiz-icon {
        height:50px;
      }
      .f-summary-vert {
        padding-left: 1em;
        font-weight: 400;
      }
      .f-firedanger-vert {
        text-align: right;
        font-weight: 300;
        margin-top: -24px;
      }
      .f-slot-vert {
        display: table;
        overflow: hidden;
        height: 24px;
        font-weight: 300;
      }
      .f-slot-minmax {
        width: 100%;
      }
      .chart-section {
        padding: 4px 0;
      }
      .f-extended {
        display: inline-table;
        font-size: 13px;
        font-weight: 300;
        padding-top: 8px;
        line-height:20px;
      }
      .extended-section .f-extended {
        padding-top: 0;
      }
      .highTemp {
        display: table-cell;
        font-weight: bold;
      }
      .lowTemp {
        display: table-cell;
        font-weight: 300;
      }
      .slash {
        padding-left: 2px;
        padding-right: 2px;
      }
      .high-temp {
        display: table-cell;
        font-weight: bold;
        width: 21px;
        text-align: right;
      }
      .low-temp {
        display: table-cell;
        font-weight: 300;
        width: 21px;
        text-align: right;
      }
      .temp-label {
        display: table-cell;
        width: 32px;
        font-weight: 300;
      }
      .f-label {
        display: table-cell;
        white-space: nowrap;
        padding-right: 0.2em;
      }
      .pop {
        display: table-cell;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .pos {
        display: table-cell;
        font-weight: 300;
        color: var(--primary-text-color);
        white-space: nowrap;
      }
      .fcasttooltip {
        position: relative;
        display: inline-block;
      }
      .fcasttooltip .fcasttooltipblock {
        visibility: hidden;
        background-color: rgba(10, 20, 40, 0.96);
        color: #FFFFFF;
        text-align: center;
        border-radius: 6px;
        border-style: solid;
        border-color: #FFA100;
        border-width: 1px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        bottom: 107%;
        margin-left: -2px;
      }
      .fcasttooltip:hover .fcasttooltipblock {
        visibility: ${unsafeCSS(tooltipVisible)};
      }
      .fcasttooltiptext {
        padding-left: 8px;
        padding-right: 8px;
        color: #ffffff;
      }
    `;
  }
}
