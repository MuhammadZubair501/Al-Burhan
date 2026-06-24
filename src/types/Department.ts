import ApiRoutes from "../services/ApiRoutes";

export type Item = {
  id: number;
  name: string;
};

const loadDepartments = async (campusId: number): Promise<Item[]> => {
  try {
    console.log("Fetching for Campus ID:", campusId);
    const res = await fetch(ApiRoutes.departmentByCampusId(campusId));
    const data = await res.json();
    
    // This transforms the raw server keys into 'id' and 'name'
    return data.map((x: any) => ({
      id: Number(x.department_id),
      name: String(x.department_name),
    }));
  } catch (err) {
    console.error(err);
    return []; // Return empty list if it fails
  }
};

export default loadDepartments;
