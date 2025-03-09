"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

type ChartComponentProps = {
  type: string;
  data: any;
};

export function ChartComponent({ type, data }: ChartComponentProps) {
  const chartComponents = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    radar: Radar,
    polarArea: PolarArea,
  };

  const ChartType = chartComponents[type as keyof typeof chartComponents];

  if (!ChartType) {
    return <div>Unsupported chart type</div>;
  }

  return <ChartType data={data} />;
}
