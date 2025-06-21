import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Users,
  Bell,
  Calendar as CalendarIcon,
  Mail,
  AlertTriangle,
  Check,
  Clock,
  Camera,
} from "lucide-react";
import NotificationSettings from "./NotificationSettings";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPatientMedications = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://medicaredaveed.onrender.com/api/medications", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


const CaretakerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: meds = [], isLoading } = useQuery({
    queryKey: ["caretaker-meds"],
    queryFn: fetchPatientMedications,
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const takenToday = meds.some((m) => m.is_taken_today);
  const adherenceRate = meds.length
    ? Math.round(
        (meds.filter((m) => m.is_taken_today).length / meds.length) * 100
      )
    : 0;

  const takenDates = new Set(
    meds.filter((m) => m.is_taken_today).map(() => todayStr)
  );

  const currentStreak = (() => {
    let streak = 0;
    let current = new Date();
    while (takenDates.has(format(current, "yyyy-MM-dd"))) {
      streak++;
      current.setDate(current.getDate() - 1);
    }
    return streak;
  })();

  const handleSendReminderEmail = () => {
    alert("Reminder email sent to patient");
  };

  const handleConfigureNotifications = () => setActiveTab("notifications");
  const handleViewCalendar = () => setActiveTab("calendar");

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
            <p className="text-white/90 text-lg">
              Monitoring patient's medication adherence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{adherenceRate}%</div>
            <div className="text-white/80">Adherence Rate</div>
          </Card>
          <Card className="bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-white/80">Current Streak</div>
          </Card>
          <Card className="bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {meds.length - meds.filter((m) => m.is_taken_today).length}
            </div>
            <div className="text-white/80">Missed This Month</div>
          </Card>
          <Card className="bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {meds.filter((m) => m.is_taken_today).length}
            </div>
            <div className="text-white/80">Taken This Month</div>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Medication List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Today's Medication</CardTitle>
            </CardHeader>
            <CardContent>
              {takenToday ? (
                <Badge variant="secondary">Completed</Badge>
              ) : (
                <Badge variant="destructive">Pending</Badge>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Medication List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {meds.map((med) => (
                <div key={med.id} className="border p-3 rounded-md">
                  <div className="font-semibold">{med.name}</div>
                  <div>Dosage: {med.dosage}</div>
                  <div>Frequency: {med.frequency}</div>
                  <div>Status: {med.is_taken_today ? "✅ Taken" : "❌ Not taken"}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Medication Calendar Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                modifiersClassNames={{
                  selected: "bg-blue-600 text-white hover:bg-blue-700",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const isTaken = takenDates.has(dateStr);
                    const isPast = isBefore(date, startOfDay(new Date()));
                    const isCurrentDay = isToday(date);

                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {isTaken && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {!isTaken && isPast && !isCurrentDay && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
                        )}
                      </div>
                    );
                  },
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaretakerDashboard;
