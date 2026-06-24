interface CampusType {
  campus_id: number;
  campus_name: string;
  address: string;
  phone_number: string;
  location: string;
  poc_name: string;
  has_morning_shift: number;
  has_evening_shift: number;
  is_main_campus: number;
  detail: string;
}
export type { CampusType };