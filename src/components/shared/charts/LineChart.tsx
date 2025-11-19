export const LineChart = ({ data }: { data: number[] }) => (
  <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
    Chart: {data.length} points
  </div>
);
