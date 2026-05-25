import { SCHEDULE_DIRECTIONS, SCHEDULE_OPERATING_DAYS, SCHEDULE_USER_TYPES } from "../constants";

export const groupSchedule = (apiResponse) => {
  if (!apiResponse || !apiResponse.schedules) return {};

  const schedulesData = apiResponse.schedules;
  let routeId = null;

  const grouped = {
    route: null,
    students: {
      weekdays: { to: [], from: [] },
      friday: { to: [], from: [] },
    },
    employees: {
      weekdays: { to: [], from: [] },
      friday: { to: [], from: [] },
    },
  };

  // Loop through to_campus and from_campus
  Object.entries(schedulesData).forEach(([directionKey, userGroups]) => {
    const direction = directionKey === "to_campus" ? SCHEDULE_DIRECTIONS.TO_CAMPUS : SCHEDULE_DIRECTIONS.FROM_CAMPUS;

    // student + employee
    Object.entries(userGroups).forEach(([userTypeKey, list]) => {
      list.forEach((schedule) => {
        routeId = routeId || schedule.routeId?._id || schedule.routeId;

        const userGroup = schedule.userType === SCHEDULE_USER_TYPES.STUDENT ? grouped.students : grouped.employees;

        const dayGroup =
          schedule.operatingDays === SCHEDULE_OPERATING_DAYS.WEEKDAYS ? userGroup.weekdays : userGroup.friday;

        if (direction === SCHEDULE_DIRECTIONS.TO_CAMPUS) {
          dayGroup.to.push(schedule);
        } else {
          dayGroup.from.push(schedule);
        }
      });
    });
  });

  grouped.route = routeId;
  return grouped;
};

export const formatTime = (time) => {
  if (!time.includes(":")) {
    if (time.length === 3) {
      return `${time.slice(0, 1)}:${time.slice(1)}`;
    }
    return `${time.slice(0, 2)}:${time.slice(2)}`;
  }
  return time;
};

export const getEnumLabel = (value) => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
