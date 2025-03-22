import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

const CryptoChart = () => {
  //   const [prices, setPrices] = useState<{ usdc: number; sol: number }>({
  //     usdc: 1,
  //     sol: 0,
  //   });
  const [chartData, setChartData] = useState<number[]>([]);
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // const res = await axios.get(
        //   "https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd"
        // );
        // setPrices({
        //   usdc: res.data["usd-coin"].usd,
        //   sol: res.data["solana"].usd,
        // });
      } catch (error) {
        console.error("Error fetching prices", error);
      }
    };

    const fetchChartData = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=1"
        );
        setChartData(res.data.prices.map((p: number[]) => p[1]));
      } catch (error) {
        console.error("Error fetching chart data", error);
      }
    };

    fetchPrices();
    fetchChartData();
  }, []);
  return (
    <div className="mt-6 w-full">
      <div>
        <div className=" bg-black/40 rounded-lg flex items-center justify-center">
          <div className="text-gray-600">
            <Line
              data={{
                labels: Array.from({ length: chartData.length }, (_, i) => i),
                datasets: [
                  {
                    label: "SOL Price (USD)",
                    data: chartData,
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoChart;
