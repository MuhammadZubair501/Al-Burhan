import ApiRoutes from "../services/ApiRoutes";

export type Item = {
  id: number;
  name: string;
};

const loadDegrees = async (): Promise<Item[]> => {
  try {
    const res = await fetch(ApiRoutes.DEGREE);
    const data = await res.json();

    return data.map((x: any) => ({
      id: Number(x.degree_id),
      name: String(x.degree_name),
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default loadDegrees;