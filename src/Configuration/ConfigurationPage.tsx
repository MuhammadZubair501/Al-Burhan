import {
  Layers3,
  BookOpen,
  Building2,
  Cog,
  GraduationCap,
} from "lucide-react";

import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ConfigColumn from "./ConfigColumn";
import ApiRoutes from "../services/ApiRoutes";

type Item = {
  id: number;
  name: string;
};

const campusId = Number(window.CampusID);

export default function ConfigurationPage() {
  const [batches, setBatches] = useState<Item[]>([]);
  const [subjects, setSubjects] = useState<Item[]>([]);
  const [departments, setDepartments] = useState<Item[]>([]);
  const [degrees, setDegrees] = useState<Item[]>([]);
  
  const loadBatches = async () => {
    try {
      const res = await fetch(ApiRoutes.BATCH);
      const data = await res.json();
      setBatches(
        data.map((x: any) => ({
          id: x.batch_id,
          name: x.batch_name,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadSubjects = async () => {
    try {
      const res = await fetch(ApiRoutes.SUBJECT);
      const data = await res.json();
      setSubjects(
        data.map((x: any) => ({
          id: x.subject_id,
          name: x.subject_name,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadDepartments = async () => {
    try {
      const campusId = Number(window.CampusID);
      console.log("Campus ID:", campusId);
      const res = await fetch(ApiRoutes.departmentByCampusId(campusId));
      const data = await res.json();
      console.log("Departments:", data);
      setDepartments(
        data.map((x: any) => ({
          id: x.department_id,
          name: x.department_name,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadDegrees = async () => {
    try {
      const res = await fetch(ApiRoutes.DEGREE);
      const data = await res.json();
      setDegrees(
        data.map((x: any) => ({
          id: x.degree_id,
          name: x.degree_name,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBatches();
    loadSubjects();
    loadDepartments();
    loadDegrees();
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Configuration"
        description="Manage Batches, Subjects & Departments"
        Icon={Cog}
      />

      <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-full min-h-[600px] sm:min-h-[500px] md:min-h-[400px]">
          <ConfigColumn
            title="Batches"
            icon={<Layers3 size={18} />}
            items={batches}
            campusId={campusId}
            reload={loadBatches}
          />

          <ConfigColumn
            title="Subjects"
            icon={<BookOpen size={18} />}
            items={subjects}
            campusId={campusId}
            reload={loadSubjects}
          />

          <ConfigColumn
            title="Departments"
            icon={<Building2 size={18} />}
            items={departments}
            campusId={campusId}
            reload={loadDepartments}
          />
          
          <ConfigColumn
            title="Highest Degrees"
            icon={<GraduationCap size={18} />}
            items={degrees}
            campusId={campusId}
            reload={loadDegrees}
          />
        </div>
      </div>
    </div>
  );
}