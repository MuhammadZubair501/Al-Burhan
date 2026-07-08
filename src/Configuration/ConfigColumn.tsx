import { useState } from "react";
import ApiRoutes from "../services/ApiRoutes";
import ConfigColumnHeader from "./ConfigColumnHeader";
import ConfigItem from "./ConfigItem";
import AddInput from "./AddInput";
import ConfigFooter from "./ConfigFooter";
import Swal from "sweetalert2";

type Item = {
  id: number;
  name: string;
};

type ColumnProps = {
  title: string;
  icon: React.ReactNode;
  items: Item[];
  campusId: number;
  reload: () => void;
};

export default function ConfigColumn({
  title,
  icon,
  items,
  reload,
}: ColumnProps) {
  const [newItem, setNewItem] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addRecord = async () => {
    if (!newItem.trim()) return;

    try {
      let endpoint = "";
      let body = {};

      if (title === "Batches") {
        endpoint = ApiRoutes.BATCH;
        body = { batch_name: newItem };
      }

      if (title === "Subjects") {
        endpoint = ApiRoutes.SUBJECT;
        body = { subject_name: newItem };
      }

      if (title === "Departments") {
        endpoint = ApiRoutes.DEPARTMENT;
        const campusId = Number(window.CampusID);
        body = {
          campus_id: campusId,
          department_name: newItem,
        };
      }

      if (title === "Highest Degrees") {
        endpoint = ApiRoutes.DEGREE;
        body = {
          degree_name: newItem,
        };
      }

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      reload();
      setNewItem("");
      setShowAddInput(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateRecord = async (id: number) => {
    if (!editingValue.trim()) return;

    try {
      let endpoint = "";
      let body = {};

      if (title === "Batches") {
        endpoint = ApiRoutes.batchById(id);
        body = { batch_name: editingValue };
      }

      if (title === "Subjects") {
        endpoint = ApiRoutes.subjectById(id);
        body = { subject_name: editingValue };
      }

      if (title === "Departments") {
        endpoint = ApiRoutes.departmentById(id);
        body = { department_name: editingValue };
      }

      if (title === "Highest Degrees") {
        endpoint = ApiRoutes.degreeById(id);
        body = {
          degree_name: editingValue,
        };
      }

      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      reload();
      setEditingId(null);
      setEditingValue("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRecord = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Qasam kaha tujay ya delete krana ha",
        text: "permanently delete ho jae ga agr such ma tujay delete krna ha tu qasam kah kr delete kr",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Nahe Qasam Nahe Kah Sakta",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Qasam kahta ho",
        customClass: {
          popup: 'rounded-2xl p-4 sm:p-6',
          title: 'text-base sm:text-lg md:text-xl',
          htmlContainer: 'text-sm sm:text-base',
          confirmButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
          cancelButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
        }
      });

      if (!result.isConfirmed) return;

      let endpoint = "";

      if (title === "Batches")
        endpoint = ApiRoutes.batchById(id);

      if (title === "Subjects")
        endpoint = ApiRoutes.subjectById(id);

      if (title === "Departments")
        endpoint = ApiRoutes.departmentById(id);

      if (title === "Highest Degrees")
        endpoint = ApiRoutes.degreeById(id);

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      await Swal.fire({
        icon: "success",
        title: "Delete ho gya",
        text: "permanently delete ho gya ab dubara nahe milay ga ya record",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl p-4 sm:p-6',
          title: 'text-base sm:text-lg md:text-xl',
          htmlContainer: 'text-sm sm:text-base',
        }
      });

      reload();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while deleting.",
        customClass: {
          popup: 'rounded-2xl p-4 sm:p-6',
          title: 'text-base sm:text-lg md:text-xl',
          htmlContainer: 'text-sm sm:text-base',
        }
      });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-xl h-full min-h-[320px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px]">
      <ConfigColumnHeader title={title} icon={icon} itemsCount={items.length} />

      <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
        {showAddInput && (
          <AddInput
            value={newItem}
            onChange={setNewItem}
            onSave={addRecord}
            onCancel={() => {
              setShowAddInput(false);
              setNewItem("");
            }}
            placeholder={`Enter ${title.slice(0, -1)} Name`}
          />
        )}

        {items.length === 0 && !showAddInput ? (
          <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 text-green-200/40 text-xs sm:text-sm">
            No {title.toLowerCase()} found
          </div>
        ) : (
          items.map((item) => (
            <ConfigItem
              key={item.id}
              item={item}
              isEditing={editingId === item.id}
              editingValue={editingValue}
              onEditChange={setEditingValue}
              onSave={() => updateRecord(item.id)}
              onCancel={() => {
                setEditingId(null);
                setEditingValue("");
              }}
              onEdit={() => {
                setEditingId(item.id);
                setEditingValue(item.name);
              }}
              onDelete={() => deleteRecord(item.id)}
            />
          ))
        )}
      </div>

      <ConfigFooter
        title={title}
        onAdd={() => setShowAddInput(true)}
      />
    </div>
  );
}