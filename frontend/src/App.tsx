import { useEffect, useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import { DataTable } from "./components/events/DataTable";
import { CreateEventModal } from "./components/CreateEventModal";
import { eventsService } from "./services/eventsService";
import type { Event } from "./types/events";

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<1 | 7 | 30 | "lastYear">(30);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadEvents = async (days: 1 | 7 | 30 | "lastYear" = 7) => {
    try {
      setIsLoading(true);
      const { timeMin, timeMax } = eventsService.getDateRange(days);
      const fetchedEvents = await eventsService.fetchEvents({
        timeMin,
        timeMax,
      });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await eventsService.refreshEvents();
      // Reload events after refresh
      await loadEvents(dateRange);
    } catch (error) {
      console.error("Failed to refresh events:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDateRangeChange = async (days: 1 | 7 | 30 | "lastYear") => {
    setDateRange(days);
    await loadEvents(days);
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await eventsService.syncWithGoogle();
      // Reload events after sync
      await loadEvents(dateRange);
    } catch (error) {
      console.error("Failed to sync with Google Calendar:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadEvents(dateRange);
  }, [dateRange]);

  return (
    <main className="min-h-screen bg-gray-50 w-full">
      <div className="mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold mb-6">Calendar Events</h1>

        <AppHeader onSync={handleSync} isSyncing={isSyncing} />

        <section className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Events</h2>

            <div className="flex gap-4 items-center">
              {/* Date Range Dropdown Selector */}
              <select
                value={dateRange}
                onChange={(e) => {
                  const value = e.target.value;
                  handleDateRangeChange(
                    value === "lastYear"
                      ? "lastYear"
                      : (Number(value) as 1 | 7 | 30),
                  );
                }}
                className="px-4 py-2 rounded font-medium border-2 border-blue-500 text-gray-800 bg-white hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <option value={1}>1 Day</option>
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
                <option value="lastYear">Last Year</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>

              {/* Create Event Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
              >
                + Create Event
              </button>
            </div>
          </div>

          <DataTable data={events} isLoading={isLoading} />
        </section>

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onEventCreated={() => loadEvents(dateRange)}
        />
      </div>
    </main>
  );
}

export default App;
