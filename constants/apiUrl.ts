const apiUrls = {
  local: "http://localhost:3002/api",
  production_old: "https://psychological-codi-abm-apps-150283cd.koyeb.app/api",
  production: "https://abnovamart-backend.onrender.com/api",
};

// UNCOMMENT THIS FOR PRODUCTION
// export const BASE_URL =
//   process.env.NODE_ENV === "development" ? apiUrls.local : apiUrls.production;

// REMOVE AFTER DEVELOPMENT IS DONE
export const BASE_URL = apiUrls.production;
