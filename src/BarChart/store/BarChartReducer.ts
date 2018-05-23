import { ScatterData } from "plotly.js";
import { Action, Reducer } from "redux";
import { SeriesPlayground } from "../../components/SeriesPlayground";
import { Container, Data } from "../../utils/namespaces";
import BarChartContainerState = Container.BarChartContainerState;

export type BarChartAction = Action & BarChartInstanceState & { widgetID: string };

export interface BarChartState {
    layoutOptions: string;
    series?: Data.SeriesProps[];
    seriesOptions?: string[];
    configurationOptions: string;
    themeConfigs: { layout: {}, configuration: {}, data: {} };
    scatterData?: ScatterData[];
    playground?: typeof SeriesPlayground;
}

export type BarChartInstanceState = BarChartContainerState & BarChartState;
export interface BarChartReducerState {
    [ widgetID: string ]: BarChartInstanceState;
}

const prefix = "BarChart";
export const RESET = `${prefix}.RESET`;
export const ALERT_MESSAGE = `${prefix}.ALERT_MESSAGE`;
export const TOGGLE_FETCHING_DATA = `${prefix}.TOGGLE_FETCHING_DATA`;
export const UPDATE_DATA_FROM_FETCH = `${prefix}.UPDATE_DATA_FROM_FETCH`;
export const FETCH_DATA_FAILED = `${prefix}.FETCH_DATA_FAILED`;
export const NO_CONTEXT = `${prefix}.NO_CONTEXT`;
export const LOAD_PLAYGROUND = `${prefix}.LOAD_PLAYGROUND`;
export const UPDATE_DATA_FROM_PLAYGROUND = `${prefix}.UPDATE_DATA_FROM_PLAYGROUND`;
export const FETCH_THEME_CONFIGS = `${prefix}.FETCH_THEME_CONFIGS`;
export const FETCH_THEME_CONFIGS_COMPLETE = `${prefix}.FETCH_THEME_CONFIGS_COMPLETE`;

const defaultDataState: Partial<BarChartInstanceState> = {
    configurationOptions: "{\n\n}",
    data: [],
    fetchingData: false,
    layoutOptions: "{\n\n}",
    scatterData: [],
    seriesOptions: []
};

export const defaultInstanceState: Partial<BarChartInstanceState> = {
    ...defaultDataState,
    alertMessage: "",
    fetchingConfigs: false,
    themeConfigs: { layout: {}, configuration: {}, data: {} }
};

const defaultState: Partial<BarChartInstanceState> = {};

export const barChartReducer: Reducer<BarChartReducerState> = (state = defaultState as BarChartReducerState, action: BarChartAction): BarChartReducerState => {
    switch (action.type) {
        case FETCH_THEME_CONFIGS:
            return {
                ...state,
                [action.widgetID]: {
                    ...defaultInstanceState,
                    ...state[action.widgetID],
                    fetchingConfigs: false,
                    fetchingData: true
                }
            };
        case FETCH_THEME_CONFIGS_COMPLETE:
            return {
                ...state,
                [action.widgetID]: {
                    ...defaultInstanceState,
                    ...state[action.widgetID],
                    themeConfigs: action.themeConfigs,
                    fetchingConfigs: false
                }
            };
        case UPDATE_DATA_FROM_FETCH:
            return {
                ...state,
                [action.widgetID]: {
                    ...defaultInstanceState,
                    ...state[action.widgetID],
                    data: action.data && action.data.slice(),
                    layoutOptions: action.layoutOptions,
                    fetchingData: false,
                    scatterData: action.scatterData && action.scatterData.slice(),
                    seriesOptions: action.seriesOptions.slice()
                }
            };
        case FETCH_DATA_FAILED:
            return { ...state, [action.widgetID]: { ...state[action.widgetID], ...defaultDataState } };
        case NO_CONTEXT:
            return {
                ...state,
                [action.widgetID]: {
                    ...defaultInstanceState,
                    ...state[action.widgetID],
                    ...defaultDataState
                } };
        case TOGGLE_FETCHING_DATA:
            return {
                ...state,
                [action.widgetID]: {
                    ...defaultInstanceState,
                    ...state[action.widgetID],
                    fetchingData: action.fetchingData
                } };
        case LOAD_PLAYGROUND:
            return {
                ...state,
                [action.widgetID]: {
                    ...defaultInstanceState,
                    ...state[action.widgetID],
                    playground: action.playground
                } };
        case UPDATE_DATA_FROM_PLAYGROUND:
            return {
                ...state,
                [action.widgetID]: {
                    ...defaultInstanceState,
                    ...state[action.widgetID],
                    layoutOptions: action.layoutOptions,
                    scatterData: action.scatterData && action.scatterData.slice(),
                    seriesOptions: action.seriesOptions.slice(),
                    configurationOptions: action.configurationOptions
                }
            };
        case ALERT_MESSAGE:
            return {
                ...state,
                [action.widgetID]: {
                    ...defaultInstanceState,
                    ...state[action.widgetID],
                    alertMessage: action.alertMessage
                } };
        case RESET:
            return defaultState as BarChartReducerState;
        default:
            return state;
    }
};
