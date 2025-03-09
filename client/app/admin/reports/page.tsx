"use client";

import { useState } from "react";
import { DashboardBuilder } from "@/components/DashboardBuilder";
import { WidgetLibrary } from "@/components/WidgetLibrary";
import { DataExportModal } from "@/components/DataExportModal";
import { ScheduleReportModal } from "@/components/ScheduleReportModal";
import { ComparisonTool } from "@/components/ComparisonTool";
import { TrendAnalysis } from "@/components/TrendAnalysis";
import { CustomMetricCreator } from "@/components/CustomMetricCreator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportsAndAnalyticsPage() {
  const [isWidgetLibraryOpen, setIsWidgetLibraryOpen] = useState(false);
  const [isDataExportModalOpen, setIsDataExportModalOpen] = useState(false);
  const [isScheduleReportModalOpen, setIsScheduleReportModalOpen] =
    useState(false);
  const [widgets, setWidgets] = useState<any[]>([]);

  const addWidget = (widget: any) => {
    setWidgets([...widgets, widget]);
    setIsWidgetLibraryOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="custom-metrics">Custom Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => setIsWidgetLibraryOpen(true)}>
              Add Widget
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDataExportModalOpen(true)}
              >
                Export Data
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsScheduleReportModalOpen(true)}
              >
                Schedule Report
              </Button>
            </div>
          </div>
          <DashboardBuilder widgets={widgets} />
        </TabsContent>

        <TabsContent value="comparison">
          <ComparisonTool />
        </TabsContent>

        <TabsContent value="trends">
          <TrendAnalysis />
        </TabsContent>

        <TabsContent value="custom-metrics">
          <CustomMetricCreator />
        </TabsContent>
      </Tabs>

      <WidgetLibrary
        isOpen={isWidgetLibraryOpen}
        onClose={() => setIsWidgetLibraryOpen(false)}
        onAddWidget={addWidget}
      />
      <DataExportModal
        isOpen={isDataExportModalOpen}
        onClose={() => setIsDataExportModalOpen(false)}
      />
      <ScheduleReportModal
        isOpen={isScheduleReportModalOpen}
        onClose={() => setIsScheduleReportModalOpen(false)}
      />
    </div>
  );
}
