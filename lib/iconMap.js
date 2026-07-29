import { Droplet, Filter, Wrench, Package, Building2, Refrigerator, Tag, Star, Snowflake, Coffee, Waves, ShieldCheck } from "lucide-react";

export const ICON_MAP = {
  Droplet, Filter, Wrench, Package, Building2, Refrigerator, Tag, Star, Snowflake, Coffee, Waves, ShieldCheck,
};

export function getIcon(name) {
  return ICON_MAP[name] || Package;
}
