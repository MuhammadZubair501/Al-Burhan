import {
  Layers3,
  BookOpen,
  Building2,
  Cog,
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
      // const res = await fetch(ApiRoutes.DEPARTMENT);
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

  useEffect(() => {
    loadBatches();
    loadSubjects();
    loadDepartments();
  }, []);

  return (
    <div className="h-full overflow-hidden">
      <PageHeader
        title="Configuration"
        description="Manage Batches, Subjects & Departments"
        Icon={Cog}
      />

      <div className="p-4 grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 h-[calc(100vh-180px)]">
        <ConfigColumn
          title="Batches"
          icon={<Layers3 size={22} />}
          items={batches}
          campusId={campusId}
          reload={loadBatches}
        />

        <ConfigColumn
          title="Subjects"
          icon={<BookOpen size={22} />}
          items={subjects}
          campusId={campusId}
          reload={loadSubjects}
        />

        <ConfigColumn
          title="Departments"
          icon={<Building2 size={22} />}
          items={departments}
          campusId={campusId}
          reload={loadDepartments}
        />
      </div>
    </div>
  );
}