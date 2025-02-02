"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface CourseDetail {
  courseCode: string;
  courseTitle: string;
  instructor: string;
}

export default function TimetableStudent() {
  const [timetable, setTimetable] = useState<Record<string, string[]>>({});
  const [courseDetails, setCourseDetails] = useState<CourseDetail[]>([]);
  const [batch, setBatch] = useState("20");
  const [branch, setBranch] = useState("Computer Science");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const docRef = doc(db, "timetables", `${batch}-${branch}`);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setTimetable(snapshot.data().timetable || {});
        setCourseDetails(snapshot.data().courseDetails || []);
      } else {
        setTimetable({});
        setCourseDetails([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [batch, branch]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Student Timetable</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select value={batch} onChange={(e) => setBatch(e.target.value)} className="p-2 border rounded">
          {["20", "21", "22", "23", "24"].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="p-2 border rounded">
          {["Computer Science", "AI & DS", "Mathematics & Computing"].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-4 shadow-md rounded-lg overflow-x-auto">
          {/* Timetable Table */}
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Day</th>
                {["09:00 - 09:55", "10:00 - 10:55", "11:00 - 11:55", "12:00 - 12:55", "1:00 - 2:30 (Lunch)", "2:30 - 3:55", "4:00 - 5:25"].map((slot, index) => (
                  <th key={index} className="border p-2">{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(timetable).map(([day, slots]) => (
                <tr key={day}>
                  <td className="border p-2 font-semibold">{day}</td>
                  {slots.map((slot, index) => (
                    <td key={index} className="border p-2">{index === 4 ? "LUNCH" : slot || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Course Details Table */}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Course Code</th>
                <th className="border p-2">Course Title</th>
                <th className="border p-2">Instructor</th>
              </tr>
            </thead>
            <tbody>
              {courseDetails.map((course, index) => (
                <tr key={index}>
                  <td className="border p-2">{course.courseCode || "-"}</td>
                  <td className="border p-2">{course.courseTitle || "-"}</td>
                  <td className="border p-2">{course.instructor || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}