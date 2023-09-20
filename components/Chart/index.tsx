import dynamic from "next/dynamic";
import { Props as ApexChartProps } from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type ChartProps = ApexChartProps;
export type ChartSeries = ApexOptions["series"];
export type ChartOptions = ApexOptions;

export const Chart: React.FC<ApexChartProps> = ({ options, ...rest }) => {
  const defaulOptions: ApexOptions = {
    ...options,
    chart: { ...options?.chart, background: "transparent" },
    theme: {
      ...options?.theme,
      palette: "palette7",
      mode: "dark",
    },
  };

  return <ApexChart options={defaulOptions} {...rest} />;
};

export default Chart;
