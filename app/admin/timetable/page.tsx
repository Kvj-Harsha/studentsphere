"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Define the structure of a course detail
interface CourseDetail {
  courseCode: string;
  courseTitle: string;
  instructor: string;
}

export default function TimetableAdmin() {
  const [timetable, setTimetable] = useState<Record<string, string[]>>({});
  const [courseDetails, setCourseDetails] = useState<CourseDetail[]>([]);
  const [batch, setBatch] = useState("20");
  const [branch, setBranch] = useState("Computer Science");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      const docRef = doc(db, "timetables", `${batch}-${branch}`);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setTimetable(snapshot.data().timetable || {});
        setCourseDetails(snapshot.data().courseDetails || []);
      } else {
        setTimetable({});
        setCourseDetails([]);
      }
      setLoading(false);
    };

    fetchTimetable();
  }, [batch, branch]);

  const createTimetable = async () => {
    const defaultTimetable: Record<string, string[]> = {
      Monday: ["", "", "", "", "lunch", "", ""],
      Tuesday: ["", "", "", "", "lunch", "", ""],
      Wednesday: ["", "", "", "", "lunch", "", ""],
      Thursday: ["", "", "", "", "lunch", "", ""],
      Friday: ["", "", "", "", "lunch", "", ""],
    };

    const defaultCourseDetails: CourseDetail[] = [
      { courseCode: "", courseTitle: "", instructor: "" },
      { courseCode: "", courseTitle: "", instructor: "" },
      { courseCode: "", courseTitle: "", instructor: "" },
      { courseCode: "", courseTitle: "", instructor: "" },
      { courseCode: "", courseTitle: "", instructor: "" },
    ];

    const docRef = doc(db, "timetables", `${batch}-${branch}`);
    await setDoc(docRef, { timetable: defaultTimetable, courseDetails: defaultCourseDetails });

    setTimetable(defaultTimetable);
    setCourseDetails(defaultCourseDetails);
  };

  const saveTimetable = async () => {
    const docRef = doc(db, "timetables", `${batch}-${branch}`);
    await setDoc(docRef, { timetable, courseDetails }, { merge: true });
    setIsEditing(false);
  };

  const handleCourseChange = (index: number, field: keyof CourseDetail, value: string) => {
    setCourseDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = { ...updatedDetails[index], [field]: value };
      return updatedDetails;
    });
  };
  
  return (
    <div className="min-h-screen p-6 bg-black">
      <h2 className="text-2xl font-bold mb-4 text-white ">Admin Timetable</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select value={batch} onChange={(e) => setBatch(e.target.value)} className="p-2 border rounded text-[#7373ff]">
          {["20", "21", "22", "23", "24"].map((b) => (
            <option key={b} value={b} className="text-[#7373ff]">{b}</option>
          ))}
        </select>
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="p-2 border rounded text-[#7373ff]">
          {["Computer Science", "AI & DS", "Mathematics & Computing"].map((b) => (
            <option key={b} value={b} className="text-[#7373ff]">{b}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-[#7373ff]">Loading...</p>
      ) : Object.keys(timetable).length === 0 ? (
        <button onClick={createTimetable} className="bg-[#111184] text-white p-2 rounded">Create Timetable</button>
      ) : (
        <div className="bg-white p-4 shadow-md rounded-lg overflow-x-auto">
          {/* First Table - Timetable */}
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-[#111184] text-white">
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
                    <td key={index} className="border p-2">
                      {index === 4 ? "LUNCH" : (
                        <input
                          type="text"
                          value={slot || ""}
                          onChange={(e) => {
                            const newTimetable = { ...timetable };
                            newTimetable[day][index] = e.target.value;
                            setTimetable(newTimetable);
                          }}
                          className={`w-full p-1 border rounded ${isEditing ? "" : "bg-gray-100"}`}
                          disabled={!isEditing}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Second Table - Course Details (No Days) */}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#111184] text-white">
                <th className="border p-2">Course Code</th>
                <th className="border p-2">Course Title</th>
                <th className="border p-2">Instructor</th>
              </tr>
            </thead>
            <tbody>
              {courseDetails.map((course, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={course.courseCode}
                      placeholder="Course Code"
                      onChange={(e) => handleCourseChange(index, "courseCode", e.target.value)}
                      className={`w-full p-1 border rounded ${isEditing ? "" : "bg-gray-100"}`}
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={course.courseTitle}
                      placeholder="Course Title"
                      onChange={(e) => handleCourseChange(index, "courseTitle", e.target.value)}
                      className={`w-full p-1 border rounded ${isEditing ? "" : "bg-gray-100"}`}
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={course.instructor}
                      placeholder="Instructor"
                      onChange={(e) => handleCourseChange(index, "instructor", e.target.value)}
                      className={`w-full p-1 border rounded ${isEditing ? "" : "bg-gray-100"}`}
                      disabled={!isEditing}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setIsEditing(!isEditing)} className="mt-4 bg-[#111184] text-white p-2 rounded">
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      )}
    </div>
  );
}
