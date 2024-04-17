import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './analytics.css'
// eslint-disable-next-line
import Chart from 'chart.js/auto';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://product-and-sales-manager-server.onrender.com/products');
        setData(response.data.products);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
      }, {});

      const newCharts = Object.keys(groupedData).map((type, index) => {
        const chartData = {
          labels: groupedData[type].map(item => item.productName),
          datasets: [
            {
              label: 'Price',
              data: groupedData[type].map(item => item.price),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        };

        // Customize chart options
        const chartOptions = {
          scales: {
            y: {
              beginAtZero: true // Start Y-axis from 0
            },
            x: {
              barThickness: 1 // Adjust bar thickness to reduce gap between labels
            }
          }
        };

        return (
          <div key={type} className='chart'>
            <h2>{type} Products</h2>
            <Line data={chartData} options={chartOptions} id={`chart-${index}`} />
          </div>
        );
      });

      setCharts(newCharts);
    }
  }, [data]);

  useEffect(() => {
    // Destroy existing charts before rendering new ones
    return () => {
      charts?.forEach((chart , index) => {
        const chartInstance = chart.chartInstance;
        if (chartInstance) {
          chartInstance.destroy();
        }
      });
    };
  }, [charts]);

  return <div>{charts}</div>;
};

export default Analytics;
