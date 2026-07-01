/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { keys } from 'ts-transformer-keys';

import { mdiPencil, mdiArrowDown, mdiArrowUp, mdiApplicationEditOutline, mdiLockOpenVariant, mdiLock } from '@mdi/js';

//import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { WeatherCardConfig, layoutOverview, layoutOrientation, layoutDays, extendedDays, sectionType, timeFormat, sectionNames, pressureDecimals, HassCustomElement } from './types';
import { customElement, property, state } from 'lit/decorators';
import { formfieldDefinition } from '../elements/formfield';
import { selectDefinition } from '../elements/select';
import { switchDefinition } from '../elements/switch';
import { textfieldDefinition } from '../elements/textfield';

@customElement('platinum-weather-card-plus-charts-editor')
export class WeatherCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: WeatherCardConfig;

  @state() private _helpers?: any;

  @state() private _subElementEditor: string | undefined = undefined;

  private _initialized = false;
  private _config_version = 8;

  static elementDefinitions = {
    "ha-card": customElements.get("ha-card"),  // This works because ha-card is ALWAYS loaded before custom cards (for now)
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: WeatherCardConfig): void {
    this._config = config;
    let changed = false;
    if (this._section_order === null) {
      this._config = {
        ...this._config,
        ['section_order']: sectionNames,
      }
      changed = true;
    } else {
      // check for extra entries
      this._config.section_order.forEach((section: sectionType) => {
        if (!(sectionNames.includes(section))) {
          const idx = this._config?.section_order.indexOf(section);
          if (idx !== undefined && idx !== -1) {
            this._config?.section_order.splice(idx, 1);
          }
          changed = true;
        }
      });
      // check for missing entries
      sectionNames.forEach((section: sectionType) => {
        if (this._config && !(this._config.section_order.includes(section))) {
          this._config.section_order.push(section);
          changed = true;
        }
      });
    }

    if (changed) {
      fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
    }

    this.loadCardHelpers();
  }

  private sortObjectByKeys(object: { [x: string]: any; }) {
    return Object.keys(object).sort().reduce((r, k) => (r[k] = object[k], r), {});
  }

  private _configCleanup() {
    if (!this._config || !this.hass) {
      return;
    }

    let tmpConfig = { ...this._config };

    // Rename options
    if (tmpConfig.static_icons) {
      tmpConfig['option_static_icons'] = tmpConfig.static_icons;
      delete tmpConfig['static_icons'];
    }

    if (tmpConfig.time_format) {
      tmpConfig['option_time_format'] = tmpConfig.time_format === '12' ? '12hour' : '24hour';
      delete tmpConfig['time_format'];
    }

    if (tmpConfig.locale) {
      tmpConfig['option_locale'] = tmpConfig.locale;
      delete tmpConfig['locale'];
    }

    if (tmpConfig.option_today_temperature_decimals) {
      tmpConfig['option_today_temperature_decimals'] = tmpConfig.show_today_decimals;
      delete tmpConfig['show_today_decimals'];
    }

    if (tmpConfig.show_decimals_pressure) {
      tmpConfig['option_pressure_decimals'] = tmpConfig.show_decimals_pressure;
      delete tmpConfig['show_decimals_pressure'];
    }

    if (tmpConfig.tooltips) {
      tmpConfig['option_tooltips'] = tmpConfig.tooltips;
      delete tmpConfig['tooltips'];
    }

    if (tmpConfig.show_beaufort) {
      tmpConfig['option_show_beaufort'] = tmpConfig.show_beaufort;
      delete tmpConfig['show_beaufort'];
    }

    if (tmpConfig.entity_daytime_high) {
      tmpConfig['Entity_forecast_max'] = tmpConfig.entity_daytime_high;
      delete tmpConfig['entity_daytime_high'];
    }

    if (tmpConfig.entity_daytime_low) {
      tmpConfig['entity_forecast_min'] = tmpConfig.entity_daytime_low;
      delete tmpConfig['entity_daytime_low'];
    }

    if (tmpConfig.entity_current_conditions) {
      tmpConfig['entity_forecast_icon'] = tmpConfig.entity_current_conditions;
      delete tmpConfig['entity_current_conditions'];
    }

    if (tmpConfig.entity_current_text) {
      tmpConfig['entity_summary'] = tmpConfig.entity_current_text;
      delete tmpConfig['entity_current_text'];
    }

    if (tmpConfig.entity_daily_summary) {
      tmpConfig['entity_extended'] = tmpConfig.entity_daily_summary;
      delete tmpConfig['entity_daily_summary'];
    }

    if (tmpConfig.entity_forecast_high_temp_1) {
      tmpConfig['entity_forecast_max_1'] = tmpConfig.entity_forecast_high_temp_1;
      delete tmpConfig['entity_forecast_high_temp_1'];
    }

    if (tmpConfig.entity_forecast_low_temp_1) {
      tmpConfig['entity_forecast_min_1'] = tmpConfig.entity_forecast_low_temp_1;
      delete tmpConfig['entity_forecast_low_temp_1'];
    }

    if (tmpConfig.entity_possible_today) {
      tmpConfig['entity_pos'] = tmpConfig.entity_possible_today;
      delete tmpConfig['entity_possible_today'];
    }

    if (tmpConfig.entity_fire_danger_summary) {
      tmpConfig['entity_fire_danger'] = tmpConfig.entity_fire_danger_summary;
      delete tmpConfig['entity_fire_danger_summary'];
    }

    if (tmpConfig.show_decimals) {
      tmpConfig['option_show_overview_decimals'] = tmpConfig.show_decimals;
      delete tmpConfig['show_decimals'];
    }

    if (tmpConfig.show_separator) {
      tmpConfig['option_show_overview_separator'] = tmpConfig.show_separator;
      delete tmpConfig['show_separator'];
    }

    // Remane slot entries
    for (const slot of ['slot_l1, slot_l2, slot_l3, slot_l4, slot_l5, slot_l6, slot_l7, slot_l8, slot_r1, slot_r2, slot_r3, slot_r4, slot_r5, slot_r6, slot_r7, slot_r8']) {
      if (tmpConfig[slot] === 'daytime_high') tmpConfig[slot] = 'forecast_max';
      if (tmpConfig[slot] === 'daytime_low') tmpConfig[slot] = 'forecast_min';
    }

    // Remove unused entries
    const keysOfProps = keys<WeatherCardConfig>();
    for (const element in this._config) {
      if (!keysOfProps.includes(element)) {
        delete tmpConfig[element];
      }
    }

    tmpConfig = {
      ...tmpConfig,
      card_config_version: this._config_version,
    }

    this._config = tmpConfig;

    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _section_order(): sectionType[] | null {
    return this._config?.section_order || null;
  }

  get _text_card_title(): string {
    return this._config?.text_card_title || '';
  }

  get _text_card_title_2(): string {
    return this._config?.text_card_title_2 || '';
  }

  get _entity_update_time(): string {
    return this._config?.entity_update_time || '';
  }

  get _update_time_use_attr(): boolean {
    return this._config?.update_time_use_attr === true; // default off
  }

  get _update_time_name_attr(): string {
    return this._config?.update_time_name_attr || '';
  }

  get _text_update_time_prefix(): string {
    return this._config?.text_update_time_prefix || '';
  }

  get _overview_layout(): layoutOverview | '' {
    return this._config?.overview_layout || '';
  }

  get _entity_temperature(): string {
    return this._config?.entity_temperature || '';
  }

  get _entity_apparent_temp(): string {
    return this._config?.entity_apparent_temp || '';
  }

  get _entity_forecast_icon(): string {
    return this._config?.entity_forecast_icon || '';
  }

  get _entity_summary(): string {
    return this._config?.entity_summary || '';
  }

  get _option_show_overview_decimals(): boolean {
    return this._config?.option_show_overview_decimals === true; // default off
  }

  get _option_show_overview_separator(): boolean {
    return this._config?.option_show_overview_separator === true; // default off
  }

  get _entity_extended(): string {
    return this._config?.entity_extended || '';
  }

  get _extended_use_attr(): boolean {
    return this._config?.extended_use_attr === true; // default off
  }

  get _extended_name_attr(): string {
    return this._config?.extended_name_attr || '';
  }

  get _entity_todays_fire_danger(): string {
    return this._config?.entity_todays_fire_danger || '';
  }

  get _entity_todays_uv_forecast(): string {
    return this._config?.entity_todays_uv_forecast || '';
  }

  get _slot_l1(): string {
    return this._config?.slot_l1 || '';
  }

  get _slot_l2(): string {
    return this._config?.slot_l2 || '';
  }

  get _slot_l3(): string {
    return this._config?.slot_l3 || '';
  }

  get _slot_l4(): string {
    return this._config?.slot_l4 || '';
  }

  get _slot_l5(): string {
    return this._config?.slot_l5 || '';
  }

  get _slot_l6(): string {
    return this._config?.slot_l6 || '';
  }

  get _slot_l7(): string {
    return this._config?.slot_l7 || '';
  }

  get _slot_l8(): string {
    return this._config?.slot_l8 || '';
  }

  get _slot_r1(): string {
    return this._config?.slot_r1 || '';
  }

  get _slot_r2(): string {
    return this._config?.slot_r2 || '';
  }

  get _slot_r3(): string {
    return this._config?.slot_r3 || '';
  }

  get _slot_r4(): string {
    return this._config?.slot_r4 || '';
  }

  get _slot_r5(): string {
    return this._config?.slot_r5 || '';
  }

  get _slot_r6(): string {
    return this._config?.slot_r6 || '';
  }

  get _slot_r7(): string {
    return this._config?.slot_r7 || '';
  }

  get _slot_r8(): string {
    return this._config?.slot_r8 || '';
  }

  get _entity_observed_max(): string {
    return this._config?.entity_observed_max || '';
  }

  get _entity_observed_min(): string {
    return this._config?.entity_observed_min || '';
  }

  get _entity_forecast_max(): string {
    return this._config?.entity_forecast_max || '';
  }

  get _entity_forecast_min(): string {
    return this._config?.entity_forecast_min || '';
  }

  get _entity_temp_next(): string {
    return this._config?.entity_temp_next || '';
  }

  get _entity_temp_next_label(): string {
    return this._config?.entity_temp_next_label || '';
  }

  get _entity_temp_following(): string {
    return this._config?.entity_temp_following || '';
  }

  get _entity_temp_following_label(): string {
    return this._config?.entity_temp_following_label || '';
  }

  get _entity_wind_bearing(): string {
    return this._config?.entity_wind_bearing || '';
  }

  get _entity_wind_speed(): string {
    return this._config?.entity_wind_speed || '';
  }

  get _entity_wind_gust(): string {
    return this._config?.entity_wind_gust || '';
  }

  get _entity_wind_speed_kt(): string {
    return this._config?.entity_wind_speed_kt || '';
  }

  get _entity_wind_gust_kt(): string {
    return this._config?.entity_wind_gust_kt || '';
  }

  get _entity_visibility(): string {
    return this._config?.entity_visibility || '';
  }

  get _entity_sun(): string {
    return this._config?.entity_sun || '';
  }

  get _entity_moon(): string {
    return this._config?.entity_moon || '';
  }

  get _entity_pop(): string {
    return this._config?.entity_pop || '';
  }

  get _entity_pos(): string {
    return this._config?.entity_pos || '';
  }

  get _entity_possible_tomorrow(): string {
    return this._config?.entity_possible_tomorrow || '';
  }

  get _entity_humidity(): string {
    return this._config?.entity_humidity || '';
  }

  get _entity_pressure(): string {
    return this._config?.entity_pressure || '';
  }

  get _entity_uv_alert_summary(): string {
    return this._config?.entity_uv_alert_summary || '';
  }

  get _entity_fire_danger(): string {
    return this._config?.entity_fire_danger || '';
  }

  get _entity_rainfall(): string {
    return this._config?.entity_rainfall || '';
  }

  get _custom1_value(): string {
    return this._config?.custom1_value || '';
  }

  get _custom1_icon(): string {
    return this._config?.custom1_icon || '';
  }

  get _custom1_label(): string {
    return this._config?.custom1_label || '';
  }

  get _custom1_units(): string {
    return this._config?.custom1_units || '';
  }

  get _custom2_value(): string {
    return this._config?.custom2_value || '';
  }

  get _custom2_icon(): string {
    return this._config?.custom2_icon || '';
  }

  get _custom2_label(): string {
    return this._config?.custom2_label || '';
  }

  get _custom2_units(): string {
    return this._config?.custom2_units || '';
  }

  get _custom3_value(): string {
    return this._config?.custom3_value || '';
  }

  get _custom3_icon(): string {
    return this._config?.custom3_icon || '';
  }

  get _custom3_label(): string {
    return this._config?.custom3_label || '';
  }

  get _custom3_units(): string {
    return this._config?.custom3_units || '';
  }

  get _custom4_value(): string {
    return this._config?.custom4_value || '';
  }

  get _custom4_icon(): string {
    return this._config?.custom4_icon || '';
  }

  get _custom4_label(): string {
    return this._config?.custom4_label || '';
  }

  get _custom4_units(): string {
    return this._config?.custom4_units || '';
  }

  get _daily_forecast_layout(): layoutOrientation | '' {
    return this._config?.daily_forecast_layout || '';
  }

  get _daily_forecast_days(): layoutDays | null {
    return this._config?.daily_forecast_days || null;
  }

  get _daily_extended_forecast_days(): extendedDays | null {
    return this._config?.daily_extended_forecast_days ?? null;
  }

  get _entity_forecast_icon_1(): string {
    return this._config?.entity_forecast_icon_1 || '';
  }
  
get _weather_entity(): string {
    return this._config?.weather_entity || '';
  }

get _forecast_type(): string {
    return this._config?.forecast_type || '';
  }


  get _entity_summary_1(): string {
    return this._config?.entity_summary_1 || '';
  }

  get _entity_forecast_min_1(): string {
    return this._config?.entity_forecast_min_1 || '';
  }

  get _entity_forecast_max_1(): string {
    return this._config?.entity_forecast_max_1 || '';
  }

  get _entity_pop_1(): string {
    return this._config?.entity_pop_1 || '';
  }

  get _entity_pos_1(): string {
    return this._config?.entity_pos_1 || '';
  }

  get _entity_extended_1(): string {
    return this._config?.entity_extended_1 || '';
  }

  get _entity_fire_danger_1(): string {
    return this._config?.entity_fire_danger_1 || '';
  }

  get _daily_extended_use_attr(): boolean {
    return this._config?.daily_extended_use_attr === true; // default off
  }

  get _daily_extended_name_attr(): string {
    return this._config?.daily_extended_name_attr || '';
  }

  get _tap_action(): Record<string, unknown> | undefined {
    return this._config?.tap_action;
  }

  get _hold_action(): Record<string, unknown> | undefined {
    return this._config?.hold_action;
  }

  get _double_tap_action(): Record<string, unknown> | undefined {
    return this._config?.double_tap_action;
  }

  get _summary_1_use_attr(): boolean {
    return this._config?.summary_1_use_attr === true;
  }

  get _summary_1_name_attr(): string {
    return this._config?.summary_1_name_attr || '';
  }

  get _option_today_temperature_decimals(): boolean {
    return this._config?.option_today_temperature_decimals === true; // default off
  }

  get _option_today_rainfall_decimals(): boolean {
    return this._config?.option_today_rainfall_decimals === true; // default off
  }

  get _option_forecast_decimals(): boolean {
    return this._config?.option_forecast_decimals === true; // default off
  }

  get _option_show_gust_in_wind(): boolean {
    return this._config?.option_show_gust_in_wind !== false; // default on
  }

  get _icon_pack(): string {
    return this._config?.icon_pack || 'default';
  }

  get _icon_pack_path(): string {
    return this._config?.icon_pack_path || '';
  }

  get _option_show_forecast_wind(): boolean {
    return this._config?.option_show_forecast_wind === true; // default off
  }

  get _option_show_forecast_pop(): boolean {
    return this._config?.option_show_forecast_pop !== false; // default on
  }

  get _option_show_current_day(): boolean {
    return this._config?.option_show_current_day === true; // default off
  }

  get _option_show_temperature_chart(): boolean {
    return this._config?.option_show_temperature_chart === true; // default off
  }

  get _option_show_precipitation_chart(): boolean {
    return this._config?.option_show_precipitation_chart === true; // default off
  }

  get _option_pressure_decimals(): pressureDecimals | null {
    return this._config?.option_pressure_decimals || null;
  }

  get _option_color_fire_danger(): boolean {
    return this._config?.option_color_fire_danger !== false; // default on
  }

  get _option_daily_color_fire_danger(): boolean {
    return this._config?.option_daily_color_fire_danger !== false; // default on
  }

  get _option_tooltips(): boolean {
    return this._config?.option_tooltips === true; // default off
  }

  get _option_static_icons(): boolean {
    return this._config?.option_static_icons === true; // default off
  }

  get _option_time_format(): timeFormat | null {
    return this._config?.option_time_format ?? null;
  }

  get _option_locale(): string {
    return this._config?.option_locale || '';
  }

  get _optional_entities(): TemplateResult {
    const entities = new Set();
    for (const slot of
      [
        this._config?.slot_l1 || 'forecast_max' as string,
        this._config?.slot_l2 || 'forecast_min' as string,
        this._config?.slot_l3 || 'wind' as string,
        this._config?.slot_l4 || 'pressure' as string,
        this._config?.slot_l5 || 'sun_next' as string,
        this._config?.slot_l6 || 'remove' as string,
        this._config?.slot_l7 || 'remove' as string,
        this._config?.slot_l8 || 'remove' as string,
        this._config?.slot_r1 || 'popforecast' as string,
        this._config?.slot_r2 || 'humidity' as string,
        this._config?.slot_r3 || 'uv_summary' as string,
        this._config?.slot_r4 || 'fire_danger' as string,
        this._config?.slot_r5 || 'sun_following' as string,
        this._config?.slot_r6 || 'remove' as string,
        this._config?.slot_r7 || 'remove' as string,
        this._config?.slot_r8 || 'remove' as string,
      ]) {
      switch (slot) {
        case 'observed_max':
          entities.add('entity_observed_max');
          break;
        case 'observed_min':
          entities.add('entity_observed_min');
          break;
        case 'forecast_max':
          entities.add('entity_forecast_max');
          break;
        case 'forecast_min':
          entities.add('entity_forecast_min');
          break;
        case 'temp_next':
          entities.add('entity_temp_next').add('entity_temp_next_label');
          break;
        case 'temp_following':
          entities.add('entity_temp_following').add('entity_temp_following_label');
          break;
        case 'temp_maximums':
          entities.add('entity_forecast_max').add('entity_observed_max');
          break;
        case 'temp_minimums':
          entities.add('entity_forecast_min').add('entity_observed_min');
          break;
        case 'wind':
          entities.add('entity_wind_bearing').add('entity_wind_speed').add('entity_wind_gust');
          break;
        case 'wind_kt':
          entities.add('entity_wind_bearing').add('entity_wind_speed_kt').add('entity_wind_gust_kt');
          break;
        case 'visibility':
          entities.add('entity_visibility');
          break;
        case 'sun_next':
          entities.add('entity_sun');
          break;
        case 'sun_following':
          entities.add('entity_sun');
          break;
        case 'moon':
          entities.add('entity_moon');
          break;
        case 'pop':
          entities.add('entity_pop');
          break;
        case 'popforecast':
          entities.add('entity_pop').add('entity_pos');
          break;
        case 'humidity':
          entities.add('entity_humidity');
          break;
        case 'pressure':
          entities.add('entity_pressure');
          break;
        case 'uv_summary':
          entities.add('entity_uv_alert_summary');
          break;
        case 'fire_danger':
          entities.add('entity_fire_danger');
          break;
        case 'possible_today':
          entities.add('entity_pos');
          break;
        case 'possible_tomorrow':
          entities.add('entity_possible_tomorrow');
          break;
        case 'rainfall':
          entities.add('entity_rainfall');
          break;
        case 'custom1':
          entities.add('custom1');
          break;
        case 'custom2':
          entities.add('custom2');
          break;
        case 'custom3':
          entities.add('custom3');
          break;
        case 'custom4':
          entities.add('custom4');
          break;
      }
    }

    const entity_observed_max = entities.has("entity_observed_max") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_observed_max'} .value=${this._entity_observed_max} .includeDomains=${['sensor']}
          name="entity_observed_max" label=${this._t("entity_observed_max")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_observed_min = entities.has("entity_observed_min") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_observed_min'} .value=${this._entity_observed_min} .includeDomains=${['sensor']}
          name="entity_observed_min" label=${this._t("entity_observed_min")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_forecast_max = entities.has("entity_forecast_max") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_max'} .value=${this._entity_forecast_max} .includeDomains=${['sensor', 'weather']}
          name="entity_forecast_max" label=${this._t("entity_forecast_max")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_forecast_min = entities.has("entity_forecast_min") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_min'} .value=${this._entity_forecast_min} .includeDomains=${['sensor', 'weather']}
          name="entity_forecast_min" label=${this._t("entity_forecast_min")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_next = entities.has("entity_temp_next") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_next'} .value=${this._entity_temp_next} .includeDomains=${['sensor']}
          name="entity_temp_next" label=${this._t("entity_temp_next")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_next_label = entities.has("entity_temp_next_label") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_next_label'} .value=${this._entity_temp_next_label} .includeDomains=${['sensor']}
          name="entity_temp_next_label" label=${this._t("entity_temp_next_label")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_following = entities.has("entity_temp_following") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_following'} .value=${this._entity_temp_following} .includeDomains=${['sensor']}
          name="entity_temp_following" label=${this._t("entity_temp_following")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_temp_following_label = entities.has("entity_temp_following_label") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_temp_following_label'} .value=${this._entity_temp_following_label} .includeDomains=${['sensor']}
          name="entity_temp_following_label" label=${this._t("entity_temp_fol_label")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_bearing = entities.has("entity_wind_bearing") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_bearing'} .value=${this._entity_wind_bearing} .includeDomains=${['sensor', 'weather']}
          name="entity_wind_bearing" label=${this._t("entity_wind_bearing")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_speed = entities.has("entity_wind_speed") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_speed'} .value=${this._entity_wind_speed} .includeDomains=${['sensor', 'weather']}
          name="entity_wind_speed" label=${this._t("entity_wind_speed")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_gust = entities.has("entity_wind_gust") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_gust'} .value=${this._entity_wind_gust} .includeDomains=${['sensor', 'weather']}
          name="entity_wind_gust" label=${this._t("entity_wind_gust")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_speed_kt = entities.has("entity_wind_speed_kt") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_speed_kt'} .value=${this._entity_wind_speed_kt} .includeDomains=${['sensor', 'weather']}
          name="entity_wind_speed_kt" label=${this._t("entity_wind_speed_kt")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_wind_gust_kt = entities.has("entity_wind_gust_kt") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_wind_gust_kt'} .value=${this._entity_wind_gust_kt} .includeDomains=${['sensor']}
          name="entity_wind_gust_kt" label=${this._t("entity_wind_gust_kt")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_visibility = entities.has("entity_visibility") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_visibility'} .value=${this._entity_visibility} .includeDomains=${['sensor', 'weather']}
          name="entity_visibility" label=${this._t("entity_visibility")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_sun = entities.has("entity_sun") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_sun'} .value=${this._entity_sun} .includeDomains=${['sun', 'sensor']}
          name="entity_sun" label=${this._t("entity_sun")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_moon = entities.has("entity_moon") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_moon'} .value=${this._entity_moon} .includeDomains=${['sensor']}
          name="entity_moon" label=${this._t("entity_moon")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_pop = entities.has("entity_pop") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pop'} .value=${this._entity_pop} .includeDomains=${['sensor', 'weather']}
          name="entity_pop" label=${this._t("entity_pop")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_pos = entities.has("entity_pos") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pos'} .value=${this._entity_pos} .includeDomains=${['sensor', 'weather']}
          name="entity_pos" label=${this._t("entity_pos")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_possible_tomorrow = entities.has("entity_possible_tomorrow") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_possible_tomorrow'} .value=${this._entity_possible_tomorrow} .includeDomains=${['sensor', 'weather']}
          name="entity_possible_tomorrow" label=${this._t("entity_2day_pos")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_humidity = entities.has("entity_humidity") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_humidity'} .value=${this._entity_humidity} .includeDomains=${['sensor', 'weather']}
          name="entity_humidity" label=${this._t("entity_humidity")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_pressure = entities.has("entity_pressure") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pressure'} .value=${this._entity_pressure} .includeDomains=${['sensor', 'weather']}
          name="entity_pressure" label=${this._t("entity_pressure")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_uv_alert_summary = entities.has("entity_uv_alert_summary") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_uv_alert_summary'} .value=${this._entity_uv_alert_summary} .includeDomains=${['sensor']}
          name="entity_uv_alert_summary" label=${this._t("entity_uv_summary")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_fire_danger = entities.has("entity_fire_danger") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_fire_danger'} .value=${this._entity_fire_danger} .includeDomains=${['sensor']}
          name="entity_fire_danger" label=${this._t("entity_fire_danger")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_rainfall = entities.has("entity_rainfall") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_rainfall'} .value=${this._entity_rainfall} .includeDomains=${['sensor']}
          name="entity_rainfall" label=${this._t("entity_rainfall")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : '';

    const entity_custom1 = entities.has("custom1") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom1_value'} .value=${this._custom1_value} .includeDomains=${['sensor']}
          name="custom1_value" label=${this._t("custom1_value")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${'custom1_icon'} .value=${this._custom1_icon} name="custom1_icon"
            label=${this._t("custom1_icon")} @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-input label=${this._t("custom1_units")} .value=${this._custom1_units} .configValue=${'custom1_units'} @input=${this._valueChanged}>
          </ha-input>
        </div>
        <ha-input label=${this._t("custom1_label")} .value=${this._custom1_label} .configValue=${'custom1_label'} @input=${this._valueChanged}>
        </ha-input>
      ` : '';

    const entity_custom2 = entities.has("custom2") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom2_value'} .value=${this._custom2_value} .includeDomains=${['sensor']}
          name="custom2_value" label=${this._t("custom2_value")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${'custom2_icon'} .value=${this._custom2_icon} name="custom2_icon"
            label=${this._t("custom2_icon")} @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-input label=${this._t("custom2_units")} .value=${this._custom2_units} .configValue=${'custom2_units'} @input=${this._valueChanged}>
          </ha-input>
        </div>
        <ha-input label=${this._t("custom2_label")} .value=${this._custom2_label} .configValue=${'custom2_label'} @input=${this._valueChanged}>
        </ha-input>
      ` : '';

    const entity_custom3 = entities.has("custom3") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom3_value'} .value=${this._custom3_value} .includeDomains=${['sensor']}
          name="custom3_value" label=${this._t("custom3_value")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${'custom3_icon'} .value=${this._custom3_icon} name="custom3_icon"
            label=${this._t("custom3_icon")} @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-input label=${this._t("custom3_units")} .value=${this._custom3_units} .configValue=${'custom3_units'} @input=${this._valueChanged}>
          </ha-input>
        </div>
        <ha-input label=${this._t("custom3_label")} .value=${this._custom3_label} .configValue=${'custom3_label'} @input=${this._valueChanged}>
        </ha-input>
      ` : '';

    const entity_custom4 = entities.has("custom4") ?
      html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'custom4_value'} .value=${this._custom4_value} .includeDomains=${['sensor']}
          name="custom4_value" label=${this._t("custom4_value")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${'custom4_icon'} .value=${this._custom4_icon} name="custom4_icon"
            label=${this._t("custom4_icon")} @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-input label=${this._t("custom4_units")} .value=${this._custom4_units} .configValue=${'custom4_units'} @input=${this._valueChanged}>
          </ha-input>
        </div>
        <ha-input label=${this._t("custom4_label")} .value=${this._custom4_label} .configValue=${'custom4_label'} @input=${this._valueChanged}>
        </ha-input>
      ` : '';

    return html`
      ${entity_observed_max}
      ${entity_observed_min}
      ${entity_forecast_max}
      ${entity_forecast_min}
      ${entity_temp_next}
      ${entity_temp_next_label}
      ${entity_temp_following}
      ${entity_temp_following_label}
      ${entity_wind_bearing}
      ${entity_wind_speed}
      ${entity_wind_gust}
      ${entity_wind_speed_kt}
      ${entity_wind_gust_kt}
      ${entity_visibility}
      ${entity_sun}
      ${entity_moon}
      ${entity_pop}
      ${entity_pos}
      ${entity_possible_tomorrow}
      ${entity_humidity}
      ${entity_pressure}
      ${entity_uv_alert_summary}
      ${entity_fire_danger}
      ${entity_rainfall}
      ${entity_custom1}
      ${entity_custom2}
      ${entity_custom3}
      ${entity_custom4}`;
  }

  get _show_warning(): boolean {
    return this._config?.show_warning || false;
  }

  get _show_error(): boolean {
    return this._config?.show_error || false;
  }

  protected async firstUpdated(): Promise<void> {
    if (this._config && this.hass) {
      if (this._config.card_config_version !== this._config_version) {
        this._configCleanup();
      }
    }

    if (!customElements.get('ha-switch') || (!customElements.get('ha-input') && !customElements.get('ha-textfield')) || !customElements.get('ha-entity-picker')) {
      (customElements.get('hui-entities-card') as HassCustomElement)?.getConfigElement();
    }
  }

  private _sectionOverviewEditor(): TemplateResult {
    //tjl added weather as an included domain for Apparent Temp
    return html`
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_update_time'} .value=${this._entity_update_time} .includeDomains=${['sensor']}
        name="entity_update_time" label=${this._t("entity_update_time")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${this._entity_update_time !== '' ? html`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._update_time_use_attr !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._update_time_use_attr !== false ? mdiLockOpenVariant : mdiLock} .value=${'update_time_use_attr'} .checked=${this._update_time_use_attr !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
        </div>
        ${this._entity_update_time !== '' && this._update_time_use_attr === true ? html`<ha-selector .hass=${this.hass} .entityId=${this._entity_update_time}
          .selector = ${{ attribute: { entity_id: this._entity_update_time } }} .required=${false}
          .configValue=${'update_time_name_attr'} .value=${this._update_time_name_attr} name="update_time_name_attr" label=${this._t("attribute")}
          allow-custom-value
          @value-changed=${this._valueChangedPicker}>
        </ha-selector>` : html``}
      </div>` : html``}
      <ha-input label=${this._t("update_time_prefix")} .value=${this._text_update_time_prefix}
        .configValue=${'text_update_time_prefix'} @input=${this._valueChanged}>
      </ha-input>
      ${this._overview_layout !== 'forecast' ?
        html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_temperature'} .value=${this._entity_temperature} .includeDomains=${['sensor', 'weather']}
          name="entity_temperature" label=${this._t("entity_temperature")} allow-custom-entity
          @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_apparent_temp'} .value=${this._entity_apparent_temp} .includeDomains=${['sensor', 'weather']}
          name="entity_apparent_temp" label=${this._t("entity_apparent_temp")} allow-custom-entity
          @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>` : html``}
      ${this._overview_layout !== 'observations' ?
        html`<ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_icon'} .value=${this._entity_forecast_icon} .includeDomains=${['sensor', 'weather']}
          name="entity_forecast_icon" label=${this._t("entity_forecast_icon")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
          </ha-entity-picker>
          <ha-entity-picker .hass=${this.hass} .configValue=${'entity_summary'} .value=${this._entity_summary} .includeDomains=${['sensor', 'weather']}
            name="entity_summary" label=${this._t("entity_summary")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
          </ha-entity-picker>` : html``}
    `;
  }

  private _optionOverviewEditor(): TemplateResult {
    return html`
      <div class="side-by-side">
        <label class='mdc-label'>${this._t('overview_layout')}</label>
        <select class='ha-select-compat' .configValue=${'overview_layout'} .value=${this._overview_layout} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="complete">${this._t("opt_complete")}</option>
          <option value="observations">${this._t("opt_observations")}</option>
          <option value="forecast">${this._t("opt_forecast")}</option>
          <option value="title only">${this._t("opt_title_only")}</option>
        </select>
        <div></div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_show_overview_decimals !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_show_overview_decimals !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_show_overview_decimals'} .checked=${this._option_show_overview_decimals !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_temp_decimals")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_show_overview_separator !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_show_overview_separator !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_show_overview_separator'} .checked=${this._option_show_overview_separator !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_separator")}</span>
            </div>
        </div>
      </div>
    `;
  }

  private _sectionExtendedEditor(): TemplateResult {
    const attr_names: TemplateResult[] = [];
    if (this._extended_use_attr === true) {
      const attrs = this.hass !== undefined && this.hass.states[this._entity_extended] !== undefined ? this.hass.states[this._entity_extended].attributes : [];
      for (const element in attrs) {
        attr_names.push(html`<option value="${element}">${element}</option>`);
      }
    }

    return html`
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_extended'} .value=${this._entity_extended} .includeDomains=${['sensor', 'weather']}
        name="entity_extended" label=${this._t("entity_extended")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${this._entity_extended !== '' ? html`
        <div class="side-by-side">
          <div>
            <div class="toggle-row">
              <ha-icon-button class=${this._extended_use_attr !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._extended_use_attr !== false ? mdiLockOpenVariant : mdiLock} .value=${'extended_use_attr'} .checked=${this._extended_use_attr !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
          </div>
          ${this._entity_extended !== '' && this._extended_use_attr === true ? html`<ha-selector .hass=${this.hass} .entityId=${this._entity_extended}
            .selector = ${{ attribute: { entity_id: this._entity_extended } }} .required=${false}
            .configValue=${'extended_name_attr'} .value=${this._extended_name_attr} name="extended_name_attr" label=${this._t("attribute")}
            allow-custom-value
            @value-changed=${this._valueChangedPicker}>
          </ha-selector>` : html``}
        </div>` : html``}
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_todays_uv_forecast'} .value=${this._entity_todays_uv_forecast} .includeDomains=${['sensor']}
        name="entity_todays_uv_forecast" label=${this._t("entity_uv_today")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_todays_fire_danger'} .value=${this._entity_todays_fire_danger} .includeDomains=${['sensor']}
        name="entity_todays_fire_danger" label=${this._t("entity_fire_today")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
    `;
  }

  private _slotOptions(currentValue: string): TemplateResult {
    const opts: Array<[string, string]> = [
      ['humidity',          'Current humidity'],
      ['rainfall',          "Today's recorded rainfall"],
      ['pressure',          'Current air pressure'],
      ['wind',              'Current wind conditions'],
      ['wind_gust',         'Current wind gust'],
      ['wind_kt',           'Current wind conditions kts'],
      ['visibility',        'Current visibility'],
      ['observed_max',      "Today's observed max"],
      ['observed_min',      "Today's observed min"],
      ['forecast_max',      "Today's forecast max"],
      ['forecast_min',      "Today's forecast min"],
      ['temp_next',         'Next temp min/max'],
      ['temp_following',    'Following temp min/max'],
      ['temp_maximums',     'Observed/forecast max'],
      ['temp_minimums',     'Observed/forecast min'],
      ['sun_next',          'Next sun rise/set time'],
      ['sun_following',     'Following sun rise/set time'],
      ['moon',              'Moon phase'],
      ['pop',               'Chance of rain'],
      ['popforecast',       'Rainfall forecast'],
      ['possible_today',    "Today's forecast rainfall"],
      ['possible_tomorrow', "Tomorrow's forecast rainfall"],
      ['uv_summary',        "Today's uv forecast"],
      ['fire_danger',       "Today's fire danger"],
      ['custom1',           'Custom entity 1'],
      ['custom2',           'Custom entity 2'],
      ['custom3',           'Custom entity 3'],
      ['custom4',           'Custom entity 4'],
      ['empty',             'Blank slot'],
      ['remove',            'Remove slot'],
    ];
    return html`${opts.map(([v, l]) => html`<option value="${v}" ?selected=${currentValue === v}>${l}</option>`)}`;
  }

  private _sectionSlotsEditor(): TemplateResult {

    return html`
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t('slot_l1')}</label>
          <select class='ha-select-compat' .configValue=${'slot_l1'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l1)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t('slot_r1')}</label>
          <select class='ha-select-compat' .configValue=${'slot_r1'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r1)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t('slot_l2')}</label>
          <select class='ha-select-compat' .configValue=${'slot_l2'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l2)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t('slot_r2')}</label>
          <select class='ha-select-compat' .configValue=${'slot_r2'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r2)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t('slot_l3')}</label>
          <select class='ha-select-compat' .configValue=${'slot_l3'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l3)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t('slot_r3')}</label>
          <select class='ha-select-compat' .configValue=${'slot_r3'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r3)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t('slot_l4')}</label>
          <select class='ha-select-compat' .configValue=${'slot_l4'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l4)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t('slot_r4')}</label>
          <select class='ha-select-compat' .configValue=${'slot_r4'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r4)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t('slot_l5')}</label>
          <select class='ha-select-compat' .configValue=${'slot_l5'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l5)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t('slot_r5')}</label>
          <select class='ha-select-compat' .configValue=${'slot_r5'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r5)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t('slot_l6')}</label>
          <select class='ha-select-compat' .configValue=${'slot_l6'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l6)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t('slot_r6')}</label>
          <select class='ha-select-compat' .configValue=${'slot_r6'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r6)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t('slot_l7')}</label>
          <select class='ha-select-compat' .configValue=${'slot_l7'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l7)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t('slot_r7')}</label>
          <select class='ha-select-compat' .configValue=${'slot_r7'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r7)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t('slot_l8')}</label>
          <select class='ha-select-compat' .configValue=${'slot_l8'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l8)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t('slot_r8')}</label>
          <select class='ha-select-compat' .configValue=${'slot_r8'} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r8)}
          </select>
        </div>
      </div>
      ${this._optional_entities}
    `;
  }

  private _optionSlotsEditor(): TemplateResult {
    return html`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_today_temperature_decimals !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_today_temperature_decimals !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_today_temperature_decimals'} .checked=${this._option_today_temperature_decimals !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("today_temp_decimals")}</span>
            </div>
        </div>
        <label class='mdc-label'>${this._t('pressure_decimals')}</label>
        <select class='ha-select-compat' .configValue=${'option_pressure_decimals'} .value=${this._option_pressure_decimals !== null ? String(this._option_pressure_decimals) : ''} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_today_rainfall_decimals !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_today_rainfall_decimals !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_today_rainfall_decimals'} .checked=${this._option_today_rainfall_decimals !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("today_rain_decimals")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_forecast_decimals !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_forecast_decimals !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_forecast_decimals'} .checked=${this._option_forecast_decimals !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("forecast_temp_decimals")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_show_forecast_pop !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_show_forecast_pop !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_show_forecast_pop'} .checked=${this._option_show_forecast_pop !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_forecast_pop")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_show_forecast_wind === true ? "eye-toggle active" : "eye-toggle"} .path=${this._option_show_forecast_wind === true ? mdiLockOpenVariant : mdiLock} .value=${'option_show_forecast_wind'} .checked=${this._option_show_forecast_wind === true} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_forecast_wind")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_show_gust_in_wind !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_show_gust_in_wind !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_show_gust_in_wind'} .checked=${this._option_show_gust_in_wind !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_gust_in_wind")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_color_fire_danger !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_color_fire_danger !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_color_fire_danger'} .checked=${this._option_color_fire_danger !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("colour_fire_danger")}</span>
            </div>
        </div>
      </div>
    `;
  }

  private _sectionDailyForecastEditor(): TemplateResult {
    const attr_names: TemplateResult[] = [];
    if (this._daily_extended_use_attr === true) {
      const attrs = this.hass !== undefined && this.hass.states[this._entity_extended_1] !== undefined ? this.hass.states[this._entity_extended_1].attributes : [];
      for (const element in attrs) {
        attr_names.push(html`<option value="${element}">${element}</option>`);
      }
    }

    return html`
      <ha-entity-picker .hass=${this.hass} .configValue=${'weather_entity'} .value=${this._weather_entity} .includeDomains=${['weather']}
        name="weather_entity" label=${this._t("weather_entity")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <label class='mdc-label'>${this._t('forecast_type')}</label>
      <select class='ha-select-compat' .configValue=${'forecast_type'} .value=${this._forecast_type} @change=${this._valueChanged}>
        <option value=""></option>
        <option value="daily">${this._t("opt_daily")}</option>
        <option value="hourly">${this._t("opt_hourly")}</option>
        <option value="twice_daily">${this._t("opt_twice_daily")}</option>
      </select>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_icon_1'} .value=${this._entity_forecast_icon_1} .includeDomains=${['sensor', 'weather']}
        name="entity_forecast_icon_1" label=${this._t("entity_forecast_icon_1")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_summary_1'} .value=${this._entity_summary_1} .includeDomains=${['sensor', 'weather']}
        name="entity_summary_1" label=${this._t("entity_summary_1")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${this._entity_summary_1 !== '' && !this._entity_summary_1.match('^weather.') ? html`
        <div class="side-by-side">
          <div>
            <div class="toggle-row">
              <ha-icon-button class=${this._summary_1_use_attr ? "eye-toggle active" : "eye-toggle"} .path=${this._summary_1_use_attr ? mdiLockOpenVariant : mdiLock} .value=${'summary_1_use_attr'} .checked=${this._summary_1_use_attr} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
          </div>
          ${this._summary_1_use_attr ? html`
            <ha-selector .hass=${this.hass} .entityId=${this._entity_summary_1} .configValue=${'summary_1_name_attr'} .value=${this._summary_1_name_attr}
              .selector=${{ attribute: { entity_id: this._entity_summary_1 } }} .required=${false}
              name="summary_1_name_attr" label=${this._t("attribute")} allow-custom-value
              @value-changed=${this._valueChangedPicker}>
            </ha-selector>` : html``}
        </div>` : html``}
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_min_1'} .value=${this._entity_forecast_min_1} .includeDomains=${['sensor', 'weather']}
        name="entity_forecast_min_1" label=${this._t("entity_forecast_min_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_forecast_max_1'} .value=${this._entity_forecast_max_1} .includeDomains=${['sensor', 'weather']}
        name="entity_forecast_max_1" label=${this._t("entity_forecast_max_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pop_1'} .value=${this._entity_pop_1}  .includeDomains=${['sensor', 'weather']}
        name="entity_pop_1" label=${this._t("entity_pop_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${'entity_pos_1'} .value=${this._entity_pos_1}  .includeDomains=${['sensor', 'weather']}
        name="entity_pos_1" label=${this._t("entity_pos_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${this._daily_forecast_layout === 'vertical' ? html`
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_extended_1'} .value=${this._entity_extended_1} .includeDomains=${['sensor', 'weather']}
          name="entity_extended_1" label=${this._t("entity_extended_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        ${this._entity_extended_1 !== '' ? html`
          <div class="side-by-side">
            <div>
              <div class="toggle-row">
              <ha-icon-button class=${this._daily_extended_use_attr !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._daily_extended_use_attr !== false ? mdiLockOpenVariant : mdiLock} .value=${'daily_extended_use_attr'} .checked=${this._daily_extended_use_attr !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
            </div>
            ${this._entity_extended_1 !== '' && this._daily_extended_use_attr === true ? html`
              <ha-selector .hass=${this.hass} .entityId=${this._entity_extended_1} .configValue=${'daily_extended_name_attr'} .value=${this._daily_extended_name_attr} .includeDomains=${['sensor']}
                .selector = ${{ attribute: { entity_id: this._entity_extended_1 } }} .required=${false}
                name="daily_extended_name_attr" label=${this._t("attribute")} allow-custom-value @value-changed=${this._valueChangedPicker}>
              </ha-selector>` : html``}
          </div>` : html``}
        <ha-entity-picker .hass=${this.hass} .configValue=${'entity_fire_danger_1'} .value=${this._entity_fire_danger_1} .includeDomains=${['sensor']}
          name="entity_fire_danger_1" label=${this._t("entity_fire_danger_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      ` : ``}
    `;
  }

  private _optionChartsEditor(): TemplateResult {
    return html`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
            <ha-icon-button class=${this._option_show_temperature_chart === true ? "eye-toggle active" : "eye-toggle"} .path=${this._option_show_temperature_chart === true ? mdiLockOpenVariant : mdiLock} .value=${'option_show_temperature_chart'} .checked=${this._option_show_temperature_chart === true} @click=${this._toggleVisibility}></ha-icon-button>
            <span class="toggle-label">${this._t("show_temp_chart")}</span>
          </div>
        </div>
        <div>
          <div class="toggle-row">
            <ha-icon-button class=${this._option_show_precipitation_chart === true ? "eye-toggle active" : "eye-toggle"} .path=${this._option_show_precipitation_chart === true ? mdiLockOpenVariant : mdiLock} .value=${'option_show_precipitation_chart'} .checked=${this._option_show_precipitation_chart === true} @click=${this._toggleVisibility}></ha-icon-button>
            <span class="toggle-label">${this._t("show_precip_chart")}</span>
          </div>
        </div>
      </div>
    `;
  }

  private _optionDailyForecastEditor(): TemplateResult {
    return html`
      <div class="side-by-side">
        <label class='mdc-label'>${this._t('daily_forecast_layout')}</label>
        <select class='ha-select-compat' .configValue=${'daily_forecast_layout'} .value=${this._daily_forecast_layout} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="horizontal">${this._t("opt_horizontal")}</option>
          <option value="vertical">${this._t("opt_vertical")}</option>
        </select>
        <div></div>
      </div>
      <div class="side-by-side">
        <label class='mdc-label'>${this._t('daily_forecast_days')}</label>
        <select class='ha-select-compat' .configValue=${'daily_forecast_days'} .value=${this._daily_forecast_days !== null ? String(this._daily_forecast_days) : ''} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          ${this._daily_forecast_layout === 'vertical' ? html`
            <option value="6">6</option>
            <option value="7">7</option>` : html``}
        </select>
        ${this._daily_forecast_layout === 'vertical' ? html`<label class='mdc-label'>${this._t('daily_extended_days')}</label>
          <select class='ha-select-compat' .configValue=${'daily_extended_forecast_days'} @change=${this._valueChangedNumber}>
          <option value=""></option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>` : html`<div></div>`}
      </div>

        <div class="side-by-side">
          <div>
            ${this._daily_forecast_layout !== 'vertical' ? html`
              <div class="toggle-row">
              <ha-icon-button class=${this._option_tooltips !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_tooltips !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_tooltips'} .checked=${this._option_tooltips !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("forecast_tooltips")}</span>
            </div>` : html``}
          </div>
          <div>
            <div class="toggle-row">
              <ha-icon-button class=${this._option_show_current_day === true ? "eye-toggle active" : "eye-toggle"} .path=${this._option_show_current_day === true ? mdiLockOpenVariant : mdiLock} .value=${'option_show_current_day'} .checked=${this._option_show_current_day === true} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("include_today")}</span>
            </div>
          </div>
        </div>

        <div class="side-by-side">
        ${this._daily_forecast_layout === 'vertical' ? html`<div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_daily_color_fire_danger !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_daily_color_fire_danger !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_daily_color_fire_danger'} .checked=${this._option_daily_color_fire_danger !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("colour_fire_danger")}</span>
            </div>
        </div>` : html``}
        <div>
        </div>
      </div>
    `;
  }

  private _optionGlobalOptionsEditor(): TemplateResult {
    return html`
      <ha-input label=${this._t("card_title_1")} .value=${this._text_card_title} .configValue=${'text_card_title'}
        @input=${this._valueChanged}>
      </ha-input>
      <ha-input label=${this._t("card_title_2")} .value=${this._text_card_title_2} .configValue=${'text_card_title_2'}
        @input=${this._valueChanged}>
      </ha-input>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._option_static_icons !== false ? "eye-toggle active" : "eye-toggle"} .path=${this._option_static_icons !== false ? mdiLockOpenVariant : mdiLock} .value=${'option_static_icons'} .checked=${this._option_static_icons !== false} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_static_icons")}</span>
          </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${this._config?.option_compact_slots ? "eye-toggle active" : "eye-toggle"} .path=${this._config?.option_compact_slots ? mdiLockOpenVariant : mdiLock} .value=${'option_compact_slots'} .checked=${this._config?.option_compact_slots === true} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("compact_slots")}</span>
            </div>
        </div>
        <div></div>
      </div>
      <div class="side-by-side">
        <label class='mdc-label'>${this._t('time_format')}</label>
        <select class='ha-select-compat' .configValue=${'option_time_format'} .value=${this._option_time_format ?? ''} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="system">${this._t("opt_system")}</option>
          <option value="12hour">${this._t("opt_12hour")}</option>
          <option value="24hour">${this._t("opt_24hour")}</option>
        </select>
        <label class='mdc-label'>${this._t('locale')}</label>
        <select class='ha-select-compat' .configValue=${'option_locale'} .value=${this._option_locale} @change=${this._valueChanged}>
          <option value="">${this._t("opt_locale_auto")}</option>
          <option value="bg">🇧🇬 Български</option>
          <option value="da">🇩🇰 Dansk</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="en">🇬🇧 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="he">🇮🇱 עברית</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="nl">🇳🇱 Nederlands</option>
          <option value="pl">🇵🇱 Polski</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="ua">🇺🇦 Українська</option>
        </select>
      </div>
      <div class="side-by-side">
        <div>
          <label class="label">${this._t("icon_pack")}</label>
          <select class='ha-select-compat' .configValue=${'icon_pack'} .value=${this._icon_pack} @change=${this._valueChanged}>
            <option value='default'>Default (built-in animated)</option>
            <option value='meteocons-fill'>Meteocons — Fill (CDN, basmilius)</option>
            <option value='meteocons-line'>Meteocons — Line (CDN, basmilius)</option>
            <option value='wcc-2'>ammap Weather Icons (requires weather-chart-card)</option>
            <option value='custom'>Custom path...</option>
          </select>
        </div>
        ${this._icon_pack === 'custom' ? html`
        <div>
          <ha-input .label=${this._t("icon_path")} .value=${this._icon_pack_path}
            .configValue=${'icon_pack_path'} @change=${this._valueChanged}>
          </ha-input>
          <div class="help-text">Use {condition} as placeholder — e.g. /local/icons/{condition}.svg</div>
        </div>` : html``}
      </div>
      <div class="help-text" style="padding: 8px 0 4px; font-weight: 500;">${this._t("actions")}</div>
      <hui-action-editor
        .label=${this._t("tap_action")}
        .hass=${this.hass}
        .config=${this._tap_action}
        .actions=${["more-info","toggle","navigate","url","call-service","assist","none"]}
        @value-changed=${(ev) => this._valueChangedAction('tap_action', ev)}>
      </hui-action-editor>
      <hui-action-editor
        .label=${this._t("hold_action")}
        .hass=${this.hass}
        .config=${this._hold_action}
        .actions=${["more-info","toggle","navigate","url","call-service","assist","none"]}
        @value-changed=${(ev) => this._valueChangedAction('hold_action', ev)}>
      </hui-action-editor>
      <hui-action-editor
        .label=${this._t("double_tap_action")}
        .hass=${this.hass}
        .config=${this._double_tap_action}
        .actions=${["more-info","toggle","navigate","url","call-service","assist","none"]}
        @value-changed=${(ev) => this._valueChangedAction('double_tap_action', ev)}>
      </hui-action-editor>
    `;
  }

  private _renderSubElementEditor(): TemplateResult {
    const subel: TemplateResult[] = [
      html`
        <div class="header">
          <div class="back-title">
            <mwc-icon-button @click=${this._goBack}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </mwc-icon-button>
          </div>
        </div>
      `,
    ];
    switch (this._subElementEditor) {
      case 'section_overview':
        subel.push(this._sectionOverviewEditor());
        break;
      case 'option_overview':
        subel.push(this._optionOverviewEditor());
        break;
      case 'section_extended':
        subel.push(this._sectionExtendedEditor());
        break;
      case 'section_slots':
        subel.push(this._sectionSlotsEditor());
        break;
      case 'option_slots':
        subel.push(this._optionSlotsEditor());
        break;
      case 'section_daily_forecast':
        subel.push(this._sectionDailyForecastEditor());
        break;
      case 'option_daily_forecast':
        subel.push(this._optionDailyForecastEditor());
        break;
      case 'option_charts':
        subel.push(this._optionChartsEditor());
        break;
      case 'option_global_options':
        subel.push(this._optionGlobalOptionsEditor());
        break;
    }
    return html`${subel}`;
  }

  private _goBack(): void {
    this._subElementEditor = undefined;
  }

  get _show_section_overview(): boolean {
    return this._config?.show_section_overview !== false; //default on
  }

  get _show_section_extended(): boolean {
    return this._config?.show_section_extended !== false; //default on
  }

  get _show_section_slots(): boolean {
    return this._config?.show_section_slots !== false; //default on
  }

  get _show_section_daily_forecast(): boolean {
    return this._config?.show_section_daily_forecast !== false; //default on
  }

  get _show_section_charts(): boolean {
    return this._config?.show_section_charts !== false; //default on
  }

  private getConfigBlock(block: string, first: boolean, last: boolean): TemplateResult {
    switch (block) {
      case 'overview':
        return html`
          <div class="section-flex edit-overview-section">
            <div class="section-label">
              <ha-icon-button class=${this._show_section_overview !== false ? "visibility-toggle active" : "visibility-toggle"} .path=${this._show_section_overview !== false ? mdiLockOpenVariant : mdiLock} .value=${'show_section_overview'} .checked=${this._show_section_overview !== false} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:eye-outline"></ha-icon>
              <span class="section-title">${this._t("overview_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${'overview'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'overview'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_overview'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="option-icon" .value=${'option_overview'} .path=${mdiApplicationEditOutline} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
      case 'extended':
        return html`
          <div class="section-flex edit-extended-section">
            <div class="section-label">
              <ha-icon-button class=${this._show_section_extended !== false ? "visibility-toggle active" : "visibility-toggle"} .path=${this._show_section_extended !== false ? mdiLockOpenVariant : mdiLock} .value=${'show_section_extended'} .checked=${this._show_section_extended !== false} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:text-box-outline"></ha-icon>
              <span class="section-title">${this._t("extended_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${'extended'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'extended'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_extended'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <div class="no-icon"></div>
            </div>
          </div>
        `;
      case 'slots':
        return html`
          <div class="section-flex edit-slots-section">
            <div class="section-label">
              <ha-icon-button class=${this._show_section_slots !== false ? "visibility-toggle active" : "visibility-toggle"} .path=${this._show_section_slots !== false ? mdiLockOpenVariant : mdiLock} .value=${'show_section_slots'} .checked=${this._show_section_slots !== false} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:view-grid-outline"></ha-icon>
              <span class="section-title">${this._t("slots_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${'slots'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'slots'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_slots'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${'option_slots'} .path=${mdiApplicationEditOutline} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
      case 'daily_forecast':
        return html`
          <div class="section-flex edit-daily-forecast-section">
            <div class="section-label">
              <ha-icon-button class=${this._show_section_daily_forecast !== false ? "visibility-toggle active" : "visibility-toggle"} .path=${this._show_section_daily_forecast !== false ? mdiLockOpenVariant : mdiLock} .value=${'show_section_daily_forecast'} .checked=${this._show_section_daily_forecast !== false} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:calendar-week"></ha-icon>
              <span class="section-title">${this._t("daily_forecast_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${'daily_forecast'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'daily_forecast'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${'section_daily_forecast'} .path=${mdiPencil} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${'option_daily_forecast'} .path=${mdiApplicationEditOutline} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
      case 'charts':
        return html`
          <div class="section-flex edit-charts-section">
            <div class="section-label">
              <ha-icon-button class=${this._show_section_charts !== false ? "visibility-toggle active" : "visibility-toggle"} .path=${this._show_section_charts !== false ? mdiLockOpenVariant : mdiLock} .value=${'show_section_charts'} .checked=${this._show_section_charts !== false} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:chart-line"></ha-icon>
              <span class="section-title">${this._t("charts_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${'charts'} .path=${mdiArrowDown} .disabled=${last} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${'charts'} .path=${mdiArrowUp} .disabled=${first} @click="${this._moveUp}">
              </ha-icon-button>
              <div class="no-icon"></div>
              <ha-icon-button class="option-icon" .value=${'option_charts'} .path=${mdiApplicationEditOutline} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
      case 'global_options':
        return html`
          <div class="section-flex">
            <div class="section-label">
              <div class="visibility-spacer"></div>
              <ha-icon class="section-icon" icon="mdi:cog"></ha-icon>
              <span class="section-title">${this._t("global_options")}</span>
            </div>
            <div>
              <div class="no-icon"></div>
              <ha-icon-button class="edit-icon" .value=${'option_global_options'} .path=${mdiApplicationEditOutline} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;
    }
    return html``;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    if (this._subElementEditor) return this._renderSubElementEditor();

    const htmlConfig: TemplateResult[] = [];
    const slots = this._section_order || [];

    htmlConfig.push(this.getConfigBlock('global_options', false, false));
    slots.forEach((slot, index) => {
      htmlConfig.push(this.getConfigBlock(slot, index === 0, index + 1 === slots.length));
    });

    return html`${htmlConfig}`;
  }


  private _t(key: string): string {
    const lang = (this.hass?.language || 'en').split('-')[0].toLowerCase();
    const t = (this.constructor as unknown as {_translations: Record<string, Record<string, string>>})._translations;
    return (t[lang] && t[lang][key]) ? t[lang][key] : (t['en'][key] ?? key);
  }

  private static readonly _translations: Record<string, Record<string, string>> = {
    en: {
      global_options:'Global Options',overview_section:'Overview Section',extended_section:'Extended Section',slots_section:'Slots Section',daily_forecast_section:'Daily Forecast Section',
      compact_slots:'Compact slot labels',show_static_icons:'Show Static Icons',time_format:'Time Format',locale:'Locale',icon_pack:'Icon Pack',opt_locale_auto:'Auto (browser)',
      compact_slots:'Libellés compacts',actions:'Actions',tap_action:'Tap Action',hold_action:'Hold Action',double_tap_action:'Double-tap Action',icon_pack_default:'Default (built-in animated)',icon_pack_met_fill:'Meteocons — Fill (CDN, basmilius)',icon_pack_met_line:'Meteocons — Line (CDN, basmilius)',icon_pack_ammap:'ammap Weather Icons (requires weather-chart-card)',icon_pack_custom:'Custom path...',icon_path:'Icon path',icon_path_hint:'Use {condition} as placeholder — e.g. /local/icons/{condition}.svg',
      overview_layout:'Overview Layout',card_title_1:'Card Title Text Line 1',card_title_2:'Card Title Text Line 2',entity_temperature:'Entity Current Temperature',entity_apparent_temp:'Entity Apparent Temperature',entity_forecast_icon:'Entity Forecast Icon',entity_forecast_icon_1:'Entity Forecast Icon 1',entity_summary:'Entity Forecast Summary',entity_summary_1:'Entity Forecast Summary 1',entity_extended:'Entity Extended Forecast',entity_extended_1:'Entity Extended Forecast 1',use_attribute:'Use Attribute',attribute:'Attribute',
      slot_l1:'Slot Left 1',slot_l2:'Slot Left 2',slot_l3:'Slot Left 3',slot_l4:'Slot Left 4',slot_l5:'Slot Left 5',slot_l6:'Slot Left 6',slot_l7:'Slot Left 7',slot_l8:'Slot Left 8',slot_r1:'Slot Right 1',slot_r2:'Slot Right 2',slot_r3:'Slot Right 3',slot_r4:'Slot Right 4',slot_r5:'Slot Right 5',slot_r6:'Slot Right 6',slot_r7:'Slot Right 7',slot_r8:'Slot Right 8',
      today_temp_decimals:'Todays Temperature Decimals',today_rain_decimals:'Todays Rainfall Decimals',forecast_temp_decimals:'Forecast Temperature Decimals',pressure_decimals:'Pressure Decimals',show_separator:'Show separator',show_temp_decimals:'Show temperature decimals',
      entity_humidity:'Humidity',entity_pressure:'Atmospheric Pressure',entity_pop:'Chance of Rain',entity_pos:'Possible Rain Today',entity_2day_pos:'Possible Rain Tomorrow',entity_rainfall:'Todays Rain',entity_fire_danger:'Fire Danger',entity_uv_summary:'UV Alert Summary',entity_sun:'Entity Sun',entity_moon:'Moon Phase Entity',entity_visibility:'Entity Visibility',entity_wind_speed:'Entity Wind Speed',entity_wind_bearing:'Entity Wind Bearing',entity_wind_gust:'Entity Wind Gust',entity_wind_speed_kt:'Entity Wind Speed Kt',entity_wind_gust_kt:'Entity Wind Gust Kt',entity_update_time:'Entity Update Time',update_time_prefix:'Update Time Prefix',entity_uv_today:"Entity Today's UV Forecast",entity_fire_today:"Entity Today's Fire Danger",entity_observed_max:'Entity Observed Max',entity_observed_min:'Entity Observed Min',entity_forecast_max:'Entity Forecast Max',entity_forecast_max_1:'Entity Forecast Max 1',entity_forecast_min:'Entity Forecast Min',entity_forecast_min_1:'Entity Forecast Min 1',entity_temp_next:'Entity Temp Next',entity_temp_next_label:'Entity Temp Next Label',entity_temp_following:'Entity Temp Following',entity_temp_fol_label:'Entity Temp Following Label',entity_fire_danger_1:'Entity Fire Danger 1',entity_pop_1:'Entity Forecast Chance of Rain 1',entity_pos_1:'Entity Forecast Possible Rain 1',
      custom1_value:'Custom 1 Value',custom2_value:'Custom 2 Value',custom3_value:'Custom 3 Value',custom4_value:'Custom 4 Value',custom1_icon:'Custom 1 Icon',custom2_icon:'Custom 2 Icon',custom3_icon:'Custom 3 Icon',custom4_icon:'Custom 4 Icon',custom1_units:'Custom 1 Units',custom2_units:'Custom 2 Units',custom3_units:'Custom 3 Units',custom4_units:'Custom 4 Units',custom1_label:'Custom 1 Label (optional)',custom2_label:'Custom 2 Label (optional)',custom3_label:'Custom 3 Label (optional)',custom4_label:'Custom 4 Label (optional)',
      weather_entity:'Weather Entity with Forecasts',forecast_type:'Forecast Type',daily_forecast_layout:'Daily Forecast Layout',daily_forecast_days:'Daily Forecast Days',daily_extended_days:'Daily Extended Days',show_forecast_pop:'Show Precipitation Probability in Forecast',show_forecast_wind:'Show Wind in Forecast',show_gust_in_wind:'Show Gust in Wind Slot',colour_fire_danger:'Colour Fire Danger',include_today:'Include Today in Forecast',show_temp_chart:'Show Temperature Chart',show_precip_chart:'Show Precipitation Chart',forecast_tooltips:'Enable forecast tooltips',charts_section:'Charts Section',
      opt_daily:'Daily',opt_hourly:'Hourly',opt_twice_daily:'Twice Daily',opt_horizontal:'Horizontal',opt_vertical:'Vertical',opt_complete:'Complete',opt_observations:'Observations',opt_forecast:'Forecast',opt_title_only:'Title only',opt_system:'System',opt_12hour:'12 hour',opt_24hour:'24 hour',
    },
    bg: {
      global_options:'Глобални настройки',overview_section:'Секция Преглед',extended_section:'Разширена секция',slots_section:'Секция Слотове',daily_forecast_section:'Секция Прогноза',
      compact_slots:'Компактни надписи',show_static_icons:'Статични икони',time_format:'Формат на часа',locale:'Език',icon_pack:'Пакет с икони',opt_locale_auto:'Автоматично (браузър)',
      compact_slots:'Компактные подписи',actions:'Действия',tap_action:'Действие при натискане',hold_action:'Действие при задържане',double_tap_action:'Двойно натискане',icon_pack_default:'По подразбиране (вградени анимирани)',icon_pack_met_fill:'Meteocons — Запълнен (CDN)',icon_pack_met_line:'Meteocons — Линеен (CDN)',icon_pack_ammap:'ammap икони (изисква weather-chart-card)',icon_pack_custom:'Персонализиран път...',icon_path:'Път до икона',icon_path_hint:'Използвай {condition} като плейсхолър',
      overview_layout:'Оформление на преглед',card_title_1:'Заглавие ред 1',card_title_2:'Заглавие ред 2',entity_temperature:'Текуща температура',entity_apparent_temp:'Усещана температура',entity_forecast_icon:'Икона прогноза',entity_forecast_icon_1:'Икона прогноза 1',entity_summary:'Резюме прогноза',entity_summary_1:'Резюме прогноза 1',entity_extended:'Разширена прогноза',entity_extended_1:'Разширена прогноза 1',use_attribute:'Използвай атрибут',attribute:'Атрибут',
      slot_l1:'Слот Ляво 1',slot_l2:'Слот Ляво 2',slot_l3:'Слот Ляво 3',slot_l4:'Слот Ляво 4',slot_l5:'Слот Ляво 5',slot_l6:'Слот Ляво 6',slot_l7:'Слот Ляво 7',slot_l8:'Слот Ляво 8',slot_r1:'Слот Дясно 1',slot_r2:'Слот Дясно 2',slot_r3:'Слот Дясно 3',slot_r4:'Слот Дясно 4',slot_r5:'Слот Дясно 5',slot_r6:'Слот Дясно 6',slot_r7:'Слот Дясно 7',slot_r8:'Слот Дясно 8',
      today_temp_decimals:'Десетични за текуща темп.',today_rain_decimals:'Десетични за валежи',forecast_temp_decimals:'Десетични за прогнозна темп.',pressure_decimals:'Десетични за налягане',show_separator:'Показвай разделител',show_temp_decimals:'Показвай десетични',
      entity_humidity:'Влажност',entity_pressure:'Атмосферно налягане',entity_pop:'Вероятност за дъжд',entity_pos:'Възможен дъжд днес',entity_2day_pos:'Възможен дъжд утре',entity_rainfall:'Дъжд днес',entity_fire_danger:'Опасност от пожар',entity_uv_summary:'UV сигнал',entity_sun:'Слънце',entity_moon:'Фаза на луната',entity_visibility:'Видимост',entity_wind_speed:'Скорост на вятъра',entity_wind_bearing:'Посока на вятъра',entity_wind_gust:'Пориви',entity_wind_speed_kt:'Скорост (kn)',entity_wind_gust_kt:'Пориви (kn)',entity_update_time:'Час на обновяване',update_time_prefix:'Префикс за час',entity_uv_today:'UV прогноза (днес)',entity_fire_today:'Опасност от пожар (днес)',entity_observed_max:'Макс. наблюдавана',entity_observed_min:'Мин. наблюдавана',entity_forecast_max:'Макс. прогноза',entity_forecast_max_1:'Макс. прогноза 1',entity_forecast_min:'Мин. прогноза',entity_forecast_min_1:'Мин. прогноза 1',entity_temp_next:'Следваща темп.',entity_temp_next_label:'Етикет следваща темп.',entity_temp_following:'Трета темп.',entity_temp_fol_label:'Етикет трета темп.',entity_fire_danger_1:'Опасност от пожар 1',entity_pop_1:'Вероятност за дъжд 1',entity_pos_1:'Възможни валежи 1',
      custom1_value:'Перс. 1 стойност',custom2_value:'Перс. 2 стойност',custom3_value:'Перс. 3 стойност',custom4_value:'Перс. 4 стойност',custom1_icon:'Перс. 1 икона',custom2_icon:'Перс. 2 икона',custom3_icon:'Перс. 3 икона',custom4_icon:'Перс. 4 икона',custom1_units:'Перс. 1 единица',custom2_units:'Перс. 2 единица',custom3_units:'Перс. 3 единица',custom4_units:'Перс. 4 единица',custom1_label:'Перс. 1 етикет',custom2_label:'Перс. 2 етикет',custom3_label:'Перс. 3 етикет',custom4_label:'Перс. 4 етикет',
      weather_entity:'Ентити за прогноза',forecast_type:'Тип прогноза',daily_forecast_layout:'Оформление на прогнозата',daily_forecast_days:'Дни в прогнозата',daily_extended_days:'Дни разширена прогноза',show_forecast_pop:'Вероятност за валежи в прогнозата',show_forecast_wind:'Вятър в прогнозата',show_gust_in_wind:'Пориви в слота за вятър',colour_fire_danger:'Оцветяване — опасност от пожар',include_today:'Включи днес в прогнозата',show_temp_chart:'Покажи температурен чарт',show_precip_chart:'Покажи чарт за валежи',forecast_tooltips:'Tooltip-ове в прогнозата',charts_section:'Секция Чартове',
      opt_daily:'Дневна',opt_hourly:'Почасова',opt_twice_daily:'Два пъти дневно',opt_horizontal:'Хоризонтална',opt_vertical:'Вертикална',opt_complete:'Пълно',opt_observations:'Наблюдения',opt_forecast:'Прогноза',opt_title_only:'Само заглавие',opt_system:'Системен',opt_12hour:'12-часов',opt_24hour:'24-часов',
    },
    da: {
      compact_slots:'Kompakte etiketter',actions:'Handlinger',tap_action:'Tryk-handling',hold_action:'Hold-handling',double_tap_action:'Dobbelttryk-handling',
    },
    de: {
      compact_slots:'Kompakte Beschriftungen',actions:'Aktionen',tap_action:'Tipp-Aktion',hold_action:'Halte-Aktion',double_tap_action:'Doppeltipp-Aktion',
    },
    es: {
      compact_slots:'Etiquetas compactas',actions:'Acciones',tap_action:'Acción al tocar',hold_action:'Acción al mantener',double_tap_action:'Doble toque',
    },
    fr: {
      actions:'Actions',tap_action:'Action au toucher',hold_action:'Action maintenue',double_tap_action:'Double toucher',
    },
    he: {
      compact_slots:'תוויות קומפקטיות',actions:'פעולות',tap_action:'פעולה בלחיצה',hold_action:'פעולה בלחיצה ממושכת',double_tap_action:'פעולה בלחיצה כפולה',
    },
    it: {
      compact_slots:'Etichette compatte',actions:'Azioni',tap_action:'Azione al tocco',hold_action:'Azione prolungata',double_tap_action:'Doppio tocco',
    },
    nl: {
      compact_slots:'Compacte labels',actions:'Acties',tap_action:'Tik-actie',hold_action:'Vasthoudactie',double_tap_action:'Dubbele tik-actie',
    },
    pl: {
      compact_slots:'Kompaktowe etykiety',actions:'Akcje',tap_action:'Akcja dotknięcia',hold_action:'Akcja przytrzymania',double_tap_action:'Podwójne dotknięcie',
    },
    ru: {
      actions:'Действия',tap_action:'Действие при нажатии',hold_action:'Действие при удержании',double_tap_action:'Двойное нажатие',
    },
    ua: {
      compact_slots:'Компактні підписи',actions:'Дії',tap_action:'Дія при дотику',hold_action:'Дія при утриманні',double_tap_action:'Подвійний дотик',
    },
  };

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _valueChangedPicker(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    const value = ev.detail.value;
    if (this[`_${target.configValue}`] === value) {
      return;
    }
    if (target.configValue) {
      if (value) {
        this._config = {
          ...this._config,
          [target.configValue]: value,
        };
      } else {
        this._config = { ...this._config };
        delete this._config[target.configValue];
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  private _valueChangedAction(configKey: string, ev): void {
    const value = ev.detail.value;
    if (value === undefined || value === null) return; // ignore init/reset fires
    this._config = { ...this._config, [configKey]: value };
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  private _editSubmenu(ev): void {
    if (ev.currentTarget) {
      const target = ev.currentTarget;
      this._subElementEditor = target.value;
    }
  }

  private _moveUp(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    if (ev.currentTarget) {
      const target = ev.currentTarget;
      if (this._config.section_order) {
        const slot = this._config.section_order.findIndex(t => t === target.value);
        const tmp_section_order = [...this._config.section_order];
        [tmp_section_order[slot], tmp_section_order[slot - 1]] = [this._config.section_order[slot - 1], this._config.section_order[slot]];
        this._config = {
          ...this._config,
          section_order: tmp_section_order,
        }
        //        [this._config.section_order[slot], this._config.section_order[slot - 1]] = [this._config.section_order[slot - 1], this._config.section_order[slot]];
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  private _moveDown(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    if (ev.currentTarget) {
      const target = ev.currentTarget;
      if (this._config.section_order) {
        const slot = this._config.section_order.findIndex(t => t === target.value);
        const tmp_section_order = [...this._config.section_order];
        [tmp_section_order[slot], tmp_section_order[slot + 1]] = [this._config.section_order[slot + 1], this._config.section_order[slot]]
        this._config = {
          ...this._config,
          section_order: tmp_section_order,
        }
        //        [this._config.section_order[slot], this._config.section_order[slot + 1]] = [this._config.section_order[slot + 1], this._config.section_order[slot]];
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }


  private _toggleVisibility(ev: Event): void {
    const btn = ev.currentTarget as any;
    const key = btn.value as string;
    const currentlyActive: boolean = btn.classList.contains('active');
    this._config = { ...this._config, [key]: !currentlyActive };
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    // ha-select fires value-changed with ev.detail.value; inputs use target.value
    const value = ev.detail?.value !== undefined ? ev.detail.value : (target.checked !== undefined ? target.checked : target.value);
    if (this[`_${target.configValue}`] === value) {
      return;
    }
    if (target.configValue) {
      if (value === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  private _valueChangedNumber(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '' || target.value === null) {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: Number(target.value),
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.sortObjectByKeys(this._config) });
  }

  static styles: CSSResultGroup = css`
    :host {
      display: block;
              /* --mdc-menu-min-width: var(--parentWidth); */
      --mdc-menu-item-height: 36px;
      --mdc-typography-subtitle1-font-size: 13px;
    }
    .ha-select-compat {
      display: block;
      width: 100%;
      padding: 8px;
      font-size: 14px;
      font-family: inherit;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer;
      box-sizing: border-box;
    }
    .ha-select-compat:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }
    label.mdc-label {
      display: block;
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 8px;
      margin-bottom: 2px;
    }
    ha-input {
      display: block;
    }
    ha-switch {
      --ha-switch-checked-background-color: var(--primary-color);
      --ha-switch-checked-thumb-background-color: var(--primary-text-color);
    }
    ha-formfield {
      height: 56px;
    }
    .no-icon {
      display: inline-flex;
      width: var(--mds-icon-button-size, 48px);
    }
    /* .option {
      cursor: pointer;
    } */
    /* .row {
      display: flex;
      margin-bottom: -14px;
      pointer-events: none;
    } */
    /* .title {
      padding-left: 16px;
      margin-top: -6px;
      pointer-events: none;
    } */
    /* .secondary {
      padding-left: 40px;
      color: var(--secondary-text-color);
      pointer-events: none;
    } */
    /* .values {
      padding-left: 16px;
      background: var(--secondary-background-color);
    } */
    .section-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-label {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .visibility-spacer {
      width: 32px;
      flex-shrink: 0;
    }
    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin-left: 2px;
    }
    .section-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
      opacity: 0.9;
      flex-shrink: 0;
      margin-right: 2px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .toggle-label {
      font-size: 13px;
      color: var(--primary-text-color);
    }
    .visibility-toggle {
      --mdc-icon-button-size: 32px;
      --mdc-icon-size: 18px;
      color: var(--disabled-color, #9e9e9e);
      opacity: 0.6;
    }
    .visibility-toggle.active {
      color: var(--primary-color);
      opacity: 1;
    }
    .side-by-side {
      display: flex;
    }
    .side-by-side > * {
      flex: 1;
    }
    .side-by-side :not(:last-child) {
      padding-right: 4px;
    }
    .icon-side-by-side {
      display: flex;
    }
    .icon-condition {
      flex-grow: 1;
    }
    .no-switch {
      padding-left: 48px;
    }
    .condition_icon {
      position: relative;
    }
    .condition_icon .condition_icon_big {
      visibility: hidden;
      width: 96px;
      background-color: var(--card-background-color);
      border-radius: 6px;
      border-style: solid;
      border-width: 2px;
      /* Position the tooltip */
      position: absolute;
      z-index: 1;
      bottom: -50%;
      left: 60%;
      -webkit-transform: translateX(0%); /* Safari iOS */
      transform: translateX(-40%);
    }
    .condition_icon .condition_icon_big:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
      }
    .condition_icon:hover .condition_icon_big {
      visibility: visible
    }
  `;
}
