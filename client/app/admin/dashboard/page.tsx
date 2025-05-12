"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Home, Users, Clock, DollarSign, Plus, Download } from "lucide-react";
import { getAdminDashboardStats } from "@/api/admin.api";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyStats {
  total: number;
  active: number;
  pending: number;
  sold: number;
}

interface UserStats {
  total: number;
  buyers: number;
  sellers: number;
  agents: number;
}

interface TransactionStats {
  total: number;
  completed: number;
  pending: number;
  value: number;
}

interface ChartData {
  labels: string[];
  values: number[];
}

interface DashboardData {
  properties: PropertyStats;
  users: UserStats;
  transactions: TransactionStats;
  recentTransactions: {
    _id: string;
    amount: number;
    date: string;
    status: string;
  }[];
  propertyListings: ChartData;
  salesData: ChartData;
  userGrowth: ChartData;
  usersByRole: {
    _id: string;
    count: number;
  }[];
  propertiesByStatus: {
    _id: string;
    count: number;
  }[];
  recentActivity: {
    firstName: string;
    lastName: string;
    lastLogin: string;
  }[];
  monthlyStats: {
    users: number[];
    properties: number[];
  };
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboardPage() {
  // const [dateRange, setDateRange] = useState<Date[] | undefined>([
  //   new Date(),
  //   new Date(),
  // ]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboardStats();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare metrics data
  const metrics = [
    {
      title: "Total Properties",
      value: loading
        ? "..."
        : dashboardData?.properties?.total.toLocaleString() || "0",
      icon: Home,
    },
    {
      title: "Active Users",
      value: loading
        ? "..."
        : dashboardData?.users?.total.toLocaleString() || "0",
      icon: Users,
    },
    {
      title: "Pending Approvals",
      value: loading
        ? "..."
        : dashboardData?.transactions?.pending.toLocaleString() || "0",
      icon: Clock,
    },
    {
      title: "Daily Transactions",
      value: loading
        ? "..."
        : `$${dashboardData?.transactions?.value.toLocaleString() || "0"}`,
      icon: DollarSign,
    },
  ];

  // Prepare recent activity data
  const recentActivity = loading
    ? Array(5).fill({
        action: "Loading...",
        user: "Loading...",
        time: "Loading...",
      })
    : dashboardData?.recentActivity?.map(
        (activity: DashboardData["recentActivity"][0]) => {
          let time = "N/A";
          try {
            // Validate date string before attempting to create a Date object
            if (activity.lastLogin && typeof activity.lastLogin === "string") {
              const date = new Date(activity.lastLogin);
              // Check if date is valid
              if (!isNaN(date.getTime())) {
                time = date.toLocaleString();
              }
            }
          } catch (error) {
            console.error("Error formatting date:", error);
          }

          return {
            action: "User login",
            user: `${activity.firstName} ${activity.lastName}`,
            time,
          };
        }
      ) || [];

  // Prepare chart data for user growth
  const userGrowthData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: dashboardData?.monthlyStats?.users || Array(12).fill(0),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Prepare chart data for property listings
  const propertyListingsData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Properties",
        data: dashboardData?.monthlyStats?.properties || Array(12).fill(0),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          {/* <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button> */}
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{metric.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <Bar
                data={userGrowthData}
                height={300}
                options={{ responsive: true }}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Property Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <Line
                data={propertyListingsData}
                height={300}
                options={{ responsive: true }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    ))
                : recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-gray-500">
                          {activity.user}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="rounded-md border"
            />
          </CardContent>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution by Role</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="space-y-4">
                {dashboardData?.usersByRole?.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            role._id === "admin"
                              ? "red"
                              : role._id === "agent"
                              ? "blue"
                              : role._id === "seller"
                              ? "green"
                              : "purple",
                        }}
                      />
                      <span className="capitalize">{role._id}</span>
                    </div>
                    <span>{role.count}</span>
                  </div>
                )) || <div>No role data available</div>}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Property Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="space-y-4">
                {dashboardData?.propertiesByStatus?.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            status._id === "active"
                              ? "green"
                              : status._id === "pending"
                              ? "orange"
                              : status._id === "sold"
                              ? "blue"
                              : "gray",
                        }}
                      />
                      <span className="capitalize">{status._id}</span>
                    </div>
                    <span>{status.count}</span>
                  </div>
                )) || <div>No status data available</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
