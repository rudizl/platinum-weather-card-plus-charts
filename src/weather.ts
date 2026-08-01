import { HomeAssistant } from 'custom-card-helpers';
import { HassEntityAttributeBase, HassEntityBase } from "home-assistant-js-websocket";

export type ModernForecastType = "hourly" | "daily" | "twice_daily";
export type ForecastType = ModernForecastType | "legacy";

export interface ForecastEvent {
  type: "hourly" | "daily" | "twice_daily";
  forecast: [ForecastAttribute] | null;
}

export const getForecast = (
  //tjl weather_attributes are used for legacy, no longer needed
//weather_attributes?: WeatherEntityAttributes | undefined,
  forecast_event?: ForecastEvent,
  forecast_type?: ForecastType | undefined
):
  | {
      forecast: ForecastAttribute[];
      type: "daily" | "hourly" | "twice_daily";
    }
  | undefined => {
  if (forecast_type === undefined) {
    if (
      forecast_event?.type !== undefined &&
      forecast_event?.forecast &&
      forecast_event?.forecast?.length > 2
    ) {
      return { forecast: forecast_event.forecast, type: forecast_event?.type };
    }
  //tjl make default daily
  //return getLegacyForecast(weather_attributes);
    forecast_type = "daily";
  }

  //tjl I'm getting rid of Legacy
//if (forecast_type === "legacy") {
//  return getLegacyForecast(weather_attributes);
//}

  if (
    forecast_type === forecast_event?.type &&
    forecast_event?.forecast &&
    forecast_event?.forecast?.length > 2
  ) {
    return { forecast: forecast_event.forecast, type: forecast_type };
  }

  return undefined;
};

export const subscribeForecast = (
  hass: HomeAssistant,
  entity_id: string,
  forecast_type: ModernForecastType,
  callback: (forecastevent: ForecastEvent) => void
) =>
  hass.connection.subscribeMessage<ForecastEvent>(callback, {
    type: "weather/subscribe_forecast",
    forecast_type,
    entity_id,
  });

export interface ForecastAttribute {
  temperature: number;
  datetime: string;
  templow?: number;
  precipitation?: number;
  precipitation_probability?: number;
  humidity?: number;
  condition?: string;
  is_daytime?: boolean;
  pressure?: number;
  wind_speed?: string;
  wind_bearing?: number | string;
  //tjl add
  detailed_description?: string;
}

//tjl copied from 
//  https://github.com/home-assistant/frontend/blob/dev/src/data/weather.ts
interface WeatherEntityAttributes extends HassEntityAttributeBase {
  attribution?: string;
  humidity?: number;
  forecast?: ForecastAttribute[];
  is_daytime?: boolean;
  pressure?: number;
  temperature?: number;
  visibility?: number;
  wind_bearing?: number | string;
  wind_speed?: number;
  precipitation_unit: string;
  pressure_unit: string;
  temperature_unit: string;
  visibility_unit: string;
  wind_speed_unit: string;
}

//tjl copied from 
//  https://github.com/home-assistant/frontend/blob/dev/src/data/weather.ts
export interface WeatherEntity extends HassEntityBase {
  attributes: WeatherEntityAttributes;
}
