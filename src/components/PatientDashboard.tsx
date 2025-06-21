import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar as CalendarIcon, User } from "lucide-react";
import MedicationTracker from "./MedicationTracker";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const PatientDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "" });

  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const isTodaySelected = isToday(selectedDate);

  const fetchMeds = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/medications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const { data: meds, refetch, isLoading } = useQuery({
    queryKey: ["medications"],
    queryFn: fetchMeds,
  });

  const getStreakCount = () => {
    let streak = 0;
    let currentDate = new Date(today);
    const takenDates = new Set(
      meds?.filter((m) => m.is_taken_today).map((m) => todayStr)
    );

    while (takenDates.has(format(currentDate, "yyyy-MM-dd")) && streak < 30) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  };

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              Good{" "}
              {new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() < 18
                ? "Afternoon"
                : "Evening"}
              !
            </h2>
            <p className="text-white/90 text-lg">
              Ready to stay on track with your medication?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{getStreakCount()}</div>
            <div className="text-white/80">Day Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {meds?.some((m) => m.is_taken_today) ? "✓" : "○"}
            </div>
            <div className="text-white/80">Today's Status</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {meds ? Math.round((meds.filter((m) => m.is_taken_today).length / meds.length) * 100) : 0}%
            </div>
            <div className="text-white/80">Taken This Month</div>
          </div>
        </div>
      </div>

      {/* Medication Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Medication</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              await axios.post("http://localhost:5000/api/medications", form, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setForm({ name: "", dosage: "", frequency: "" });
              refetch();
            }}
            className="flex flex-col md:flex-row gap-2"
          >
            <input
              className="border p-2 flex-1"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border p-2 flex-1"
              placeholder="Dosage"
              value={form.dosage}
              onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            />
            <input
              className="border p-2 flex-1"
              placeholder="Frequency"
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      {/* Medication List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Medications</CardTitle>
        </CardHeader>
        <CardContent>
          {meds?.map((med) => (
            <div
              key={med.id}
              className="border p-3 rounded mb-2 bg-white shadow"
            >
              <div className="font-semibold">{med.name}</div>
              <div>Dosage: {med.dosage}</div>
              <div>Frequency: {med.frequency}</div>
              <div>Status: {med.is_taken_today ? "✅ Taken" : "❌ Not taken"}</div>
              {!med.is_taken_today && (
                <Button
                  className="mt-2"
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    await axios.patch(
                      `http://localhost:5000/api/medications/${med.id}/taken`,
                      {},
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    refetch();
                  }}
                >
                  Mark as Taken
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Medication Calendar</CardTitle>
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
                const isTaken = meds?.some((m) => m.is_taken_today && dateStr === todayStr);
                const isPast = isBefore(date, startOfDay(today));
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

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Medication taken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>Missed medication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
