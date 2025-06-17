// import BoxHeader from "@/components/BoxHeader";
// import DashboardBox from "@/components/DashboardBox";
// import FlexBetween from "@/components/FlexBetween";
// import {
//   useGetKpisQuery,
//   useGetProductsQuery,
//   useGetTransactionsQuery,
// } from "@/state/api";
// import { Box, Typography, useTheme } from "@mui/material";
// import { DataGrid, GridCellParams } from "@mui/x-data-grid";
// import React, { useMemo } from "react";
// import { Cell, Pie, PieChart } from "recharts";

// const Row3 = () => {
//   const { palette } = useTheme();
//   const pieColors = [palette.primary[800], palette.primary[500]];

//   const { data: kpiData } = useGetKpisQuery();
//   const { data: productData } = useGetProductsQuery();
//   const { data: transactionData } = useGetTransactionsQuery();

//   const pieChartData = useMemo(() => {
//     if (kpiData) {
//       const totalExpenses = kpiData[0].totalExpenses;
//       return Object.entries(kpiData[0].expensesByCategory).map(
//         ([key, value]) => {
//           return [
//             {
//               name: key,
//               value: value,
//             },
//             {
//               name: `${key} of Total`,
//               value: totalExpenses - value,
//             },
//           ];
//         }
//       );
//     }
//   }, [kpiData]);

//   const productColumns = [
//     {
//       field: "_id",
//       headerName: "id",
//       flex: 1,
//     },
//     {
//       field: "expense",
//       headerName: "Expense",
//       flex: 0.5,
//       renderCell: (params: GridCellParams) => `$${params.value}`,
//     },
//     {
//       field: "price",
//       headerName: "Price",
//       flex: 0.5,
//       renderCell: (params: GridCellParams) => `$${params.value}`,
//     },
//   ];

//   const transactionColumns = [
//     {
//       field: "_id",
//       headerName: "id",
//       flex: 1,
//     },
//     {
//       field: "buyer",
//       headerName: "Buyer",
//       flex: 0.67,
//     },
//     {
//       field: "amount",
//       headerName: "Amount",
//       flex: 0.35,
//       renderCell: (params: GridCellParams) => `$${params.value}`,
//     },
//     {
//       field: "productIds",
//       headerName: "Count",
//       flex: 0.1,
//       renderCell: (params: GridCellParams) =>
//         (params.value as Array<string>).length,
//     },
//   ];

//   return (
//     <>
//       <DashboardBox gridArea="g">
//         <BoxHeader
//           title="List of Products"
//           sideText={`${productData?.length} products`}
//         />
//         <Box
//           mt="0.5rem"
//           p="0 0.5rem"
//           height="75%"
//           sx={{
//             "& .MuiDataGrid-root": {
//               color: palette.grey[300],
//               border: "none",
//             },
//             "& .MuiDataGrid-cell": {
//               borderBottom: `1px solid ${palette.grey[800]} !important`,
//             },
//             "& .MuiDataGrid-columnHeaders": {
//               borderBottom: `1px solid ${palette.grey[800]} !important`,
//             },
//             "& .MuiDataGrid-columnSeparator": {
//               visibility: "hidden",
//             },
//           }}
//         >
//           <DataGrid
//             columnHeaderHeight={25}
//             rowHeight={35}
//             hideFooter={true}
//             rows={productData || []}
//             columns={productColumns}
//           />
//         </Box>
//       </DashboardBox>
//       <DashboardBox gridArea="h">
//         <BoxHeader
//           title="Recent Orders"
//           sideText={`${transactionData?.length} latest transactions`}
//         />
//         <Box
//           mt="1rem"
//           p="0 0.5rem"
//           height="80%"
//           sx={{
//             "& .MuiDataGrid-root": {
//               color: palette.grey[300],
//               border: "none",
//             },
//             "& .MuiDataGrid-cell": {
//               borderBottom: `1px solid ${palette.grey[800]} !important`,
//             },
//             "& .MuiDataGrid-columnHeaders": {
//               borderBottom: `1px solid ${palette.grey[800]} !important`,
//             },
//             "& .MuiDataGrid-columnSeparator": {
//               visibility: "hidden",
//             },
//           }}
//         >
//           <DataGrid
//             columnHeaderHeight={25}
//             rowHeight={35}
//             hideFooter={true}
//             rows={transactionData || []}
//             columns={transactionColumns}
//           />
//         </Box>
//       </DashboardBox>
//       <DashboardBox gridArea="i">
//         <BoxHeader
//           title="List of Products"
//           sideText={`${productData?.length} products`}
//         />
//         <Box
//           mt="0.5rem"
//           p="0 0.5rem"
//           height="75%"
//           sx={{
//             "& .MuiDataGrid-root": {
//               color: palette.grey[300],
//               border: "none",
//             },
//             "& .MuiDataGrid-cell": {
//               borderBottom: `1px solid ${palette.grey[800]} !important`,
//             },
//             "& .MuiDataGrid-columnHeaders": {
//               borderBottom: `1px solid ${palette.grey[800]} !important`,
//             },
//             "& .MuiDataGrid-columnSeparator": {
//               visibility: "hidden",
//             },
//           }}
//         >
//           <DataGrid
//             columnHeaderHeight={25}
//             rowHeight={35}
//             hideFooter={true}
//             rows={productData || []}
//             columns={productColumns}
//           />
//         </Box>
//       </DashboardBox>
      
//     </>
//   );
// };

// export default Row3;

import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import {
  Tooltip,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const pieData = [
  { name: "Group A", value: 600 },
  { name: "Group B", value: 400 },
];

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[300]];
  const { data: operationalData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();

  const operationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3),
            "Operational Expenses": operationalExpenses,
            "Non Operational Expenses": nonOperationalExpenses,
          };
        }
      )
    );
  }, [operationalData]);

  const productExpenseData = useMemo(() => {
    return (
      productData &&
      productData.map(({ _id, price, expense }) => {
        return {
          id: _id,
          price: price,
          expense: expense,
        };
      })
    );
  }, [productData]);

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader
          title="Operational vs Non-Operational Expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={operationalExpenses}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Non Operational Expenses"
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Operational Expenses"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox> 
      <DashboardBox gridArea="h">
        <BoxHeader
          title="Operational vs Non-Operational Expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={operationalExpenses}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Non Operational Expenses"
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Operational Expenses"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="i">
        <BoxHeader
          title="Operational vs Non-Operational Expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={operationalExpenses}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Non Operational Expenses"
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Operational Expenses"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      
    </>
  );
};

export default Row3;