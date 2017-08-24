import { Component, createElement } from "react";
import * as classNames from "classnames";

import * as Plotly from "plotly.js/dist/plotly";
import { Dimensions, getDimensions } from "../../utils/style";
import "core-js/es6/promise";

export interface LineChartProps extends Dimensions {
    data?: Plotly.ScatterData[];
    config?: Partial<Plotly.Config>;
    layout?: Partial<Plotly.Layout>;
    className?: string;
    style?: object;
    onClickAction?: () => void;
}

export type Mode = "lines" | "markers" | "lines+markers";

export class LineChart extends Component<LineChartProps, {}> {
    private lineChart: HTMLDivElement;
    private data = [
        {
            connectgaps: true,
            mode: "lines+markers",
            name: "Default data",
            type: "scatter",
            x: [ 14, 20, 30, 50 ],
            y: [ 14, 30, 20, 40 ]
        }
    ] as Plotly.ScatterData[];

    constructor(props: LineChartProps) {
        super(props);

        this.getPlotlyNodeRef = this.getPlotlyNodeRef.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    render() {
        return createElement("div", {
            className: classNames("widget-charts-line", this.props.className),
            ref: this.getPlotlyNodeRef,
            style: { ...getDimensions(this.props), ...this.props.style }
        });
    }

    componentDidMount() {
        this.renderChart(this.props);
        this.setUpResizeEvents();
        this.adjustStyle();
    }

    componentWillReceiveProps(newProps: LineChartProps) {
        this.renderChart(newProps);
    }

    componentWillUnmount() {
        if (this.lineChart) {
            Plotly.purge(this.lineChart);
        }
        window.removeEventListener("resize", this.onResize);
    }

    private getPlotlyNodeRef(node: HTMLDivElement) {
        this.lineChart = node;
    }

    private adjustStyle() {
        if (this.lineChart) {
            const wrapperElement = this.lineChart.parentElement;
            if (this.props.heightUnit === "percentageOfParent" && wrapperElement) {
                wrapperElement.style.height = "100%";
                wrapperElement.style.width = "100%";
            }
        }
    }

    private setUpResizeEvents() {
        // A workaround for attaching the resize event to the Iframe window because the plotly
        // library does not support it. This fix will be done in the web modeler preview class when the
        // plotly library starts supporting listening to Iframe events.
        const iFrame = document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
        if (iFrame) {
            (iFrame.contentWindow || iFrame.contentDocument).addEventListener("resize", this.onResize);
        } else {
            window.addEventListener("resize", this.onResize);
        }
    }

    private renderChart(props: LineChartProps) {
        const data = props.data && props.data.length ? props.data : this.data;
        if (this.lineChart) {
            Plotly.newPlot(this.lineChart, data, this.props.layout, this.props.config)
                .then(myPlot => myPlot.on("plotly_click", () => {
                    if (props.onClickAction) {
                        props.onClickAction();
                    }
                }));
        }
    }

    private onResize() {
        Plotly.Plots.resize(this.lineChart);
    }
}
