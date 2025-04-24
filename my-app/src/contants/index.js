import { citys } from "./citys";
import { places } from "./places";
import { trips } from "./trips";
import { users } from "./users";

const initAllData = () => {
  if (localStorage.getItem("citys") === null) {
    localStorage.setItem("citys", JSON.stringify(citys));
  }
  if (localStorage.getItem("places") === null) {
    localStorage.setItem("places", JSON.stringify(places));
  }
  if (localStorage.getItem("trips") === null) {
    localStorage.setItem("trips", JSON.stringify(trips));
  }
  if (localStorage.getItem("users") === null) {
    localStorage.setItem("users", JSON.stringify(users));
  }
};

export { initAllData, citys, trips};
